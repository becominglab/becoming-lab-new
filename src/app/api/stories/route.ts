import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/stories
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Map DB fields to frontend expected fields
  // DB has: body, title, chapter, entry_type, date
  // Frontend expects: content, chapter (non-empty)
  interface StoryRow {
    id: string;
    body?: string;
    content?: string;
    title?: string;
    chapter?: string;
    entry_type?: string;
    date?: string;
    [key: string]: unknown;
  }
  const stories = (data || []).map((s: StoryRow) => ({
    ...s,
    content: s.body || s.content || "",
    chapter: s.chapter || s.title || "無題の章",
  }));

  return NextResponse.json({ stories });
}

// POST /api/stories
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { content, chapter, entry_type, date } = body;

  if (!content?.trim() || !chapter?.trim()) {
    return NextResponse.json({ error: "content and chapter are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id: user.id,
      body: content.trim(),
      title: chapter.trim(),
      chapter: chapter.trim(),
      entry_type: entry_type || "everyday",
      date: date || new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // SNS: 公開プロフィールがあれば milestone ポストを自動作成 (ストーリー交換)
  try {
    const { data: publicProfile } = await supabase
      .from("public_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (publicProfile) {
      await supabase.from("posts").insert({
        user_id: user.id,
        post_type: "milestone",
        content: {
          title: chapter.trim(),
          excerpt: content.trim().slice(0, 80) + (content.trim().length > 80 ? "…" : ""),
        },
        source_id: data.id,
      });

      const { checkAndAwardBadges } = await import("@/lib/sns/badges");
      checkAndAwardBadges(supabase, user.id, ["story"]).catch(() => {});
    }
  } catch {
    // SNS統合エラーはストーリー保存に影響させない
  }

  return NextResponse.json({ story: data }, { status: 201 });
}

// DELETE /api/stories?id=xxx
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
