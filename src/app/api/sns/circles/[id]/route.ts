import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/circles/[id] — サークル詳細
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: circle, error } = await supabase
    .from("circles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !circle) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // メンバー一覧 (public_profiles JOIN)
  const { data: members } = await supabase
    .from("circle_members")
    .select("role, joined_at, user_id, public_profiles(nickname, avatar_url)")
    .eq("circle_id", id)
    .order("joined_at");

  // 自分の参加状態
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myMembership = (members || []).find((m: any) => m.user_id === user.id);

  return NextResponse.json({
    circle: {
      ...circle,
      member_count: members?.length || 0,
      is_full: (members?.length || 0) >= circle.max_members,
    },
    members: members || [],
    my_role: myMembership?.role || null,
    is_member: !!myMembership,
  });
}

// DELETE /api/sns/circles/[id] — サークル削除 (オーナーのみ)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { error } = await supabase
    .from("circles")
    .delete()
    .eq("id", id)
    .eq("created_by", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
