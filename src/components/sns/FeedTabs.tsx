"use client";

import { useState } from "react";
import FeedTimeline from "./FeedTimeline";
import ChallengeBoardView from "./ChallengeBoardView";

export default function FeedTabs({ currentUserId }: { currentUserId: string }) {
  const [tab, setTab] = useState<"feed" | "board">("feed");

  return (
    <div>
      {/* タブ */}
      <div className="flex gap-1 px-4 mb-4">
        <button
          onClick={() => setTab("feed")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "feed" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          フィード
        </button>
        <button
          onClick={() => setTab("board")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "board" ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          🎯 チャレンジボード
        </button>
      </div>

      <div className="px-4">
        {tab === "feed" ? (
          <FeedTimeline currentUserId={currentUserId} />
        ) : (
          <ChallengeBoardView />
        )}
      </div>
    </div>
  );
}
