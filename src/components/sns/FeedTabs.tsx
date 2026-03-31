"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FeedTimeline from "./FeedTimeline";
import DiscoverFeed from "./DiscoverFeed";
import ChallengeBoardView from "./ChallengeBoardView";
import { Compass, Users, Target } from "lucide-react";

export default function FeedTabs({ currentUserId }: { currentUserId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as "feed" | "discover" | "board") || "feed";
  const initialTag = searchParams.get("tag") || undefined;

  const [tab, setTab] = useState<"feed" | "discover" | "board">(initialTab);

  useEffect(() => {
    const t = searchParams.get("tab") as "feed" | "discover" | "board";
    if (t && t !== tab) setTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) < 50 || dy > 60) return; // minimum swipe distance, not vertical

    const tabs: ("feed" | "discover" | "board")[] = ["feed", "discover", "board"];
    const currentIndex = tabs.indexOf(tab);

    if (dx < 0 && currentIndex < tabs.length - 1) {
      // swipe left = next tab
      handleTabChange(tabs[currentIndex + 1]);
    } else if (dx > 0 && currentIndex > 0) {
      // swipe right = prev tab
      handleTabChange(tabs[currentIndex - 1]);
    }
  };

  const handleTabChange = (newTab: "feed" | "discover" | "board") => {
    setTab(newTab);
    const params = new URLSearchParams();
    params.set("tab", newTab);
    router.push(`/sns?${params}`, { scroll: false });
  };

  return (
    <div>
      {/* タブ */}
      <div className="flex gap-1 px-4 mb-4">
        <button
          onClick={() => handleTabChange("feed")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "feed" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
          }`}
        >
          <Users size={14} />
          フィード
        </button>
        <button
          onClick={() => handleTabChange("discover")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "discover" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
          }`}
        >
          <Compass size={14} />
          発見
        </button>
        <button
          onClick={() => handleTabChange("board")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "board" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
          }`}
        >
          <Target size={14} />
          挑戦
        </button>
      </div>

      <div
        className="px-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tab === "feed" && <FeedTimeline currentUserId={currentUserId} />}
        {tab === "discover" && <DiscoverFeed currentUserId={currentUserId} initialTag={initialTag} />}
        {tab === "board" && (
          <>
            <p className="text-xs text-stone-400 bg-stone-50 rounded-lg px-3 py-2 mb-4 text-center">
              🎯 仲間が取り組み中の挑戦を一覧できます。フォローして応援しましょう
            </p>
            <ChallengeBoardView />
          </>
        )}
      </div>
    </div>
  );
}
