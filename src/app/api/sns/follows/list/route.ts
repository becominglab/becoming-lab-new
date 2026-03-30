import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/follows/list?type=followers|following&user_id=xxx
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") as "followers" | "following";
  const userId = request.nextUrl.searchParams.get("user_id") || user.id;

  if (!["followers", "following"].includes(type)) {
    return NextResponse.json({ error: "type must be followers or following" }, { status: 400 });
  }

  let users: { user_id: string; nickname: string; avatar_url: string | null; bio: string | null; challenge_tags: string[] }[] = [];

  if (type === "followers") {
    // このユーザーをフォローしている人
    const { data, error } = await supabase
      .from("follows")
      .select("follower_id, public_profiles!follows_follower_id_fkey(user_id, nickname, avatar_url, bio, challenge_tags)")
      .eq("following_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users = (data || []).map((d: any) => d.public_profiles).filter(Boolean);
  } else {
    // このユーザーがフォローしている人
    const { data, error } = await supabase
      .from("follows")
      .select("following_id, public_profiles!follows_following_id_fkey(user_id, nickname, avatar_url, bio, challenge_tags)")
      .eq("follower_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users = (data || []).map((d: any) => d.public_profiles).filter(Boolean);
  }

  // 自分がフォローしているかどうかを付与
  const { data: myFollowing } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);

  const followingSet = new Set((myFollowing || []).map((f: { following_id: string }) => f.following_id));

  const enriched = users.map((u) => ({
    ...u,
    is_following: followingSet.has(u.user_id),
  }));

  return NextResponse.json({ users: enriched });
}
