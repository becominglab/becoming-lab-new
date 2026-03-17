import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const fallbacks = [
      "新しい地平",
      "転機の予感",
      "静かな始まり",
      "問い直す季節",
      "覚悟の時",
      "変化の兆し",
      "自分への帰還",
    ];
    const title = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return NextResponse.json({ title }, { status: 200 });
  }

  try {
    const body = await request.json();
    const { recentContent, existingChapters } = body;

    const existingInfo =
      existingChapters && existingChapters.length > 0
        ? `既存の章: ${existingChapters.join("、")}`
        : "まだ章はありません。これが最初の章です。";

    const contentHint = recentContent
      ? `最近書いた内容のヒント: 「${recentContent.slice(0, 200)}」`
      : "";

    const client = new OpenAI({ apiKey });

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 60,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `あなたはbecoming labのチャプタータイトル生成AIです。
becoming labは「人生は完成させるものではなく、更新し続けるもの」という思想を持つコミュニティです。

ユーザーの人生の新しい章のタイトルを1つだけ提案してください。

ルール:
- 5〜15文字の短いタイトル
- 詩的で、しかし具体的な予感を含むこと
- 句読点や括弧は不要
- タイトルのみを返すこと（説明不要）
- 例: 「転機の予感」「覚悟の時」「静かな始まり」「新しい地平」「問い直す季節」`,
        },
        {
          role: "user",
          content: `${existingInfo}\n${contentHint}\n\n新しい章のタイトルを1つ提案してください。`,
        },
      ],
    });

    const title = res.choices[0]?.message?.content
      ?.trim()
      .replace(/[「」『』""]/g, "");

    return NextResponse.json({ title: title || "新しい章" });
  } catch (e) {
    console.warn("[AI Chapter Title] Error:", e);
    // Fallback titles
    const fallbacks = [
      "新しい地平",
      "転機の予感",
      "静かな始まり",
      "問い直す季節",
      "覚悟の時",
      "変化の兆し",
      "自分への帰還",
    ];
    const title = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return NextResponse.json({ title });
  }
}
