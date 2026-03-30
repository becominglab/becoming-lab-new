import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/bookmarks — ブックマーク一覧
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = 20;

  let query = supabase
    .from("bookmarks")
    .select("post_id, created_at, posts(*, public_profiles!inner(nickname, avatar_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = (data || []).map((b: any) => b.posts).filter(Boolean);
  const nextCursor = data && data.length === limit ? data[data.length - 1].created_at : null;

  return NextResponse.json({ posts, nextCursor });
}

// POST /api/sns/bookmarks — ブックマーク追加
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { post_id } = await request.json();
  if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, post_id });

  if (error) {
    if (error.code === "23505") return NextResponse.json({ bookmarked: true }); // already bookmarked
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarked: true }, { status: 201 });
}

// DELETE /api/sns/bookmarks?post_id=xxx — ブックマーク解除
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const postId = request.nextUrl.searchParams.get("post_id");
  if (!postId) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("post_id", postId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookmarked: false });
}
