import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/calendar?user_id=xxx&year=2026
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const targetUserId = request.nextUrl.searchParams.get("user_id") || user.id;
  const year = parseInt(request.nextUrl.searchParams.get("year") || new Date().getFullYear().toString());

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  // 各テーブルから日付データを並行取得
  const [bodyLogs, reflections, stories, posts] = await Promise.all([
    supabase
      .from("body_logs")
      .select("date")
      .eq("user_id", targetUserId)
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("reflections")
      .select("date")
      .eq("user_id", targetUserId)
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("stories")
      .select("date")
      .eq("user_id", targetUserId)
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("posts")
      .select("created_at")
      .eq("user_id", targetUserId)
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`),
  ]);

  // 日ごとのアクティビティマップを構築
  const days: Record<string, { body_log: boolean; reflection: boolean; story: boolean; post: boolean; count: number }> = {};

  const markDay = (date: string, type: "body_log" | "reflection" | "story" | "post") => {
    if (!days[date]) {
      days[date] = { body_log: false, reflection: false, story: false, post: false, count: 0 };
    }
    if (!days[date][type]) {
      days[date][type] = true;
      days[date].count++;
    }
  };

  for (const log of bodyLogs.data || []) markDay(log.date, "body_log");
  for (const ref of reflections.data || []) markDay(ref.date, "reflection");
  for (const story of stories.data || []) markDay(story.date, "story");
  for (const post of posts.data || []) {
    const date = post.created_at.split("T")[0];
    markDay(date, "post");
  }

  return NextResponse.json({ days, year });
}
