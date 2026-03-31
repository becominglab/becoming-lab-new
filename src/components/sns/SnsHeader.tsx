"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { PenLine } from "lucide-react";

export default function SnsHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // ヘッダーを表示するページ
  const showHeader = pathname === "/sns" || pathname.startsWith("/sns/search");

  if (!showHeader) return null;

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-100 lg:hidden">
      <div className="flex items-center justify-between px-4 h-12">
        <Link href="/sns" className="text-base font-bold text-stone-900 tracking-tight">
          becoming
        </Link>
        <button
          onClick={() => router.push("/sns?compose=1")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-full text-xs font-medium hover:bg-teal-700 transition-colors"
        >
          <PenLine size={12} />
          今日の更新
        </button>
      </div>
    </div>
  );
}
