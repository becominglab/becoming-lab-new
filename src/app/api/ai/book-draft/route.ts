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

  // Fetch all stories
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  // Map DB fields: body → content, title/chapter → chapter
  interface StoryRow {
    id: string;
    date: string;
    chapter?: string;
    title?: string;
    content?: string;
    body?: string;
    entry_type: string;
    [key: string]: unknown;
  }
  const stories: { id: string; date: string; chapter: string; content: string; entry_type: string }[] =
    (data || []).map((s: StoryRow) => ({
      id: s.id,
      date: s.date,
      chapter: s.chapter || s.title || "無題の章",
      content: s.body || s.content || "",
      entry_type: s.entry_type,
    }));

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
        .map((e) => `  [${e.date}] (${e.entry_type}) ${e.content}`)
        .join("\n");
      return `第${idx + 1}章「${ch}」\n${entriesText}`;
    })
    .join("\n\n");

  // Try AI generation
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
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

      if (draft) {
        return NextResponse.json({
          draft,
          chapterCount: chapterOrder.length,
          pageCount: stories.length,
          source: "ai",
        });
      }
    } catch (e) {
      console.warn("[AI Book Draft] AI failed, using fallback:", e);
    }
  }

  // Fallback: Generate a simple draft from the story entries
  const fallbackDraft = generateFallbackDraft(chapters, chapterOrder);

  return NextResponse.json({
    draft: fallbackDraft,
    chapterCount: chapterOrder.length,
    pageCount: stories.length,
    source: "fallback",
  });
}

function generateFallbackDraft(
  chapters: Record<
    string,
    { date: string; content: string; entry_type: string }[]
  >,
  chapterOrder: string[]
): string {
  const lines: string[] = [];

  lines.push("# プロローグ");
  lines.push("");
  lines.push(
    "この物語は、まだ書かれている途中だ。完成を急ぐ必要はない。一日一日が、この本の新しいページになる。"
  );
  lines.push("");

  chapterOrder.forEach((ch, idx) => {
    const entries = chapters[ch];
    lines.push(`# 第${idx + 1}章　${ch}`);
    lines.push("");

    entries.forEach((e) => {
      const typeLabel =
        e.entry_type === "milestone"
          ? "節目"
          : e.entry_type === "turning_point"
            ? "転機"
            : e.entry_type === "insight"
              ? "気づき"
              : "";
      const prefix = typeLabel ? `【${typeLabel}】` : "";
      lines.push(`${prefix}${e.content}`);
      lines.push("");
    });
  });

  lines.push("# エピローグ");
  lines.push("");
  lines.push(
    "この本には、まだ書かれていないページがある。それでいい。物語は続いている。"
  );

  return lines.join("\n");
}
