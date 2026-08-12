"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";

interface Props {
  currentUserId?: string;
}

function IconFeed({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <rect x="3" y="4" width="18" height="3" rx="1.5" fill="currentColor" />
          <rect x="3" y="10.5" width="18" height="3" rx="1.5" fill="currentColor" />
          <rect x="3" y="17" width="12" height="3" rx="1.5" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="3" y="10.5" width="18" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="3" y="17" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

function IconSearch({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
      />
      <line
        x1="15.5"
        y1="15.5"
        x2="20.5"
        y2="20.5"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBell({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <path d="M12 3C8.5 3 6 5.5 6 9v4l-2 2v1h16v-1l-2-2V9c0-3.5-2.5-6-6-6z" fill="currentColor" />
          <path d="M10 18c0 1.1.9 2 2 2s2-.9 2-2h-4z" fill="currentColor" />
        </>
      ) : (
        <>
          <path d="M12 3C8.5 3 6 5.5 6 9v4l-2 2v1h16v-1l-2-2V9c0-3.5-2.5-6-6-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 18c0 1.1.9 2 2 2s2-.9 2-2h-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

function IconProfile({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" fillOpacity="0.8" />
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/sns", label: "フィード", Icon: IconFeed, showBadge: false },
  { href: "/sns/search", label: "さがす", Icon: IconSearch, showBadge: false },
  { href: "/sns/notifications", label: "通知", Icon: IconBell, showBadge: true },
  { href: "/sns/profile", label: "プロフィール", Icon: IconProfile, showBadge: false },
];

export default function SnsNav({ currentUserId }: Props) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    // 初回の未読カウント取得
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/sns/notifications?unread_only=true");
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data.unread_count || 0);
      } catch {
        // silently fail
      }
    };
    fetchUnread();

    // ストリーク取得
    const fetchStreak = async () => {
      try {
        const checkinRes = await fetch("/api/sns/checkin");
        if (!checkinRes.ok) return;
        const checkinData = await checkinRes.json();
        setStreak(checkinData.streak || 0);
      } catch {
        // silently fail
      }
    };
    fetchStreak();

    // Supabase Realtime で通知をリアルタイム受信
    if (!currentUserId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          setUnreadCount((prev) => prev + 1);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newNotif = (payload as any).new || {};
          const { type, body } = newNotif;
          let message: string;
          if (body) {
            message = body;
          } else if (type === "comment") {
            message = "💬 新しいコメントが届きました！";
          } else if (type === "reaction") {
            message = "👍 あなたの投稿に応援が届きました！";
          } else if (type === "follow") {
            message = "🎉 新しいフォロワーが増えました！";
          } else {
            message = "🔔 新しい通知があります";
          }
          showToast(message, "success");
        }
      )
      .subscribe();

    // フォールバック: 60秒ポーリング（Realtime 補完）
    const interval = setInterval(fetchUnread, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [currentUserId]);

  // ブラウザタブタイトルに未読カウントを反映
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Becoming SNS`;
    } else {
      document.title = "Becoming SNS — 更新をつなぐ";
    }
  }, [unreadCount]);

  // 通知ページに来たら既読にする
  useEffect(() => {
    if (pathname === "/sns/notifications" && unreadCount > 0) {
      fetch("/api/sns/notifications", { method: "PATCH" }).then(() => {
        setUnreadCount(0);
      });
    }
  }, [pathname, unreadCount]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto max-w-md flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ href, label, Icon, showBadge }) => {
          const active =
            pathname === href || (href !== "/sns" && pathname.startsWith(href));
          const badgeCount = showBadge ? unreadCount : 0;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                active ? "text-teal-600" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {active && (
                <span className="absolute top-0 inset-x-0 flex justify-center">
                  <span className="w-5 h-0.5 bg-teal-500 rounded-full" />
                </span>
              )}
              <div className="relative">
                <Icon active={active} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 animate-pulse">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
                {label === "プロフィール" && streak >= 3 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    🔥{streak}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-wide ${active ? "font-medium" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
