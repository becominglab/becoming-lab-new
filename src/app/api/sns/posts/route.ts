import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndAwardBadges } from "@/lib/sns/badges";

// GET /api/sns/posts — フィード取得 (カーソルページネーション)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20"), 50);
  const userId = request.nextUrl.searchParams.get("user_id");
  const feed = request.nextUrl.searchParams.get("feed"); // "discover" for discover feed
  const tag = request.nextUrl.searchParams.get("tag"); // filter by tag

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any;

  if (userId) {
    // 特定ユーザーの投稿（プロフィール画面用）
    query = supabase
      .from("posts")
      .select("*, public_profiles!inner(nickname, avatar_url)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
  } else if (feed === "discover") {
    // 発見フィード: 公開ユーザーの全投稿（フォロー状態不問）
    // 自分の投稿は除外しない（自分も公開ユーザーのため含まれる）
    query = supabase
      .from("posts")
      .select("*, public_profiles!inner(nickname, avatar_url, is_public)")
      .eq("public_profiles.is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (tag) {
      query = query.contains("tags", [tag]);
    }
  } else {
    // フォロー中 + 自分
    const { data: followData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetUserIds = [user.id, ...(followData || []).map((f: any) => f.following_id)];

    query = supabase
      .from("posts")
      .select("*, public_profiles!inner(nickname, avatar_url)")
      .in("user_id", targetUserIds)
      .order("created_at", { ascending: false })
      .limit(limit);
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: posts, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 各投稿のリアクション情報を取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postsList: any[] = posts || [];
  const postIds = postsList.map((p) => p.id);
  const reactionsMap: Record<string, { counts: Record<string, number>; myReactions: string[] }> = {};

  if (postIds.length > 0) {
    const { data: reactions } = await supabase
      .from("reactions")
      .select("post_id, reaction_type, user_id")
      .in("post_id", postIds);

    // ブックマーク状態を取得
    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);

    const bookmarkedSet = new Set((bookmarks || []).map((b: { post_id: string }) => b.post_id));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const r of (reactions || []) as any[]) {
      if (!reactionsMap[r.post_id]) {
        reactionsMap[r.post_id] = { counts: {}, myReactions: [] };
      }
      reactionsMap[r.post_id].counts[r.reaction_type] =
        (reactionsMap[r.post_id].counts[r.reaction_type] || 0) + 1;
      if (r.user_id === user.id) {
        reactionsMap[r.post_id].myReactions.push(r.reaction_type);
      }
    }

    // レスポンス構築（リアクション数は全投稿で表示）
    const enrichedPosts = postsList.map((post) => {
      const rData = reactionsMap[post.id] || { counts: {}, myReactions: [] };

      return {
        ...post,
        reactions: {
          counts: rData.counts,
          types: Object.keys(rData.counts),
          myReactions: rData.myReactions,
        },
        is_bookmarked: bookmarkedSet.has(post.id),
      };
    });

    const nextCursor = postsList.length === limit
      ? postsList[postsList.length - 1].created_at
      : null;

    return NextResponse.json({ posts: enrichedPosts, nextCursor });
  }

  // postIds が空の場合
  const nextCursor = postsList.length === limit
    ? postsList[postsList.length - 1].created_at
    : null;

  return NextResponse.json({ posts: postsList, nextCursor });
}

// POST /api/sns/posts — 投稿作成
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { post_type, content, source_id, tags } = body;

  const validTypes = ["update", "auto_log", "declaration", "milestone"];
  if (!validTypes.includes(post_type)) {
    return NextResponse.json({ error: "invalid post_type" }, { status: 400 });
  }

  // update タイプのバリデーション
  if (post_type === "update") {
    const { did, learned, tomorrow } = content || {};
    if (!did?.trim()) {
      return NextResponse.json({ error: "「やったこと」を入力してください" }, { status: 400 });
    }
    // 各フィールド140文字制限
    for (const [key, val] of Object.entries({ did, learned, tomorrow })) {
      if (val && (val as string).length > 140) {
        return NextResponse.json({ error: `${key} は140文字以内で入力してください` }, { status: 400 });
      }
    }
  }

  // タグバリデーション (最大5個、各20文字以内)
  const validTags = Array.isArray(tags) ? tags.slice(0, 5).map((t: string) => t.slice(0, 20).trim()).filter(Boolean) : [];

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      post_type,
      content: content || {},
      source_id: source_id || null,
      tags: validTags,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // バッジチェック
  checkAndAwardBadges(supabase, user.id, ["social"]).catch(() => {});

  return NextResponse.json({ post: data }, { status: 201 });
}

// PATCH /api/sns/posts — 投稿編集
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { id, content, tags } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  // update タイプのバリデーション
  if (content) {
    const { did, learned, tomorrow } = content;
    if (did !== undefined && !did?.trim()) {
      return NextResponse.json({ error: "「やったこと」を入力してください" }, { status: 400 });
    }
    for (const [key, val] of Object.entries({ did, learned, tomorrow })) {
      if (val && (val as string).length > 140) {
        return NextResponse.json({ error: `${key} は140文字以内で入力してください` }, { status: 400 });
      }
    }
  }

  const validTags = Array.isArray(tags) ? tags.slice(0, 5).map((t: string) => t.slice(0, 20).trim()).filter(Boolean) : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};
  if (content) updates.content = content;
  if (validTags !== undefined) updates.tags = validTags;

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

// DELETE /api/sns/posts?id=xxx — 投稿削除
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
