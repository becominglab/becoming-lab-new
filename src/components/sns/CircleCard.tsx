"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Check, Loader2 } from "lucide-react";

interface Circle {
  id: string;
  name: string;
  theme_tag: string;
  description?: string;
  max_members: number;
  member_count: number;
  is_full?: boolean;
  my_role?: string;
}

interface Props {
  circle: Circle;
  /** discoverタブから渡されたとき true — インライン参加ボタンを表示 */
  showJoinButton?: boolean;
  /** 参加完了時のコールバック */
  onJoined?: (circleId: string) => void;
}

export default function CircleCard({ circle, showJoinButton, onJoined }: Props) {
  const fillRate = circle.member_count / circle.max_members;
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin(e: React.MouseEvent) {
    e.stopPropagation(); // カードのonClickを発火させない
    if (joining || joined || circle.is_full) return;
    setJoining(true);
    setError("");
    try {
      const res = await fetch(`/api/sns/circles/${circle.id}/join`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setJoined(true);
        onJoined?.(circle.id);
      } else {
        setError(json.error || "参加できませんでした");
        // 3秒後にエラーを消す
        setTimeout(() => setError(""), 3000);
      }
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <Link
        href={`/sns/circles/${circle.id}`}
        className="block text-left p-4 active:bg-stone-50 transition-colors"
      >
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-900 text-sm truncate">{circle.name}</h3>
            <span className="text-xs text-teal-600">#{circle.theme_tag}</span>
          </div>
          {circle.my_role === "owner" && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full ml-2">
              オーナー
            </span>
          )}
          {circle.my_role === "member" && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-full ml-2">
              参加中
            </span>
          )}
        </div>

        {circle.description && (
          <p className="text-stone-500 text-xs line-clamp-2 mb-3">{circle.description}</p>
        )}

        {/* メンバー進捗バー */}
        <div className="flex items-center gap-2">
          <Users size={12} className="text-stone-400 shrink-0" />
          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                fillRate >= 1 ? "bg-red-400" : fillRate >= 0.7 ? "bg-amber-400" : "bg-teal-400"
              }`}
              style={{ width: `${Math.min(fillRate * 100, 100)}%` }}
            />
          </div>
          <span className="shrink-0 text-xs text-stone-400">
            {circle.member_count}/{circle.max_members}人
          </span>
          {circle.is_full && (
            <span className="shrink-0 text-xs text-red-500">満員</span>
          )}
        </div>
      </Link>

      {/* discoverモードのインライン参加ボタン */}
      {showJoinButton && (
        <div className="px-4 pb-4">
          {error && (
            <p className="text-xs text-red-500 mb-2 text-center">{error}</p>
          )}
          <button
            onClick={handleJoin}
            disabled={joining || joined || circle.is_full}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              joined
                ? "bg-teal-50 text-teal-600 border border-teal-200"
                : circle.is_full
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98]"
            }`}
          >
            {joining ? (
              <><Loader2 size={14} className="animate-spin" />参加中...</>
            ) : joined ? (
              <><Check size={14} />参加しました！</>
            ) : circle.is_full ? (
              "満員のため参加できません"
            ) : (
              "このサークルに参加する"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
