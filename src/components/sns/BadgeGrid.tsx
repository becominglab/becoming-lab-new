"use client";

import { useState, useEffect } from "react";
import { Lock, X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

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
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const params = userId ? `?user_id=${userId}` : "";
    fetch(`/api/sns/badges${params}`)
      .then((r) => r.json())
      .then((data) => {
        setBadges(data.badges || []);
        setPinned(data.pinned || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const togglePin = async (badgeId: string, currentPinned: boolean) => {
    if (!currentPinned && pinned.length >= 3) {
      showToast("プロフィールに固定できるバッジは3個までです。固定中のバッジを外してから試してください", "info");
      return;
    }

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

  const formatEarnedDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  if (!compact && loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-stone-100 rounded w-24 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-xl bg-stone-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-800">
          バッジ <span className="text-stone-400 font-normal">{earnedCount}/{badges.length}</span>
        </h3>
      </div>
      {!userId && (
        <p className="text-xs text-stone-400 -mt-2">最大3個まで固定できます</p>
      )}

      {Object.entries(grouped).map(([category, categoryBadges]) => (
        <div key={category}>
          <p className="text-xs font-medium text-stone-500 mb-2">
            {CATEGORY_LABELS[category] || category}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {categoryBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => {
                  if (badge.earned) {
                    if (!userId) {
                      // own profile: tap to show modal
                      setSelectedBadge(badge);
                    } else {
                      // other's profile: tap to show modal too
                      setSelectedBadge(badge);
                    }
                  }
                }}
                disabled={!badge.earned}
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

      {/* バッジ詳細モーダル */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl p-6 pb-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedBadge.icon}</span>
                <div>
                  <p className="text-base font-bold text-stone-900">{selectedBadge.name}</p>
                  {selectedBadge.earned_at && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {formatEarnedDate(selectedBadge.earned_at)} に獲得
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">{selectedBadge.description}</p>
            {!userId && (
              <button
                onClick={() => {
                  togglePin(selectedBadge.id, selectedBadge.is_pinned);
                  setSelectedBadge(null);
                }}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedBadge.is_pinned
                    ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                {selectedBadge.is_pinned ? "ピン留めを解除する" : "プロフィールにピン留めする"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
