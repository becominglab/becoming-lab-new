import { SupabaseClient } from "@supabase/supabase-js";

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  condition_type: string;
  condition_value: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EarnedBadge = any;

/**
 * バッジ条件を確認し、未獲得バッジを自動付与する
 * @returns 新たに獲得したバッジの配列
 */
export async function checkAndAwardBadges(
  supabase: SupabaseClient,
  userId: string,
  categories?: string[]
): Promise<Badge[]> {
  // バッジ定義を取得
  let badgeQuery = supabase.from("badges").select("*").order("sort_order");
  if (categories?.length) {
    badgeQuery = badgeQuery.in("category", categories);
  }
  const { data: allBadges } = await badgeQuery;
  if (!allBadges?.length) return [];

  // 既に獲得済みのバッジを取得
  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const earnedIds = new Set((earnedBadges || []).map((b: EarnedBadge) => b.badge_id));

  // 未獲得バッジのみチェック対象
  const unchecked = allBadges.filter((b: any) => !earnedIds.has(b.id));
  if (!unchecked.length) return [];

  // 必要な条件タイプを集約
  const neededTypes = new Set(unchecked.map((b: any) => b.condition_type));
  const counts: Record<string, number> = {};

  // 条件タイプごとにカウントを取得
  const countQueries: PromiseLike<void>[] = [];

  if (neededTypes.has("body_streak")) {
    countQueries.push(
      supabase
        .from("body_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle()
        .then(({ data }) => {
          counts["body_streak"] = data?.current_streak || 0;
        })
    );
  }

  if (neededTypes.has("body_log_count")) {
    countQueries.push(
      supabase
        .from("body_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => {
          counts["body_log_count"] = count || 0;
        })
    );
  }

  if (neededTypes.has("declaration_count")) {
    countQueries.push(
      supabase
        .from("declarations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => {
          counts["declaration_count"] = count || 0;
        })
    );
  }

  if (neededTypes.has("challenge_count")) {
    countQueries.push(
      supabase
        .from("challenges")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => {
          counts["challenge_count"] = count || 0;
        })
    );
  }

  if (neededTypes.has("challenge_complete")) {
    countQueries.push(
      supabase
        .from("challenges")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed")
        .then(({ count }) => {
          counts["challenge_complete"] = count || 0;
        })
    );
  }

  if (neededTypes.has("story_count")) {
    countQueries.push(
      supabase
        .from("stories")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => {
          counts["story_count"] = count || 0;
        })
    );
  }

  if (neededTypes.has("follow_count")) {
    countQueries.push(
      supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", userId)
        .then(({ count }) => {
          counts["follow_count"] = count || 0;
        })
    );
  }

  if (neededTypes.has("reaction_given_count")) {
    countQueries.push(
      supabase
        .from("reactions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => {
          counts["reaction_given_count"] = count || 0;
        })
    );
  }

  if (neededTypes.has("post_count")) {
    countQueries.push(
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(({ count }) => {
          counts["post_count"] = count || 0;
        })
    );
  }

  // comeback: ストリークが途切れた後に復帰したかを検出
  // 直近90日のチェックインを確認し、3日以上のギャップ後に復帰していればカウント=1
  if (neededTypes.has("comeback")) {
    countQueries.push(
      supabase
        .from("daily_checkins")
        .select("checkin_date")
        .eq("user_id", userId)
        .order("checkin_date", { ascending: false })
        .limit(90)
        .then(({ data }) => {
          const dates = (data || []).map((d: { checkin_date: string }) => d.checkin_date).sort();
          let hasComeback = 0;
          for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const gap = Math.round((curr.getTime() - prev.getTime()) / 86400000);
            // ギャップが3日以上あって、その前に少なくとも1回のチェックインがあれば復帰
            if (gap >= 3 && i >= 3) {
              hasComeback = 1;
              break;
            }
          }
          counts["comeback"] = hasComeback;
        })
    );
  }

  await Promise.all(countQueries);

  // 条件を満たすバッジを判定
  const newlyEarned: Badge[] = [];

  for (const badge of unchecked) {
    const currentValue = counts[badge.condition_type] ?? 0;
    if (currentValue >= badge.condition_value) {
      newlyEarned.push(badge);
    }
  }

  // 新規獲得バッジを一括挿入
  if (newlyEarned.length > 0) {
    await supabase.from("user_badges").insert(
      newlyEarned.map((b) => ({
        user_id: userId,
        badge_id: b.id,
      }))
    );
  }

  return newlyEarned;
}
