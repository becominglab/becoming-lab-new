"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, UserPlus, Loader2, Bell, GraduationCap } from "lucide-react";

interface Notification {
  id: string;
  type: "reaction" | "comment" | "follow" | "mentor_request" | "mentor_accepted";
  is_read: boolean;
  created_at: string;
  post_id?: string;
  body?: string;
  actor_id?: string;
  public_profiles?: {
    nickname: string;
    avatar_url: string | null;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "reaction":
      return <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center"><Heart size={12} className="text-red-500 fill-red-500" /></div>;
    case "comment":
      return <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><MessageSquare size={12} className="text-teal-600" /></div>;
    case "mentor_request":
    case "mentor_accepted":
      return <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center"><GraduationCap size={12} className="text-amber-600" /></div>;
    case "follow":
    default:
      return <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"><UserPlus size={12} className="text-blue-500" /></div>;
  }
}

function notifText(n: Notification): { main: string; sub?: string } {
  const name = n.public_profiles?.nickname || "誰か";
  switch (n.type) {
    case "reaction":
      return {
        main: `${name}さんがあなたの投稿にリアクションしました`,
        sub: n.body ? `「${n.body}」` : undefined,
      };
    case "comment":
      return {
        main: `${name}さんがコメントしました`,
        sub: n.body ? `「${n.body}」` : undefined,
      };
    case "follow":
      return { main: `${name}さんがフォローしました` };
    case "mentor_request":
      return { main: `${name}さんからメンター申請が届きました` };
    case "mentor_accepted":
      return { main: `${name}さんがメンター申請を承認しました` };
    default:
      return { main: "新しい通知があります" };
  }
}

function notifHref(n: Notification): string {
  // 投稿関連の通知は投稿詳細ページへ
  if (n.post_id && (n.type === "reaction" || n.type === "comment")) {
    return `/sns/posts/${n.post_id}`;
  }
  // フォロー / メンター関連はプロフィールへ
  if (n.actor_id) {
    return `/sns/profile/${n.actor_id}`;
  }
  return "/sns";
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [handledRequests, setHandledRequests] = useState<Set<string>>(new Set());

  const handleMentorResponse = async (notif: Notification, status: "accepted" | "declined") => {
    if (!notif.actor_id) return;
    setActionLoading(notif.id);
    try {
      // Find the mentor connection via API
      const res = await fetch("/api/sns/mentors?tab=requests");
      const data = await res.json();
      const connection = (data.requests || []).find(
        (r: any) => r.mentor_id === notif.actor_id || r.mentee_id === notif.actor_id
      );
      if (connection) {
        await fetch(`/api/sns/mentors/${connection.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        setHandledRequests((prev) => new Set([...prev, notif.id]));
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetch("/api/sns/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    // 全既読にする
    fetch("/api/sns/notifications", { method: "PATCH" });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-300" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 space-y-2">
        <Bell size={32} className="text-stone-200 mx-auto" />
        <p className="text-stone-400 text-sm">まだ通知はありません</p>
        <p className="text-stone-300 text-xs">仲間と交流するとここに通知が届きます</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100">
      {notifications.map((n) => {
        const { main, sub } = notifText(n);
        const isMentorRequest = n.type === "mentor_request";
        const inner = (
          <>
            {/* アクターアバター */}
            <div className="relative shrink-0">
              {n.public_profiles?.avatar_url ? (
                <Image
                  src={n.public_profiles.avatar_url}
                  alt={n.public_profiles.nickname}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                  {n.public_profiles?.nickname?.[0] || "?"}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1">
                <NotifIcon type={n.type} />
              </div>
            </div>

            {/* テキスト */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${!n.is_read ? "font-medium text-stone-800" : "text-stone-600"}`}>
                {main}
              </p>
              {sub && (
                <p className="text-xs text-stone-400 mt-0.5 truncate">{sub}</p>
              )}
              <p className="text-xs text-stone-400 mt-0.5">{timeAgo(n.created_at)}</p>
              {isMentorRequest && !handledRequests.has(n.id) && (
                <div className="flex gap-2 mt-2" onClick={(e) => e.preventDefault()}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMentorResponse(n, "accepted"); }}
                    disabled={actionLoading === n.id}
                    className="flex-1 py-1 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === n.id ? "..." : "承認する"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMentorResponse(n, "declined"); }}
                    disabled={actionLoading === n.id}
                    className="flex-1 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-200 disabled:opacity-50 transition-colors"
                  >
                    断る
                  </button>
                </div>
              )}
              {isMentorRequest && handledRequests.has(n.id) && (
                <p className="text-xs text-teal-600 mt-1 font-medium">✓ 対応済み</p>
              )}
            </div>

            {/* 未読インジケーター */}
            {!n.is_read && (
              <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-2" />
            )}
          </>
        );

        if (isMentorRequest) {
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors ${
                !n.is_read ? "bg-teal-50/60" : ""
              }`}
            >
              {inner}
            </div>
          );
        }

        return (
          <Link
            key={n.id}
            href={notifHref(n)}
            className={`flex items-start gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors ${
              !n.is_read ? "bg-teal-50/60" : ""
            }`}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
