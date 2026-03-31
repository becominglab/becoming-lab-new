import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/posts/[id]/comments — コメント一覧
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 50);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, public_profiles!inner(nickname, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments: (comments || []).map((c: any) => ({
      ...c,
      is_own: c.user_id === user.id,
    })),
  });
}

// POST /api/sns/posts/[id]/comments — コメント投稿
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { content } = await request.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "コメントを入力してください" }, { status: 400 });
  }
  if (content.length > 300) {
    return NextResponse.json({ error: "300文字以内で入力してください" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, content: content.trim() })
    .select("*, public_profiles!inner(nickname, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ comment: { ...data, is_own: true } }, { status: 201 });
}

// DELETE /api/sns/posts/[id]/comments?comment_id=xxx — コメント削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const commentId = request.nextUrl.searchParams.get("comment_id");
  if (!commentId) return NextResponse.json({ error: "comment_id is required" }, { status: 400 });

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
