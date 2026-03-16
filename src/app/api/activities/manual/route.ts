import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 手動アクティビティの作成・削除
 * POST /api/activities/manual - 新規作成（バックデート対応）
 * DELETE /api/activities/manual?id=xxx - 削除（手動エントリのみ）
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { date, activity_type, name, distance_km, duration_minutes, heart_rate_avg, elevation_m, notes } = body;

  if (!date || !activity_type) {
    return NextResponse.json(
      { error: "date と activity_type は必須です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: user.id,
      date,
      activity_type,
      name: name || `${activity_type} - ${date}`,
      distance_km: distance_km ?? null,
      duration_minutes: duration_minutes ?? null,
      heart_rate_avg: heart_rate_avg ?? null,
      elevation_m: elevation_m ?? null,
      notes: notes ?? null,
      source: "manual",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activity: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id は必須です" }, { status: 400 });
  }

  // 手動エントリのみ削除可能
  const { error } = await supabase
    .from("activity_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("source", "manual");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
