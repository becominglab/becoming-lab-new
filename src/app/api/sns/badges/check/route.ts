import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndAwardBadges } from "@/lib/sns/badges";

// POST /api/sns/badges/check — バッジ判定実行
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const categories = body.categories as string[] | undefined;

  const newlyEarned = await checkAndAwardBadges(supabase, user.id, categories);

  return NextResponse.json({ newly_earned: newlyEarned });
}
