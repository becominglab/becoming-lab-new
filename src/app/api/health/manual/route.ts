import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 手動体組成データの作成・削除
 * POST /api/health/manual - 新規作成（バックデート対応）
 * DELETE /api/health/manual?id=xxx - 削除（手動エントリのみ）
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
  const {
    measured_at,
    weight_kg,
    body_fat_pct,
    muscle_mass_kg,
    muscle_score,
    visceral_fat_level,
    basal_metabolic_rate,
    body_age,
    bone_mass_kg,
    bmi,
    notes,
  } = body;

  if (!measured_at) {
    return NextResponse.json(
      { error: "measured_at は必須です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("health_measurements")
    .insert({
      user_id: user.id,
      measured_at,
      weight_kg: weight_kg ?? null,
      body_fat_pct: body_fat_pct ?? null,
      muscle_mass_kg: muscle_mass_kg ?? null,
      muscle_score: muscle_score ?? null,
      visceral_fat_level: visceral_fat_level ?? null,
      basal_metabolic_rate: basal_metabolic_rate ?? null,
      body_age: body_age ?? null,
      bone_mass_kg: bone_mass_kg ?? null,
      bmi: bmi ?? null,
      notes: notes ?? null,
      source: "manual",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ measurement: data }, { status: 201 });
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

  const { error } = await supabase
    .from("health_measurements")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("source", "manual");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
