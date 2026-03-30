import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/badges?user_id=xxx — バッジ一覧取得
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const targetUserId = request.nextUrl.searchParams.get("user_id") || user.id;

  // 全バッジ定義
  const { data: allBadges } = await supabase
    .from("badges")
    .select("*")
    .order("sort_order");

  // ユーザーの獲得バッジ
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", targetUserId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const earnedMap = new Map<string, any>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (userBadges || []).map((ub: any) => [ub.badge_id, ub])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badges = (allBadges || []).map((badge: any) => {
    const earned = earnedMap.get(badge.id);
    return {
      ...badge,
      earned: !!earned,
      earned_at: earned?.earned_at ?? null,
      is_pinned: earned?.is_pinned ?? false,
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinned = badges.filter((b: any) => b.is_pinned);

  return NextResponse.json({ badges, pinned });
}

// PATCH /api/sns/badges — バッジピン留め/解除
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { badge_id, is_pinned } = await request.json();
  if (!badge_id) return NextResponse.json({ error: "badge_id is required" }, { status: 400 });

  // ピン留めする場合、既に3つピン留め済みかチェック
  if (is_pinned) {
    const { count } = await supabase
      .from("user_badges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_pinned", true);

    if ((count || 0) >= 3) {
      return NextResponse.json({ error: "ピン留めは最大3つまでです" }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("user_badges")
    .update({ is_pinned: !!is_pinned })
    .eq("user_id", user.id)
    .eq("badge_id", badge_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user_badge: data });
}
