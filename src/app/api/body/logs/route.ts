import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/body/logs?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=30
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "30");

  let query = supabase
    .from("body_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data });
}

// POST /api/body/logs — upsert daily log + update streak
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { date, meal_score, workout_score, mood } = body;

  const logDate = date || new Date().toISOString().split("T")[0];

  // Validate scores
  for (const [key, val] of Object.entries({ meal_score, workout_score, mood })) {
    if (typeof val !== "number" || val < 1 || val > 3) {
      return NextResponse.json({ error: `${key} must be 1, 2, or 3` }, { status: 400 });
    }
  }

  // Upsert the daily log
  const { data: log, error: logError } = await supabase
    .from("body_logs")
    .upsert(
      {
        user_id: user.id,
        date: logDate,
        meal_score,
        workout_score,
        mood,
      },
      { onConflict: "user_id,date" }
    )
    .select()
    .single();

  if (logError) return NextResponse.json({ error: logError.message }, { status: 500 });

  // Update streak
  const streak = await updateStreak(supabase, user.id, logDate);

  // SNS: 公開プロフィールがあれば auto_log ポストを自動作成
  try {
    const { data: publicProfile } = await supabase
      .from("public_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_public", true)
      .maybeSingle();

    if (publicProfile) {
      await supabase.from("posts").upsert(
        {
          user_id: user.id,
          post_type: "auto_log",
          content: {
            date: logDate,
            meal_score,
            workout_score,
            mood,
            streak: streak?.current_streak || 0,
          },
          source_id: log.id,
        },
        { onConflict: "user_id,source_id", ignoreDuplicates: true }
      );

      // マイルストーン自動投稿 (7, 30, 100日)
      const milestones = [7, 30, 100];
      const currentStreak = streak?.current_streak || 0;
      if (milestones.includes(currentStreak)) {
        await supabase.from("posts").insert({
          user_id: user.id,
          post_type: "milestone",
          content: {
            type: "streak",
            label: `${currentStreak}日連続記録達成！`,
            value: currentStreak,
          },
        });
      }

      // バッジチェック
      const { checkAndAwardBadges } = await import("@/lib/sns/badges");
      checkAndAwardBadges(supabase, user.id, ["streak", "body"]).catch(() => {});
    }
  } catch {
    // SNS統合エラーはログ記録の成功に影響させない
  }

  return NextResponse.json({ log, streak }, { status: 201 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateStreak(supabase: any, userId: string, logDate: string) {
  // Get current streak row
  const { data: existing } = await supabase
    .from("body_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  let currentStreak = 1;
  let maxStreak = 1;

  if (existing && existing.last_log_date) {
    const lastDate = new Date(existing.last_log_date + "T00:00:00");
    const newDate = new Date(logDate + "T00:00:00");
    const diffDays = Math.round((newDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day re-log — no change
      return existing;
    } else if (diffDays === 1) {
      // Consecutive day
      currentStreak = existing.current_streak + 1;
    } else {
      // Gap — reset
      currentStreak = 1;
    }
    maxStreak = Math.max(existing.max_streak, currentStreak);
  }

  const { data: streak, error } = await supabase
    .from("body_streaks")
    .upsert(
      {
        user_id: userId,
        current_streak: currentStreak,
        max_streak: maxStreak,
        last_log_date: logDate,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) console.error("[body/streaks] update error:", error);
  return streak;
}
