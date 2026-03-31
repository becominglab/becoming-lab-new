import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/trending-tags — 過去7日間のトレンドタグ
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: posts } = await supabase
    .from("posts")
    .select("tags")
    .gte("created_at", sevenDaysAgo)
    .not("tags", "is", null);

  // タグカウント集計
  const tagCounts: Record<string, number> = {};
  for (const post of posts || []) {
    for (const tag of (post.tags || [])) {
      if (tag && tag.trim()) {
        tagCounts[tag.trim()] = (tagCounts[tag.trim()] || 0) + 1;
      }
    }
  }

  // 上位8件を返す
  const sorted = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  return NextResponse.json({ tags: sorted });
}
