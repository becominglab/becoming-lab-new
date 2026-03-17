import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reflections?limit=20
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reflections: data });
}

// POST /api/reflections
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { content, mood, prompt, date } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reflections")
    .insert({
      user_id: user.id,
      content: content.trim(),
      mood: mood || "thoughtful",
      prompt: prompt ?? null,
      date: date || new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reflection: data }, { status: 201 });
}

// DELETE /api/reflections?id=xxx
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("reflections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
