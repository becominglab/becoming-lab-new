"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

const REACTIONS = [
  { type: "nice_update", emoji: "🔥", label: "ナイス更新" },
  { type: "together", emoji: "💪", label: "一緒に" },
  { type: "helpful", emoji: "👀", label: "参考に" },
  { type: "keep_going", emoji: "🎯", label: "その調子" },
];

interface Props {
  postId: string;
  myReactions: string[];
  types: string[];
  counts?: Record<string, number>;
  isOwn: boolean;
}

export default function ReactionBar({ postId, myReactions: initialMy, types: initialTypes, counts: initialCounts, isOwn }: Props) {
  const { showToast } = useToast();
  const [myReactions, setMyReactions] = useState<string[]>(initialMy);
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts || {});

  const toggle = async (reactionType: string) => {
    if (isOwn) return; // 自分の投稿にはリアクション不可
    const isActive = myReactions.includes(reactionType);

    // 楽観的更新
    if (isActive) {
      setMyReactions((prev) => prev.filter((t) => t !== reactionType));
      setCounts((prev) => ({
        ...prev,
        [reactionType]: Math.max((prev[reactionType] || 1) - 1, 0),
      }));
    } else {
      setMyReactions((prev) => [...prev, reactionType]);
      if (!types.includes(reactionType)) {
        setTypes((prev) => [...prev, reactionType]);
      }
      setCounts((prev) => ({
        ...prev,
        [reactionType]: (prev[reactionType] || 0) + 1,
      }));
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
      showToast("リアクションに失敗しました", "error");
      if (isActive) {
        setMyReactions((prev) => [...prev, reactionType]);
        setCounts((prev) => ({ ...prev, [reactionType]: (prev[reactionType] || 0) + 1 }));
      } else {
        setMyReactions((prev) => prev.filter((t) => t !== reactionType));
        setCounts((prev) => ({ ...prev, [reactionType]: Math.max((prev[reactionType] || 1) - 1, 0) }));
      }
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {REACTIONS.map(({ type, emoji, label }) => {
        const isActive = myReactions.includes(type);
        const count = counts[type] || 0;
        if (isOwn && count === 0) return null; // 自分投稿はカウントあるもののみ表示

        return (
          <button
            key={type}
            onClick={() => toggle(type)}
            disabled={isOwn}
            className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-full text-xs transition-all active:scale-90 ${
              isOwn
                ? "bg-stone-50 border border-stone-100 text-stone-400 cursor-default"
                : isActive
                ? "bg-teal-50 border border-teal-300 text-teal-700 hover:bg-teal-100"
                : count > 0
                ? "bg-stone-50 border border-stone-200 text-stone-500 hover:border-stone-300"
                : "bg-white border border-stone-100 text-stone-300 hover:border-stone-200 hover:text-stone-400"
            }`}
            title={isOwn ? label : isActive ? `${label}を取り消す` : label}
          >
            <span className="text-sm">{emoji}</span>
            {isActive && !isOwn && (
              <span className="text-[9px] font-medium leading-none">{label}</span>
            )}
            {count > 0 && (
              <span className="text-[10px] font-medium">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
