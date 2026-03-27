import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

// ── Static fallbacks ──
const FALLBACK_MESSAGES = [
  "昨日より1歩進んでます。それだけで十分。",
  "今日は\"選ぶだけ\"でいい日です。",
  "完璧じゃなくていい。記録するだけで勝ち。",
  "体は正直です。小さな積み重ねを覚えてる。",
  "今日も自分との約束を守りにきた。それが全て。",
  "食事を意識した時点で、もう変わり始めてる。",
  "サボった日も含めて、あなたの物語です。",
  "3日続いたら、それはもう習慣の種。",
  "数字じゃなく、行動した自分を見てください。",
  "昨日の自分と比べるだけでいい。",
  "動いた日は、心も軽くなる。",
  "記録は嘘をつかない。だから信じていい。",
  "崩れてもいい。戻ってきたことが強さ。",
  "今日の1タップが、未来の自分への投資。",
  "「続けてる自分」を、もっと褒めていい。",
  "焦らなくていい。方向が合ってれば着く。",
  "体を動かすと、心も動き出す。",
  "自分を裏切らない。それが一番の筋トレ。",
  "今日も更新できる。それだけで素晴らしい。",
  "小さな勝ちを積め。気づいたら大きく変わってる。",
];

// ── Per-user daily cache ──
const cache = new Map<string, { date: string; message: string; source: "ai" | "fallback" }>();

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getFallbackMessage(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return FALLBACK_MESSAGES[day % FALLBACK_MESSAGES.length];
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const today = getTodayStr();
  const cacheKey = `${user.id}_${today}`;

  // Return cache if exists
  const cached = cache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // Fetch user context for personalization
  const [profileRes, logsRes] = await Promise.all([
    supabase.from("body_profiles").select("why_text, goal_text").eq("user_id", user.id).maybeSingle(),
    supabase.from("body_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(7),
  ]);

  const profile = profileRes.data;
  const recentLogs = logsRes.data || [];

  // Try AI generation
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("No API key");

    const client = new OpenAI({ apiKey });

    // Build context
    let context = "ユーザーの状況:\n";
    if (profile?.why_text) context += `・変わりたい理由: ${profile.why_text}\n`;
    if (profile?.goal_text) context += `・なりたい自分: ${profile.goal_text}\n`;
    if (recentLogs.length > 0) {
      const streak = recentLogs.length;
      const avgMeal = recentLogs.reduce((s: number, l: { meal_score: number }) => s + l.meal_score, 0) / streak;
      const avgWorkout = recentLogs.reduce((s: number, l: { workout_score: number }) => s + l.workout_score, 0) / streak;
      context += `・直近${streak}日の記録あり（食事平均: ${avgMeal.toFixed(1)}, 運動平均: ${avgWorkout.toFixed(1)}）\n`;
    } else {
      context += "・まだ記録がありません（初日 or 復帰）\n";
    }

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: `あなたはBecoming BodyのAIコーチです。Becoming Bodyは「痩せる」ではなく「更新される自分を積み上げる」アプリです。

以下のルールで、今日の一言メッセージを1つだけ生成してください:
- 20〜60文字
- 温かく、でも芯がある
- 頑張らせるのではなく、自然に続けたくなる言葉
- ユーザーの状況に寄り添う
- 装飾不要、句読点のみ`,
        },
        {
          role: "user",
          content: context,
        },
      ],
    });

    const message = res.choices[0]?.message?.content?.trim();
    if (!message) throw new Error("Empty AI response");

    const result = { date: today, message, source: "ai" as const };
    cache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (e) {
    console.warn("[body/coach] Falling back to static:", e);
    const result = { date: today, message: getFallbackMessage(), source: "fallback" as const };
    cache.set(cacheKey, result);
    return NextResponse.json(result);
  }
}
