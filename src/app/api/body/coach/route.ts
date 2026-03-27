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

interface LogRow {
  date: string;
  meal_score: number;
  workout_score: number;
  mood: number;
}

function analyzeTrends(logs: LogRow[]): string {
  if (logs.length === 0) return "";

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const lines: string[] = [];

  // Meal trend
  const mealAvg = logs.reduce((s, l) => s + l.meal_score, 0) / logs.length;
  const workoutAvg = logs.reduce((s, l) => s + l.workout_score, 0) / logs.length;
  const moodAvg = logs.reduce((s, l) => s + l.mood, 0) / logs.length;

  // Identify best/worst areas
  const areas = [
    { name: "食事", avg: mealAvg, latest: latest.meal_score },
    { name: "運動", avg: workoutAvg, latest: latest.workout_score },
    { name: "気分", avg: moodAvg, latest: latest.mood },
  ];
  const best = areas.reduce((a, b) => (a.avg > b.avg ? a : b));
  const weakest = areas.reduce((a, b) => (a.avg < b.avg ? a : b));

  lines.push(`・得意エリア: ${best.name}（平均${best.avg.toFixed(1)}）`);
  lines.push(`・改善余地: ${weakest.name}（平均${weakest.avg.toFixed(1)}）`);

  // Trend direction (compare first half vs second half)
  if (sorted.length >= 4) {
    const half = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, half);
    const secondHalf = sorted.slice(half);
    const firstAvg = firstHalf.reduce((s, l) => s + l.meal_score + l.workout_score + l.mood, 0) / (firstHalf.length * 3);
    const secondAvg = secondHalf.reduce((s, l) => s + l.meal_score + l.workout_score + l.mood, 0) / (secondHalf.length * 3);

    if (secondAvg > firstAvg + 0.2) {
      lines.push("・トレンド: 上昇傾向 📈");
    } else if (secondAvg < firstAvg - 0.2) {
      lines.push("・トレンド: 少し下降気味 — でも戻すチャンスは今日");
    } else {
      lines.push("・トレンド: 安定して継続中");
    }
  }

  // Consecutive patterns
  const lowMoodDays = sorted.filter((l) => l.mood === 1).length;
  if (lowMoodDays >= 3) {
    lines.push(`・気分が低い日が${lowMoodDays}日 — 無理せず、自分を労わって`);
  }

  const perfectDays = sorted.filter((l) => l.meal_score >= 2 && l.workout_score >= 2 && l.mood >= 2).length;
  if (perfectDays > 0) {
    lines.push(`・スコア2以上の日: ${perfectDays}/${sorted.length}日`);
  }

  return lines.join("\n");
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
  const [profileRes, logsRes, streakRes] = await Promise.all([
    supabase.from("body_profiles").select("why_text, goal_text").eq("user_id", user.id).maybeSingle(),
    supabase.from("body_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(7),
    supabase.from("body_streaks").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const profile = profileRes.data;
  const recentLogs: LogRow[] = logsRes.data || [];
  const streakData = streakRes.data;

  // Try AI generation
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("No API key");

    const client = new OpenAI({ apiKey });

    // Build rich context
    let context = "ユーザーの状況:\n";
    if (profile?.why_text) context += `・変わりたい理由: ${profile.why_text}\n`;
    if (profile?.goal_text) context += `・なりたい自分: ${profile.goal_text}\n`;

    if (streakData) {
      context += `・現在のストリーク: ${streakData.current_streak}日連続\n`;
      context += `・最高ストリーク: ${streakData.max_streak}日\n`;
    }

    if (recentLogs.length > 0) {
      context += `・直近${recentLogs.length}日の記録あり\n`;
      context += analyzeTrends(recentLogs) + "\n";

      // Yesterday's specific log for immediate feedback
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const yesterdayLog = recentLogs.find((l) => l.date === yesterdayStr);
      if (yesterdayLog) {
        const mealLabels = ["", "崩れた", "普通", "良い"];
        const workoutLabels = ["", "何もしてない", "軽く動いた", "しっかりやった"];
        context += `・昨日: 食事=${mealLabels[yesterdayLog.meal_score]}, 運動=${workoutLabels[yesterdayLog.workout_score]}, 気分=${yesterdayLog.mood === 3 ? "良い" : yesterdayLog.mood === 2 ? "普通" : "低い"}\n`;
      }
    } else {
      context += "・まだ記録がありません（初日 or 復帰）\n";
    }

    // Check if today is already logged
    const todayLog = recentLogs.find((l) => l.date === today);
    if (todayLog) {
      context += "・今日は既に記録済み\n";
    } else {
      context += "・今日はまだ未記録\n";
    }

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: `あなたはBecoming BodyのAIコーチです。Becoming Bodyは「痩せる」ではなく「更新される自分を積み上げる」アプリです。

以下のルールで、今日のメッセージを生成してください:
- 30〜80文字
- 温かく、でも芯がある
- 頑張らせるのではなく、自然に続けたくなる言葉
- ユーザーのデータに基づく具体的なコメントを含む（例: 「運動を3日連続でやってますね」「食事の調子が上がってきてる」）
- ただし数字の羅列にならず、感情に寄り添う
- 装飾不要、句読点のみ
- 一言目で具体的な事実、二言目で応援や気づきを入れる`,
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
