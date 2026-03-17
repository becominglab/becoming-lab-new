import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  // Fetch this week's data in parallel
  const [activitiesRes, reflectionsRes, challengesRes] = await Promise.all([
    supabase
      .from("activity_logs")
      .select("activity_type, distance_km, duration_minutes, date")
      .eq("user_id", user.id)
      .gte("date", weekAgo)
      .lte("date", today),
    supabase
      .from("reflections")
      .select("content, mood, date")
      .eq("user_id", user.id)
      .gte("date", weekAgo)
      .lte("date", today),
    supabase
      .from("challenges")
      .select("title, progress, status")
      .eq("user_id", user.id)
      .eq("status", "active"),
  ]);

  const activities = activitiesRes.data || [];
  const reflections = reflectionsRes.data || [];
  const challenges = challengesRes.data || [];

  // Build summary stats
  const totalActivities = activities.length;
  const totalDistance = activities.reduce((s: number, a: Record<string, unknown>) => s + (Number(a.distance_km) || 0), 0);
  const totalDuration = activities.reduce((s: number, a: Record<string, unknown>) => s + (Number(a.duration_minutes) || 0), 0);
  const reflectionCount = reflections.length;
  const moodSummary = reflections.reduce((acc: Record<string, number>, r: Record<string, unknown>) => {
    const mood = String(r.mood);
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Try AI generation
  const apiKey = process.env.OPENAI_API_KEY;
  let aiSummary: string | null = null;

  if (apiKey && (totalActivities > 0 || reflectionCount > 0)) {
    try {
      const client = new OpenAI({ apiKey });
      const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "あなたはbecoming labのパーソナルコーチです。ユーザーの1週間のデータを元に、温かく、しかし的確なフィードバックを200文字以内で書いてください。becoming labの思想「人生は完成させるものではなく更新し続けるもの」を背景に。",
          },
          {
            role: "user",
            content: `今週のデータ:
- アクティビティ: ${totalActivities}回、${totalDistance.toFixed(1)}km、${totalDuration}分
- 内省記録: ${reflectionCount}回
- 気分の傾向: ${JSON.stringify(moodSummary)}
- 挑戦中: ${challenges.map((c: Record<string, unknown>) => `${c.title}(${c.progress}%)`).join(", ") || "なし"}`,
          },
        ],
      });
      aiSummary = res.choices[0]?.message?.content?.trim() || null;
    } catch {
      // AI unavailable, proceed without
    }
  }

  return NextResponse.json({
    period: { from: weekAgo, to: today },
    stats: {
      activities: totalActivities,
      distance_km: Math.round(totalDistance * 10) / 10,
      duration_minutes: totalDuration,
      reflections: reflectionCount,
      mood_summary: moodSummary,
      active_challenges: challenges.length,
    },
    challenges: challenges.map((c: Record<string, unknown>) => ({ title: c.title, progress: c.progress })),
    ai_summary: aiSummary,
  });
}
