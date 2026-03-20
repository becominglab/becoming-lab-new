import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const { text, conversationHistory, customerProfile } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "テキストが必要です" }, { status: 400 });
    }

    const systemPrompt = `あなたはLivingHouseの接客支援AIです。空間時間デザイナーが入力した顧客の発言を分析してください。

## 分析タスク
1. **意図分類**: 発言を以下のカテゴリに分類
   - situation (状況): 現在の住まいや生活状況
   - behavior (行動): 日常の行動パターンや習慣
   - emotion (感情): 感じていること、不満、喜び
   - value (価値観): 大切にしていること、理想
   - future (未来): 将来のビジョン、夢

2. **キーワード抽出**: 空間提案に関連する重要キーワードを3-5個

3. **顧客タイプ判定** (0-100のスコア):
   - functional: 機能重視型（収納、動線、効率）
   - sensory: 感性重視型（雰囲気、素材、色）
   - experiential: 体験重視型（暮らし方、ストーリー、思い出）

4. **次の質問提案**: 会話を深掘りする質問を2つ提案。各質問に理由も付ける。

5. **インサイト**: この発言から読み取れる潜在ニーズを1文で。

${customerProfile ? `\n## 現在の顧客プロファイル\n${JSON.stringify(customerProfile)}` : ""}
${conversationHistory?.length ? `\n## 会話履歴\n${conversationHistory.map((h: { category: string; text: string }) => `[${h.category}] ${h.text}`).join("\n")}` : ""}

## 出力形式 (JSON)
{
  "category": "situation|behavior|emotion|value|future",
  "keywords": ["キーワード1", "キーワード2", ...],
  "customerType": {
    "functional": 0-100,
    "sensory": 0-100,
    "experiential": 0-100
  },
  "suggestions": [
    { "question": "質問文", "reason": "理由" },
    { "question": "質問文", "reason": "理由" }
  ],
  "insight": "インサイト文",
  "depthScore": 0-100
}

depthScoreは会話の深掘り度合い。状況→行動→感情→価値観→未来と進むほど高い。`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "分析結果を取得できませんでした" }, { status: 500 });
    }

    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Sales analyze error:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
