"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PenLine, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function SnsHeader() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  // ヘッダーを表示するページ
  const showHeader = pathname === "/sns" || pathname.startsWith("/sns/search");

  useEffect(() => {
    if (!showHeader) return;
    fetch("/api/sns/notifications?unread_only=true")
      .then((r) => r.json())
      .then((d) => setUnread(d.unread_count || 0))
      .catch(() => {});
  }, [showHeader]);

  if (!showHeader) return null;

  // FABのボトムシートを開くカスタムイベントを発火
  const handleCompose = () => {
    window.dispatchEvent(new CustomEvent("sns:open-compose"));
  };

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-200 lg:hidden">
      <div className="flex items-center justify-between px-4 h-12">
        <Link href="/sns" className="text-base font-bold text-stone-900 tracking-tight">
          becoming
        </Link>
        <div className="flex items-center gap-2">
          {/* 通知ベル */}
          <Link
            href="/sns/notifications"
            className="relative w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-700 transition-colors"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          {/* 投稿ボタン（FABのイベントをトリガー） */}
          <button
            onClick={handleCompose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-full text-xs font-medium hover:bg-teal-700 transition-colors active:scale-95"
          >
            <PenLine size={12} />
            今日の更新
          </button>
        </div>
      </div>
    </div>
  );
}
