import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/recommendations — おすすめユーザー（タグ一致 + 未フォロー）
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // 自分のタグを取得
  const { data: myProfile } = await supabase
    .from("public_profiles")
    .select("challenge_tags")
    .eq("user_id", user.id)
    .maybeSingle();

  const myTags: string[] = myProfile?.challenge_tags || [];

  // 既にフォロー済みのユーザーIDを取得
  const { data: following } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);
  const followingIds = (following || []).map((f: { following_id: string }) => f.following_id);
  const excludeIds = [user.id, ...followingIds];

  // タグが一致するユーザーを取得（最大10人）
  let query = supabase
    .from("public_profiles")
    .select("user_id, nickname, avatar_url, bio, challenge_tags, update_phase")
    .eq("is_public", true)
    .not("user_id", "in", `(${excludeIds.join(",")})`)
    .limit(10);

  // タグフィルター（myTagsがある場合）
  if (myTags.length > 0) {
    query = query.overlaps("challenge_tags", myTags);
  }

  const { data: recommended, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // タグ一致数でソート
  const sorted = (recommended || []).sort((a: any, b: any) => {
    const aMatch = (a.challenge_tags || []).filter((t: string) => myTags.includes(t)).length;
    const bMatch = (b.challenge_tags || []).filter((t: string) => myTags.includes(t)).length;
    return bMatch - aMatch;
  });

  return NextResponse.json({ users: sorted.slice(0, 6) });
}
