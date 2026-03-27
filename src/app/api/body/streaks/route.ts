import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/body/streaks
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("body_streaks")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    streak: data || { current_streak: 0, max_streak: 0, last_log_date: null },
  });
}
