import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// GET /api/sns/weekly-letter
// Cron endpoint: send LINE weekly digest to users with public profiles + LINE linked
// Call via Vercel Cron or external scheduler (every Sunday 08:00 JST)

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(url, key);
}

async function pushLine(lineUserId: string, messages: object[]) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return;
  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to: lineUserId, messages }),
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();

  // 公開プロフィールを持ち、LINE連携済みのユーザーを取得
  const { data: profiles } = await supabase
    .from("public_profiles")
    .select("user_id, nickname")
    .eq("is_public", true);

  if (!profiles?.length) return NextResponse.json({ sent: 0 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userIds = profiles.map((p: any) => p.user_id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileMap = new Map(profiles.map((p: any) => [p.user_id, p.nickname]));

  // LINE user_id を持つユーザーを取得 (body_profiles に line_user_id あり)
  const { data: bodyProfiles } = await supabase
    .from("body_profiles")
    .select("user_id, line_user_id")
    .in("user_id", userIds)
    .not("line_user_id", "is", null);

  if (!bodyProfiles?.length) return NextResponse.json({ sent: 0 });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let sentCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const bp of bodyProfiles as any[]) {
    try {
      // フォロー中ユーザーのアクティビティを集計
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", bp.user_id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const followingIds = (follows || []).map((f: any) => f.following_id);
      if (!followingIds.length) continue;

      // 直近7日間の投稿数を集計
      const { data: recentPosts } = await supabase
        .from("posts")
        .select("user_id, post_type, created_at")
        .in("user_id", followingIds)
        .gte("created_at", weekAgo)
        .order("created_at", { ascending: false });

      if (!recentPosts?.length) continue;

      // ユーザー別投稿数
      const activityMap: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const p of recentPosts as any[]) {
        activityMap[p.user_id] = (activityMap[p.user_id] || 0) + 1;
      }

      // 上位3ユーザーをピックアップ
      const topUsers = Object.entries(activityMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const myNickname = profileMap.get(bp.user_id) || "あなた";

      // LINE フレックスメッセージ (テキスト形式)
      const topLines = topUsers
        .map(([uid, count]) => {
          const name = profileMap.get(uid) || "仲間";
          return `• ${name} — ${count}件の更新`;
        })
        .join("\n");

      const text = [
        `📬 ${myNickname}さんの週刊レター`,
        "",
        `今週、フォロー中の仲間が更新していました：`,
        topLines,
        "",
        `合計 ${recentPosts.length} 件の更新`,
        `👉 https://becominglab.life/sns`,
      ].join("\n");

      await pushLine(bp.line_user_id, [{ type: "text", text }]);
      sentCount++;
    } catch {
      // 個別送信失敗は継続
    }
  }

  return NextResponse.json({ sent: sentCount });
}
