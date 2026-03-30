import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/circles/[id]/posts — サークル投稿一覧
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20"), 50);

  let query = supabase
    .from("circle_posts")
    .select("*, public_profiles!inner(nickname, avatar_url)")
    .eq("circle_id", id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: posts, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const list = posts || [];
  const nextCursor = list.length === limit ? list[list.length - 1].created_at : null;

  return NextResponse.json({ posts: list, nextCursor });
}

// POST /api/sns/circles/[id]/posts — サークルに投稿
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { content } = await request.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "投稿内容を入力してください" }, { status: 400 });
  }
  if (content.length > 500) {
    return NextResponse.json({ error: "500文字以内で入力してください" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("circle_posts")
    .insert({ circle_id: id, user_id: user.id, content: content.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}

// DELETE /api/sns/circles/[id]/posts?post_id=xxx — 投稿削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const postId = request.nextUrl.searchParams.get("post_id");
  if (!postId) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const { error } = await supabase
    .from("circle_posts")
    .delete()
    .eq("id", postId)
    .eq("circle_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
