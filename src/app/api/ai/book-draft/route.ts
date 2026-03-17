import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "not_authenticated" },
      { status: 401 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured" },
      { status: 500 }
    );
  }

  // Fetch all stories
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const stories: { id: string; date: string; chapter: string; content: string; entry_type: string }[] = data || [];

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (stories.length === 0) {
    return NextResponse.json(
      { error: "no_stories", message: "物語がまだありません。" },
      { status: 400 }
    );
  }

  // Group by chapter
  const chapters: Record<
    string,
    { date: string; content: string; entry_type: string }[]
  > = {};
  const chapterOrder: string[] = [];

  stories.forEach((s) => {
    if (!chapters[s.chapter]) {
      chapters[s.chapter] = [];
      chapterOrder.push(s.chapter);
    }
    chapters[s.chapter].push({
      date: s.date,
      content: s.content,
      entry_type: s.entry_type,
    });
  });

  // Build story summary for AI
  const storySummary = chapterOrder
    .map((ch, idx) => {
      const entries = chapters[ch];
      const entriesText = entries
        .map(
          (e) =>
            `  [${e.date}] (${e.entry_type}) ${e.content}`
        )
        .join("\n");
      return `第${idx + 1}章「${ch}」\n${entriesText}`;
    })
    .join("\n\n");

  try {
    const client = new OpenAI({ apiKey });

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `あなたはbecoming labの「人生の本」編集AIです。
becoming labは「人生は完成させるものではなく、更新し続けるもの」という思想を持つコミュニティです。

ユーザーが日々書いてきたストーリーエントリーから、一冊の本の「下書き」を生成してください。

ルール:
- 各章ごとに、そこに含まれるエントリーを一つの物語として紡ぎ直す
- 一人称（「私は」）で書く
- 文学的だが読みやすい文体
- 各章は100〜300文字程度
- 章タイトルはユーザーが付けたものをそのまま使う
- 本全体の冒頭に「プロローグ」（50〜100文字）を付ける
- 本全体の最後に「エピローグ」（50〜100文字）を付ける。ただし「まだ途中の物語」であることを示す
- 過度にドラマチックにしないこと。静かで品のある文体
- マークダウン形式で出力（# で章タイトル）`,
        },
        {
          role: "user",
          content: `以下のストーリーエントリーから、私の人生の本の下書きを生成してください。\n\n${storySummary}`,
        },
      ],
    });

    const draft = res.choices[0]?.message?.content?.trim();

    if (!draft) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      draft,
      chapterCount: chapterOrder.length,
      pageCount: stories.length,
    });
  } catch (e) {
    console.warn("[AI Book Draft] Error:", e);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
