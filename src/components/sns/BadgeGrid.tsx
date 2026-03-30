"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  earned: boolean;
  earned_at: string | null;
  is_pinned: boolean;
}

interface Props {
  userId?: string;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  streak: "ストリーク",
  body: "Body",
  challenge: "チャレンジ",
  story: "ストーリー",
  social: "ソーシャル",
};

export default function BadgeGrid({ userId, compact }: Props) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [pinned, setPinned] = useState<Badge[]>([]);

  useEffect(() => {
    const params = userId ? `?user_id=${userId}` : "";
    fetch(`/api/sns/badges${params}`)
      .then((r) => r.json())
      .then((data) => {
        setBadges(data.badges || []);
        setPinned(data.pinned || []);
      })
      .catch(() => {});
  }, [userId]);

  const togglePin = async (badgeId: string, currentPinned: boolean) => {
    if (!currentPinned && pinned.length >= 3) return;

    const res = await fetch("/api/sns/badges", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badge_id: badgeId, is_pinned: !currentPinned }),
    });

    if (res.ok) {
      setBadges((prev) =>
        prev.map((b) => (b.id === badgeId ? { ...b, is_pinned: !currentPinned } : b))
      );
      setPinned((prev) =>
        !currentPinned
          ? [...prev, badges.find((b) => b.id === badgeId)!]
          : prev.filter((b) => b.id !== badgeId)
      );
    }
  };

  if (compact) {
    // ピン留めバッジのみ表示
    if (pinned.length === 0) return null;
    return (
      <div className="flex items-center gap-2">
        {pinned.map((badge) => (
          <span key={badge.id} className="text-lg" title={badge.name}>
            {badge.icon}
          </span>
        ))}
      </div>
    );
  }

  const grouped = badges.reduce<Record<string, Badge[]>>((acc, badge) => {
    (acc[badge.category] ||= []).push(badge);
    return acc;
  }, {});

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-800">
          バッジ <span className="text-stone-400 font-normal">{earnedCount}/{badges.length}</span>
        </h3>
      </div>

      {Object.entries(grouped).map(([category, categoryBadges]) => (
        <div key={category}>
          <p className="text-xs font-medium text-stone-500 mb-2">
            {CATEGORY_LABELS[category] || category}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {categoryBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => badge.earned && !userId && togglePin(badge.id, badge.is_pinned)}
                disabled={!badge.earned || !!userId}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  badge.earned
                    ? badge.is_pinned
                      ? "bg-amber-50 border border-amber-300"
                      : "bg-white border border-stone-200 hover:border-stone-300"
                    : "bg-stone-50 border border-stone-100 opacity-50"
                }`}
                title={badge.earned ? `${badge.name} — ${badge.description}` : badge.description}
              >
                <span className="text-xl">
                  {badge.earned ? badge.icon : <Lock size={18} className="text-stone-300" />}
                </span>
                <span className="text-[9px] text-stone-600 text-center leading-tight">
                  {badge.name}
                </span>
                {badge.is_pinned && (
                  <span className="text-[8px] text-amber-600">ピン留め</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
