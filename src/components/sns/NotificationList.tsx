"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, UserPlus, Loader2, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "reaction" | "comment" | "follow" | "mentor_request" | "mentor_accepted";
  is_read: boolean;
  created_at: string;
  post_id?: string;
  body?: string;
  public_profiles?: {
    nickname: string;
    avatar_url: string | null;
    user_id?: string;
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
      return <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center"><Heart size={14} className="text-red-500 fill-red-500" /></div>;
    case "comment":
      return <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center"><MessageSquare size={14} className="text-teal-600" /></div>;
    case "follow":
    case "mentor_request":
    case "mentor_accepted":
      return <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center"><UserPlus size={14} className="text-blue-500" /></div>;
    default:
      return <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center"><Bell size={14} className="text-stone-400" /></div>;
  }
}

function notifText(n: Notification): string {
  const name = n.public_profiles?.nickname || "誰か";
  switch (n.type) {
    case "reaction": return `${name}さんがリアクション${n.body ? `（${n.body}）` : ""}しました`;
    case "comment": return `${name}さんがコメントしました`;
    case "follow": return `${name}さんがフォローしました`;
    case "mentor_request": return `${name}さんからメンター申請が届きました`;
    case "mentor_accepted": return `${name}さんがメンター申請を承認しました`;
    default: return "新しい通知があります";
  }
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
        const linkHref = n.post_id ? `/sns` : (n.public_profiles ? `/sns/profile/${(n as any).actor_id}` : "/sns");
        return (
          <Link
            key={n.id}
            href={linkHref}
            className={`flex items-start gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors ${
              !n.is_read ? "bg-teal-50/60" : ""
            }`}
          >
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
                {notifText(n)}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{timeAgo(n.created_at)}</p>
            </div>

            {/* 未読インジケーター */}
            {!n.is_read && (
              <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-2" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
