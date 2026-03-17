import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/challenges
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenges: data });
}

// POST /api/challenges
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { title, description, start_date, target_date, milestones } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("challenges")
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() ?? null,
      start_date: start_date || new Date().toISOString().split("T")[0],
      target_date: target_date ?? null,
      milestones: milestones || [],
      progress: 0,
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data }, { status: 201 });
}

// PATCH /api/challenges (update progress, milestones, status)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  // Only allow specific fields to be updated
  const allowed: Record<string, unknown> = {};
  if (updates.title !== undefined) allowed.title = updates.title;
  if (updates.description !== undefined) allowed.description = updates.description;
  if (updates.target_date !== undefined) allowed.target_date = updates.target_date;
  if (updates.progress !== undefined) allowed.progress = Math.min(100, Math.max(0, updates.progress));
  if (updates.status !== undefined) allowed.status = updates.status;
  if (updates.milestones !== undefined) allowed.milestones = updates.milestones;

  const { data, error } = await supabase
    .from("challenges")
    .update(allowed)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data });
}

// DELETE /api/challenges?id=xxx
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("challenges")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
