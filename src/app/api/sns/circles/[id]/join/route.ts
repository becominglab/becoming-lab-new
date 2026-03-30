import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/sns/circles/[id]/join — サークル参加
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // 満員チェック
  const { data: circle } = await supabase
    .from("circles")
    .select("max_members")
    .eq("id", id)
    .single();

  if (!circle) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { count } = await supabase
    .from("circle_members")
    .select("id", { count: "exact", head: true })
    .eq("circle_id", id);

  if ((count || 0) >= circle.max_members) {
    return NextResponse.json({ error: "このサークルは満員です" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("circle_members")
    .insert({ circle_id: id, user_id: user.id, role: "member" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "すでに参加しています" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ member: data }, { status: 201 });
}

// DELETE /api/sns/circles/[id]/join — サークル退出
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // オーナーは退出不可（削除のみ）
  const { data: membership } = await supabase
    .from("circle_members")
    .select("role")
    .eq("circle_id", id)
    .eq("user_id", user.id)
    .single();

  if (membership?.role === "owner") {
    return NextResponse.json(
      { error: "オーナーは退出できません。サークルを削除してください。" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("circle_members")
    .delete()
    .eq("circle_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ left: true });
}
