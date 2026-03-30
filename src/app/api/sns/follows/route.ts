import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndAwardBadges } from "@/lib/sns/badges";

// GET /api/sns/follows?type=following|followers
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") || "following";

  if (type === "followers") {
    const { data, error } = await supabase
      .from("follows")
      .select("follower_id, created_at, public_profiles!follows_follower_id_fkey(nickname, avatar_url, bio, challenge_tags, update_phase)")
      .eq("following_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data });
  }

  // type === "following"
  const { data, error } = await supabase
    .from("follows")
    .select("following_id, created_at, public_profiles!follows_following_id_fkey(nickname, avatar_url, bio, challenge_tags, update_phase)")
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

// POST /api/sns/follows — フォローする
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { following_id } = await request.json();
  if (!following_id) return NextResponse.json({ error: "following_id is required" }, { status: 400 });
  if (following_id === user.id) return NextResponse.json({ error: "自分自身はフォローできません" }, { status: 400 });

  const { data, error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, following_id })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "既にフォロー済みです" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // バッジチェック（非同期、レスポンスをブロックしない）
  checkAndAwardBadges(supabase, user.id, ["social"]).catch(() => {});

  return NextResponse.json({ follow: data }, { status: 201 });
}

// DELETE /api/sns/follows?following_id=xxx — フォロー解除
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const followingId = request.nextUrl.searchParams.get("following_id");
  if (!followingId) return NextResponse.json({ error: "following_id is required" }, { status: 400 });

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
