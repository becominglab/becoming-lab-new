import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/onboarding — オンボーディング完了状態
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: profile } = await supabase
    .from("public_profiles")
    .select("onboarding_completed, nickname, avatar_url, bio, challenge_tags, is_public")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return NextResponse.json({ completed: true }); // プロフィール未作成なら別ページ担当

  // 各ステップの達成状況
  const hasProfile = !!(profile.nickname);
  const hasAvatar = !!(profile.avatar_url);
  const hasBio = !!(profile.bio);
  const hasTags = (profile.challenge_tags || []).length > 0;

  // フォロー数チェック
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", user.id);

  // 投稿数チェック
  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // チェックイン数
  const { count: checkinCount } = await supabase
    .from("daily_checkins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const steps = [
    { key: "profile", label: "プロフィールを設定", done: hasProfile && (hasAvatar || hasBio || hasTags), href: "/sns/profile" },
    { key: "post", label: "最初の投稿をする", done: (postCount || 0) > 0, href: "/sns" },
    { key: "follow", label: "誰かをフォローする", done: (followingCount || 0) > 0, href: "/sns/search" },
    { key: "checkin", label: "3日連続チェックイン", done: (checkinCount || 0) >= 3, href: "/sns" },
  ];

  const allDone = steps.every((s) => s.done);

  return NextResponse.json({ steps, all_done: allDone, onboarding_completed: profile.onboarding_completed });
}

// POST /api/sns/onboarding/complete — 完了フラグを立てる
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  await supabase
    .from("public_profiles")
    .update({ onboarding_completed: true })
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
