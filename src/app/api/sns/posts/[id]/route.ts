import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/posts/[id] — 投稿1件取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: post, error } = await supabase
    .from("posts")
    .select("*, public_profiles!inner(nickname, avatar_url, is_public)")
    .eq("id", postId)
    .single();

  if (error || !post) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // 非公開プロフィールの投稿はフォロワー or 本人のみ
  if (!post.public_profiles.is_public && post.user_id !== user.id) {
    const { data: follow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", post.user_id)
      .maybeSingle();
    if (!follow) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // リアクション取得
  const { data: reactions } = await supabase
    .from("reactions")
    .select("reaction_type, user_id")
    .eq("post_id", postId);

  const counts: Record<string, number> = {};
  const myReactions: string[] = [];
  for (const r of reactions || []) {
    counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
    if (r.user_id === user.id) myReactions.push(r.reaction_type);
  }

  // ブックマーク状態
  const { data: bookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  // フォロー状態
  let isFollowing: boolean | null = null;
  if (post.user_id !== user.id) {
    const { data: follow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", post.user_id)
      .maybeSingle();
    isFollowing = !!follow;
  }

  // コメント数
  const { count: commentCount } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postId);

  const enriched = {
    ...post,
    reactions: {
      counts,
      types: Object.keys(counts),
      myReactions,
      total: Object.values(counts).reduce((s, v) => s + v, 0),
    },
    is_bookmarked: !!bookmark,
    is_following: isFollowing,
    comment_count: commentCount || 0,
  };

  return NextResponse.json({ post: enriched });
}
