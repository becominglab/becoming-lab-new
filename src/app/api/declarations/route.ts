import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/declarations
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("declarations")
    .select("*")
    .eq("user_id", user.id)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ declarations: data });
}

// POST /api/declarations
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { content } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("declarations")
    .insert({
      user_id: user.id,
      content: content.trim(),
      pinned: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // SNS: 公開プロフィールがあれば declaration ポストを自動作成
  try {
    const { data: publicProfile } = await supabase
      .from("public_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_public", true)
      .maybeSingle();

    if (publicProfile) {
      await supabase.from("posts").insert({
        user_id: user.id,
        post_type: "declaration",
        content: { content: content.trim() },
        source_id: data.id,
      });

      const { checkAndAwardBadges } = await import("@/lib/sns/badges");
      checkAndAwardBadges(supabase, user.id, ["challenge"]).catch(() => {});
    }
  } catch {
    // SNS統合エラーは宣言の保存に影響させない
  }

  return NextResponse.json({ declaration: data }, { status: 201 });
}

// PATCH /api/declarations (pin/unpin)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { id, pinned } = body;

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  // If pinning, unpin all others first
  if (pinned) {
    await supabase
      .from("declarations")
      .update({ pinned: false })
      .eq("user_id", user.id)
      .eq("pinned", true);
  }

  const { data, error } = await supabase
    .from("declarations")
    .update({ pinned: !!pinned })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ declaration: data });
}

// DELETE /api/declarations?id=xxx
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("declarations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
