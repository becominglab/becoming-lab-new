import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// LINE Messaging API webhook handler
// Handles: follow (friend add), unfollow, message events

function verifySignature(body: string, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) return false;
  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(url, key);
}

async function replyMessage(replyToken: string, text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return;
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  // Verify signature in production
  if (process.env.LINE_CHANNEL_SECRET && !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const data = JSON.parse(body);
  const events = data.events || [];

  for (const event of events) {
    const lineUserId = event.source?.userId;
    if (!lineUserId) continue;

    if (event.type === "follow") {
      // New friend added — send welcome and linking instructions
      await replyMessage(
        event.replyToken,
        "🌱 Becoming Body リマインダーBot です！\n\n" +
          "毎日のリマインドを受け取るには、アプリの「Why」ページで LINE連携 をオンにしてください。\n\n" +
          `あなたの連携コード: ${lineUserId.slice(-8)}\n\n` +
          "このコードをアプリに入力すると連携が完了します。"
      );
    } else if (event.type === "unfollow") {
      // Unlinked — clear line_user_id
      const supabase = getServiceClient();
      await supabase
        .from("body_profiles")
        .update({ line_user_id: null, line_remind: false })
        .eq("line_user_id", lineUserId);
    } else if (event.type === "message" && event.message?.type === "text") {
      const text = event.message.text.trim();

      if (text === "記録" || text === "ログ") {
        await replyMessage(
          event.replyToken,
          "📝 今日の記録はこちらから:\nhttps://diet.becominglab.life/log"
        );
      } else {
        await replyMessage(
          event.replyToken,
          "「記録」と送ると記録ページのリンクをお送りします 🌱"
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
