import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/circles — サークル一覧 (自分参加中 + おすすめ)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const tab = request.nextUrl.searchParams.get("tab") || "joined"; // joined | discover

  if (tab === "joined") {
    // 自分が参加しているサークル
    const { data, error } = await supabase
      .from("circle_members")
      .select("role, joined_at, circles(id, name, theme_tag, description, max_members, created_by)")
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // メンバー数を付与
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circleIds = (data || []).map((d: any) => (d.circles as any)?.id).filter(Boolean);
    const memberCounts: Record<string, number> = {};

    if (circleIds.length > 0) {
      const { data: counts } = await supabase
        .from("circle_members")
        .select("circle_id")
        .in("circle_id", circleIds);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const c of (counts || []) as any[]) {
        memberCounts[c.circle_id] = (memberCounts[c.circle_id] || 0) + 1;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circles = (data || []).map((d: any) => ({
      ...(d.circles as object),
      member_count: memberCounts[(d.circles as any)?.id] || 0,
      my_role: d.role,
      joined_at: d.joined_at,
    }));

    return NextResponse.json({ circles });
  }

  // discover: 公開サークル（未参加）
  const { data: myMemberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myCircleIds = (myMemberships || []).map((m: any) => m.circle_id);

  let query = supabase
    .from("circles")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(30);

  if (myCircleIds.length > 0) {
    query = query.not("id", "in", `(${myCircleIds.join(",")})`);
  }

  const { data: circles, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // メンバー数付与
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ids = (circles || []).map((c: any) => c.id);
  const memberCounts: Record<string, number> = {};

  if (ids.length > 0) {
    const { data: counts } = await supabase
      .from("circle_members")
      .select("circle_id")
      .in("circle_id", ids);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const c of (counts || []) as any[]) {
      memberCounts[c.circle_id] = (memberCounts[c.circle_id] || 0) + 1;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = (circles || []).map((c: any) => ({
    ...c,
    member_count: memberCounts[c.id] || 0,
    is_full: (memberCounts[c.id] || 0) >= c.max_members,
  }));

  return NextResponse.json({ circles: enriched });
}

// POST /api/sns/circles — サークル作成
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { name, theme_tag, description, max_members } = await request.json();

  if (!name?.trim() || !theme_tag?.trim()) {
    return NextResponse.json({ error: "name と theme_tag は必須です" }, { status: 400 });
  }
  if (name.length > 40) {
    return NextResponse.json({ error: "サークル名は40文字以内にしてください" }, { status: 400 });
  }

  const { data: circle, error } = await supabase
    .from("circles")
    .insert({
      name: name.trim(),
      theme_tag: theme_tag.trim(),
      description: description?.trim() || null,
      max_members: Math.min(Math.max(parseInt(max_members) || 6, 2), 10),
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 作成者をオーナーとして参加
  await supabase.from("circle_members").insert({
    circle_id: circle.id,
    user_id: user.id,
    role: "owner",
  });

  return NextResponse.json({ circle }, { status: 201 });
}
