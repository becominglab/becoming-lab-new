import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory, customerProfile } = await request.json();

    if (!conversationHistory?.length) {
      return NextResponse.json({ error: "会話履歴が必要です" }, { status: 400 });
    }

    const systemPrompt = `あなたはLivingHouseの空間コンセプトデザイナーAIです。
顧客との会話ログと分析結果から、最適な空間提案コンセプトを生成してください。

## 会話ログ
${conversationHistory.map((h: { category: string; text: string }) => `[${h.category}] ${h.text}`).join("\n")}

## 顧客プロファイル
${JSON.stringify(customerProfile)}

## 出力形式 (JSON)
{
  "conceptName": "コンセプト名（日本語、8文字以内で印象的に）",
  "conceptSubtitle": "サブタイトル（英語、短めに）",
  "description": "コンセプト説明（2-3文、顧客の価値観に寄り添った言葉で）",
  "features": [
    { "title": "特徴名", "description": "具体的な空間提案" },
    { "title": "特徴名", "description": "具体的な空間提案" },
    { "title": "特徴名", "description": "具体的な空間提案" }
  ],
  "keywords": ["空間キーワード1", "空間キーワード2", "空間キーワード3"],
  "closingRate": 0-100,
  "priceRange": "想定価格帯",
  "talkingPoints": [
    "商談で使えるフレーズ1",
    "商談で使えるフレーズ2"
  ]
}`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "この顧客に最適な空間コンセプトを提案してください。" },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "提案を生成できませんでした" }, { status: 500 });
    }

    const proposal = JSON.parse(content);
    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Sales proposal error:", error);
    return NextResponse.json(
      { error: "提案生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
