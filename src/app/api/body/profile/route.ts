import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/body/profile
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("body_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

// POST /api/body/profile
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { why_text, goal_text, line_code, line_remind } = body;

  // Build upsert payload
  const payload: Record<string, unknown> = {
    user_id: user.id,
    why_text: why_text ?? null,
    goal_text: goal_text ?? null,
  };

  // Handle LINE linking via code (last 8 chars of LINE user ID)
  if (line_code && typeof line_code === "string" && line_code.length === 8) {
    // Look up full LINE user ID by code suffix
    // The LINE webhook sends the full user ID; the user enters the last 8 chars
    const { data: existingProfiles } = await supabase
      .from("body_profiles")
      .select("line_user_id")
      .like("line_user_id", `%${line_code}`);

    if (existingProfiles && existingProfiles.length > 0) {
      // Transfer LINE user ID to this user's profile
      const lineUserId = existingProfiles[0].line_user_id;
      // Clear from old profile if it was on a different user
      await supabase
        .from("body_profiles")
        .update({ line_user_id: null, line_remind: false })
        .eq("line_user_id", lineUserId)
        .neq("user_id", user.id);
      payload.line_user_id = lineUserId;
      payload.line_remind = true;
    } else {
      // Direct match: code might be the full LINE user ID suffix
      // Store it directly — webhook will have stored the full ID
      // For now, we'll store the code as a pending link
    }
  }

  // Handle LINE remind toggle
  if (typeof line_remind === "boolean") {
    payload.line_remind = line_remind;
  }

  const { data, error } = await supabase
    .from("body_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data }, { status: 201 });
}
