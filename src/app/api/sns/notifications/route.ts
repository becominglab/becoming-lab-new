import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/notifications — 通知一覧 + 未読数
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const unreadOnly = request.nextUrl.searchParams.get("unread_only") === "true";

  let query = supabase
    .from("notifications")
    .select("*, public_profiles!actor_id(nickname, avatar_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (unreadOnly) query = query.eq("is_read", false);

  const { data: notifications, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 未読数
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  return NextResponse.json({ notifications: notifications || [], unread_count: count || 0 });
}

// PATCH /api/sns/notifications — 全て既読にする
export async function PATCH(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
