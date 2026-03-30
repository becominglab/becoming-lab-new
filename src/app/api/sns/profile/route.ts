import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/profile — 自分のプロフィール取得
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

// POST /api/sns/profile — プロフィール作成
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const { nickname, avatar_url, bio, challenge_tags, update_phase, seeking, is_public } = body;

  if (!nickname?.trim() || nickname.trim().length > 30) {
    return NextResponse.json({ error: "nickname は1〜30文字で入力してください" }, { status: 400 });
  }
  if (bio && bio.length > 100) {
    return NextResponse.json({ error: "bio は100文字以内で入力してください" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("public_profiles")
    .upsert(
      {
        user_id: user.id,
        nickname: nickname.trim(),
        avatar_url: avatar_url || null,
        bio: bio?.trim() || null,
        challenge_tags: challenge_tags || [],
        update_phase: update_phase || "exploring",
        seeking: seeking || null,
        is_public: is_public !== false,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data }, { status: 201 });
}

// PATCH /api/sns/profile — プロフィール更新
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const allowed = ["nickname", "avatar_url", "bio", "challenge_tags", "update_phase", "seeking", "is_public", "is_mentor"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if ("nickname" in updates) {
    const n = updates.nickname as string;
    if (!n?.trim() || n.trim().length > 30) {
      return NextResponse.json({ error: "nickname は1〜30文字で入力してください" }, { status: 400 });
    }
    updates.nickname = n.trim();
  }

  const { data, error } = await supabase
    .from("public_profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
