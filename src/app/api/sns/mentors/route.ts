import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/mentors?tab=mentors|mentees|requests|find
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const tab = request.nextUrl.searchParams.get("tab") || "find";

  if (tab === "mentors") {
    // 自分のメンター一覧
    const { data } = await supabase
      .from("mentor_connections")
      .select("*, public_profiles!mentor_connections_mentor_id_fkey(nickname, avatar_url, bio, update_phase)")
      .eq("mentee_id", user.id)
      .eq("status", "accepted");
    return NextResponse.json({ connections: data || [] });
  }

  if (tab === "mentees") {
    // 自分のメンティー一覧
    const { data } = await supabase
      .from("mentor_connections")
      .select("*, public_profiles!mentor_connections_mentee_id_fkey(nickname, avatar_url, bio, update_phase)")
      .eq("mentor_id", user.id)
      .eq("status", "accepted");
    return NextResponse.json({ connections: data || [] });
  }

  if (tab === "requests") {
    // 受信したメンターリクエスト (pending)
    const { data } = await supabase
      .from("mentor_connections")
      .select("*, public_profiles!mentor_connections_mentee_id_fkey(nickname, avatar_url, bio, update_phase)")
      .eq("mentor_id", user.id)
      .eq("status", "pending");
    return NextResponse.json({ requests: data || [] });
  }

  // find: メンター候補一覧 (maintaining フェーズ + is_mentor=true)
  const { data: mentors } = await supabase
    .from("public_profiles")
    .select("user_id, nickname, avatar_url, bio, update_phase, challenge_tags")
    .eq("is_public", true)
    .eq("is_mentor", true)
    .eq("update_phase", "maintaining")
    .neq("user_id", user.id)
    .limit(30);

  // 既存接続状態を取得
  const { data: myConnections } = await supabase
    .from("mentor_connections")
    .select("mentor_id, status")
    .eq("mentee_id", user.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionMap = new Map((myConnections || []).map((c: any) => [c.mentor_id, c.status]));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = (mentors || []).map((m: any) => ({
    ...m,
    connection_status: connectionMap.get(m.user_id) || null,
  }));

  return NextResponse.json({ mentors: enriched });
}

// POST /api/sns/mentors — メンターリクエスト送信
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { mentor_id, message } = await request.json();
  if (!mentor_id) return NextResponse.json({ error: "mentor_id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("mentor_connections")
    .insert({ mentor_id, mentee_id: user.id, message: message?.trim() || null })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "すでにリクエスト済みです" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ connection: data }, { status: 201 });
}
