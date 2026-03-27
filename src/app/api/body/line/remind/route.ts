import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Cron endpoint: send LINE reminders to users who haven't logged today
// Call this via Vercel Cron or external scheduler (e.g., every day at 20:00 JST)

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(url, key);
}

async function pushMessage(lineUserId: string, text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return;
  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [{ type: "text", text }],
    }),
  });
}

const REMIND_MESSAGES = [
  "🌱 今日の10秒ログ、まだですよ！\nhttps://diet.becominglab.life/log",
  "📝 今日もサクッと記録しませんか？\nhttps://diet.becominglab.life/log",
  "💪 あと10秒で今日の記録が完了します\nhttps://diet.becominglab.life/log",
  "🔥 ストリーク途切れちゃうかも？今日の記録をつけよう\nhttps://diet.becominglab.life/log",
  "🌿 小さな記録が、大きな変化になる\nhttps://diet.becominglab.life/log",
];

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const today = new Date().toISOString().split("T")[0];

  // Get users who want LINE reminders
  const { data: profiles, error: profileError } = await supabase
    .from("body_profiles")
    .select("user_id, line_user_id")
    .eq("line_remind", true)
    .not("line_user_id", "is", null);

  if (profileError || !profiles?.length) {
    return NextResponse.json({ sent: 0, reason: profileError?.message || "no users" });
  }

  // Check which users already logged today
  const userIds = profiles.map((p) => p.user_id);
  const { data: todayLogs } = await supabase
    .from("body_logs")
    .select("user_id")
    .eq("date", today)
    .in("user_id", userIds);

  const loggedUserIds = new Set((todayLogs || []).map((l) => l.user_id));

  // Send reminders to users who haven't logged
  const toRemind = profiles.filter((p) => !loggedUserIds.has(p.user_id));
  let sent = 0;

  for (const profile of toRemind) {
    const messageIndex = Math.floor(Math.random() * REMIND_MESSAGES.length);
    try {
      await pushMessage(profile.line_user_id, REMIND_MESSAGES[messageIndex]);
      sent++;
    } catch (e) {
      console.error(`[line/remind] Failed to send to ${profile.user_id}:`, e);
    }
  }

  return NextResponse.json({ sent, total: toRemind.length });
}
