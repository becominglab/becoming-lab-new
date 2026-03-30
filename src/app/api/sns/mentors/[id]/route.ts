import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/sns/mentors/[id] — accept / decline / withdraw
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { status } = await request.json();
  if (!["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  // mentor のみ accept/decline できる
  const { data, error } = await supabase
    .from("mentor_connections")
    .update({ status })
    .eq("id", id)
    .eq("mentor_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ connection: data });
}

// DELETE /api/sns/mentors/[id] — リクエスト取り消し / 接続解除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { error } = await supabase
    .from("mentor_connections")
    .delete()
    .eq("id", id)
    .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
