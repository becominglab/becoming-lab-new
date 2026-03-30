"use client";

import { useState } from "react";

const REACTIONS = [
  { type: "nice_update", emoji: "\uD83D\uDD25", label: "ナイス更新" },
  { type: "together", emoji: "\uD83D\uDCAA", label: "一緒に" },
  { type: "helpful", emoji: "\uD83D\uDC40", label: "参考に" },
  { type: "keep_going", emoji: "\uD83C\uDFAF", label: "その調子" },
];

interface Props {
  postId: string;
  myReactions: string[];
  types: string[];
  counts?: Record<string, number>;
  isOwn: boolean;
}

export default function ReactionBar({ postId, myReactions: initialMy, types: initialTypes, counts: initialCounts, isOwn }: Props) {
  const [myReactions, setMyReactions] = useState<string[]>(initialMy);
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts || {});

  const toggle = async (reactionType: string) => {
    const isActive = myReactions.includes(reactionType);

    // 楽観的更新
    if (isActive) {
      setMyReactions((prev) => prev.filter((t) => t !== reactionType));
      if (isOwn) {
        setCounts((prev) => ({
          ...prev,
          [reactionType]: Math.max((prev[reactionType] || 1) - 1, 0),
        }));
      }
    } else {
      setMyReactions((prev) => [...prev, reactionType]);
      if (!types.includes(reactionType)) {
        setTypes((prev) => [...prev, reactionType]);
      }
      if (isOwn) {
        setCounts((prev) => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1,
        }));
      }
    }

    try {
      if (isActive) {
        await fetch(`/api/sns/reactions?post_id=${postId}&type=${reactionType}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/sns/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId, reaction_type: reactionType }),
        });
      }
    } catch {
      // revert on error
      if (isActive) {
        setMyReactions((prev) => [...prev, reactionType]);
      } else {
        setMyReactions((prev) => prev.filter((t) => t !== reactionType));
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      {REACTIONS.map(({ type, emoji, label }) => {
        const isActive = myReactions.includes(type);
        const hasAny = types.includes(type);
        const count = counts[type] || 0;

        return (
          <button
            key={type}
            onClick={() => toggle(type)}
            className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs transition-all ${
              isActive
                ? "bg-teal-50 border border-teal-300 text-teal-700"
                : hasAny
                ? "bg-stone-50 border border-stone-200 text-stone-500"
                : "bg-white border border-stone-100 text-stone-400 hover:border-stone-200"
            }`}
            title={label}
          >
            <span className="text-sm">{emoji}</span>
            {isOwn && count > 0 && (
              <span className="text-[10px] font-medium">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
