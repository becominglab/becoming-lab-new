import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/weekly-summary — 過去7日間のサマリー
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 並列取得
  const [postsResult, reactionsResult, checkinResult] = await Promise.all([
    // 自分の投稿数
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo),

    // 自分の投稿に付いたリアクション数
    supabase
      .from("reactions")
      .select("id", { count: "exact", head: true })
      .in(
        "post_id",
        (await supabase
          .from("posts")
          .select("id")
          .eq("user_id", user.id)
          .gte("created_at", sevenDaysAgo)
        ).data?.map((p: { id: string }) => p.id) || []
      ),

    // チェックインストリーク
    supabase
      .from("daily_checkins")
      .select("checked_at")
      .eq("user_id", user.id)
      .order("checked_at", { ascending: false })
      .limit(30),
  ]);

  // ストリーク計算
  let streak = 0;
  const checkins = checkinResult.data || [];
  if (checkins.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentDate = new Date(today);

    for (const checkin of checkins) {
      const checkinDate = new Date(checkin.checked_at);
      checkinDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((currentDate.getTime() - checkinDate.getTime()) / 86400000);
      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = checkinDate;
      } else {
        break;
      }
    }
  }

  return NextResponse.json({
    post_count: postsResult.count || 0,
    reaction_count: reactionsResult.count || 0,
    streak,
  });
}
