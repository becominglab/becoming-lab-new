import { NextResponse } from "next/server";
import OpenAI from "openai";

// ── Static fallbacks (used when OpenAI is unavailable) ──
const FALLBACK_QUOTES = [
  "完璧を目指すより、まず終わらせろ。",
  "昨日の自分を超えることだけに集中する。",
  "小さな一歩が、やがて大きな旅になる。",
  "変化を恐れるな。変わらないことを恐れろ。",
  "今日やらなかったことは、明日もやらない。",
  "習慣は、第二の天性である。",
  "始めることが、すでに半分を終えたこと。",
  "自分を信じろ。他の誰もあなたにはなれない。",
  "失敗とは、やめた時にだけ起こるものだ。",
  "一日一日が、自分を編集するチャンス。",
  "走れない日は歩け。歩けない日は立て。",
  "迷ったときは、より勇気のいる方を選べ。",
  "過程を楽しめる者が、最も遠くへ行ける。",
  "考えすぎるな。動け。",
  "いまの自分は、過去の選択の結果だ。",
  "できない理由ではなく、できる方法を探せ。",
  "継続は力なり。しかし、正しい方向にのみ。",
  "自分のペースでいい。でも止まるな。",
  "限界は、自分が決めているだけだ。",
  "昨日植えた木が、明日の日陰を作る。",
  "準備ができてから始めるのでは遅い。",
  "人生に正解はない。あるのは選択だけだ。",
  "体を動かすと、心も動き出す。",
  "記録は嘘をつかない。",
  "静かに、しかし確実に、前へ。",
  "弱さを知ることが、強さの始まり。",
  "今日の汗は、明日の自信になる。",
  "言葉にすることで、意志は力を持つ。",
  "不安は、挑戦している証拠だ。",
  "更新を重ねることが、生きるということ。",
];

const FALLBACK_PROMPTS = [
  "今日、心に残ったことは？",
  "最近の自分に、一言かけるなら？",
  "いま、手放したいものは何？",
  "明日の自分に期待することは？",
  "最近、自分を褒められることは？",
  "今の自分に足りないものは何だと思う？",
  "1年後の自分は、今日の自分をどう見ている？",
  "最近、心が動いた瞬間はいつ？",
];

// ── In-memory cache (1 day) ──
let cache: {
  date: string;
  quote: string;
  prompt: string;
  source: "ai" | "fallback";
} | null = null;

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getFallback() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return {
    quote: FALLBACK_QUOTES[day % FALLBACK_QUOTES.length],
    prompt: FALLBACK_PROMPTS[day % FALLBACK_PROMPTS.length],
    source: "fallback" as const,
  };
}

async function generateFromAI(): Promise<{
  quote: string;
  prompt: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("No API key");

  const client = new OpenAI({ apiKey });

  const [quoteRes, promptRes] = await Promise.all([
    client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "あなたはbecoming labの格言生成AIです。becoming labは「人生は完成させるものではなく、更新し続けるもの」という思想を持つコミュニティです。静かで余白のある、しかし芯のある人生の言葉を1つだけ生成してください。20〜40文字。句読点以外の装飾は不要。",
        },
      ],
    }),
    client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "あなたはbecoming labの内省プロンプト生成AIです。自分の人生と向き合うための問いを1つだけ生成してください。深いが重すぎないこと。疑問文で終わること。20〜40文字。",
        },
      ],
    }),
  ]);

  const quote = quoteRes.choices[0]?.message?.content?.trim();
  const prompt = promptRes.choices[0]?.message?.content?.trim();

  if (!quote || !prompt) throw new Error("Empty AI response");

  return { quote, prompt };
}

export async function GET() {
  const today = getTodayStr();

  // Return cache if today's data exists
  if (cache && cache.date === today) {
    return NextResponse.json(cache);
  }

  // Try AI generation
  try {
    const ai = await generateFromAI();
    cache = {
      date: today,
      quote: ai.quote,
      prompt: ai.prompt,
      source: "ai",
    };
    return NextResponse.json(cache);
  } catch (e) {
    console.warn("[AI Daily] Falling back to static:", e);
    const fb = getFallback();
    cache = {
      date: today,
      ...fb,
    };
    return NextResponse.json(cache);
  }
}
