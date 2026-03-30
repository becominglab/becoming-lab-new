import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** 日付の連続日数を計算 */
function calcStreak(dates: string[], today: string): number {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date(today);
  // 今日チェックイン済みなら今日から、まだなら昨日から数える
  if (!set.has(today)) d.setDate(d.getDate() - 1);
  while (set.has(toDateString(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// GET /api/sns/checkin — 今日の状態 + ストリーク
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const today = toDateString(new Date());

  const { data: checkins } = await supabase
    .from("daily_checkins")
    .select("checkin_date")
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(365);

  const dates = (checkins || []).map((c: { checkin_date: string }) => c.checkin_date);
  const todayChecked = dates.includes(today);
  const streak = calcStreak(dates, today);

  return NextResponse.json({
    today_checked: todayChecked,
    streak,
    total: dates.length,
  });
}

// POST /api/sns/checkin — 今日チェックイン
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const today = toDateString(new Date());

  // upsert（重複は無視）
  const { error } = await supabase
    .from("daily_checkins")
    .upsert({ user_id: user.id, checkin_date: today }, { onConflict: "user_id,checkin_date" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 更新後のストリークを返す
  const { data: checkins } = await supabase
    .from("daily_checkins")
    .select("checkin_date")
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(365);

  const dates = (checkins || []).map((c: { checkin_date: string }) => c.checkin_date);
  const streak = calcStreak(dates, today);

  return NextResponse.json({ streak, total: dates.length });
}
