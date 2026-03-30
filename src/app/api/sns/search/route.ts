import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/search?q=xxx&tags=tag1,tag2&phase=exploring
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q") || "";
  const tags = request.nextUrl.searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const phase = request.nextUrl.searchParams.get("phase") || "";

  let query = supabase
    .from("public_profiles")
    .select("*")
    .eq("is_public", true)
    .neq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  // テキスト検索 (nickname or bio)
  if (q.trim()) {
    query = query.or(`nickname.ilike.%${q}%,bio.ilike.%${q}%`);
  }

  // タグフィルター
  if (tags.length > 0) {
    query = query.overlaps("challenge_tags", tags);
  }

  // フェーズフィルター
  if (phase) {
    query = query.eq("update_phase", phase);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // フォロー状態を付与
  const { data: myFollows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const followingIds = new Set((myFollows || []).map((f: any) => f.following_id));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profiles = (data || []).map((p: any) => ({
    ...p,
    is_following: followingIds.has(p.user_id),
  }));

  return NextResponse.json({ profiles });
}
