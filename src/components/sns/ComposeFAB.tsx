"use client";

import { useState, useEffect, useCallback } from "react";
import { PenLine, X } from "lucide-react";
import PostComposer from "./PostComposer";

/**
 * Floating Action Button — 全SNSページに表示するコンポーズボタン。
 * クリックするとボトムシートが開き、PostComposer が展開状態で表示される。
 * /sns フィードページ以外からの投稿後も sns:post-created イベントで
 * FeedTimeline に通知される。
 */
export default function ComposeFAB() {
  const [open, setOpen] = useState(false);

  // FABを開く際にボディスクロールをロック
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 投稿完了後にシートを閉じる
  const handlePosted = useCallback(() => {
    setOpen(false);
  }, []);

  // Esc キーで閉じる
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // SnsHeader の「今日の更新」ボタンからもシートを開けるようにする
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("sns:open-compose", handler);
    return () => window.removeEventListener("sns:open-compose", handler);
  }, []);

  return (
    <>
      {/* FAB ボタン — SnsNav (z-50, h-16) の上に配置 */}
      <button
        onClick={() => setOpen(true)}
        aria-label="今日の更新を記録する"
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 flex items-center justify-center hover:bg-teal-700 active:scale-95 transition-all"
      >
        <PenLine size={22} strokeWidth={2} />
      </button>

      {/* ボトムシートオーバーレイ */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* 背景バックドロップ */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* シート本体 */}
          <div className="relative bg-stone-50 rounded-t-2xl shadow-2xl max-h-[85dvh] flex flex-col animate-slide-up">
            {/* ドラッグハンドル */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-stone-300 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="w-10" /> {/* spacer */}
              <h2 className="text-sm font-semibold text-stone-700">きょうの記録</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="閉じる"
              >
                <X size={16} />
              </button>
            </div>

            {/* コンテンツ（スクロール可能） */}
            <div className="overflow-y-auto px-4 pb-8 flex-1">
              <PostComposer
                defaultExpanded
                onPosted={handlePosted}
                collapsedPlaceholder="今日の更新を記録する..."
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
