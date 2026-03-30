import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/challenge-board?tag=xxx&phase=xxx
// 公開プロフィールを持つユーザーのアクティブなチャレンジ一覧
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const tag = request.nextUrl.searchParams.get("tag") || "";
  const phase = request.nextUrl.searchParams.get("phase") || "";

  // 公開プロフィールを持つユーザーIDを取得
  let profileQuery = supabase
    .from("public_profiles")
    .select("user_id, nickname, avatar_url, update_phase, challenge_tags")
    .eq("is_public", true);

  if (phase) profileQuery = profileQuery.eq("update_phase", phase);
  if (tag) profileQuery = profileQuery.contains("challenge_tags", [tag]);

  const { data: profiles } = await profileQuery.limit(100);
  if (!profiles?.length) return NextResponse.json({ challenges: [] });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicUserIds = profiles.map((p: any) => p.user_id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileMap = new Map(profiles.map((p: any) => [p.user_id, p]));

  // アクティブなチャレンジを取得
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("id, user_id, title, description, start_date, target_date, status, created_at")
    .in("user_id", publicUserIds)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // フォロー状態を取得
  const { data: myFollows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const followingIds = new Set((myFollows || []).map((f: any) => f.following_id));

  // チャレンジにプロフィール情報を付与
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = (challenges || []).map((c: any) => ({
    ...c,
    profile: profileMap.get(c.user_id) || null,
    is_following: followingIds.has(c.user_id),
    is_own: c.user_id === user.id,
  }));

  return NextResponse.json({ challenges: enriched });
}
