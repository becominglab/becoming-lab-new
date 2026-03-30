"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface Props {
  userId: string;
  isFollowing: boolean;
  onToggle?: (isFollowing: boolean) => void;
  /** コンパクト表示（アイコンのみ） */
  compact?: boolean;
}

export default function FollowButton({ userId, isFollowing: initial, onToggle, compact }: Props) {
  const { showToast } = useToast();
  const [following, setFollowing] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const prevFollowing = following;
    // 楽観的更新
    setFollowing(!following);
    onToggle?.(!following);

    try {
      if (prevFollowing) {
        const res = await fetch(`/api/sns/follows?following_id=${userId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("フォロー解除に失敗しました");
      } else {
        const res = await fetch("/api/sns/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ following_id: userId }),
        });
        if (!res.ok) throw new Error("フォローに失敗しました");
        showToast("フォローしました！", "success");
      }
    } catch (err) {
      // 楽観的更新を戻す
      setFollowing(prevFollowing);
      onToggle?.(prevFollowing);
      showToast(err instanceof Error ? err.message : "操作に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          following
            ? "bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-500"
            : "bg-teal-600 text-white hover:bg-teal-700"
        }`}
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : following ? <UserMinus size={13} /> : <UserPlus size={13} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        following
          ? "bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600"
          : "bg-teal-600 text-white hover:bg-teal-700"
      }`}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : following ? (
        <UserMinus size={12} />
      ) : (
        <UserPlus size={12} />
      )}
      {following ? "フォロー中" : "フォロー"}
    </button>
  );
}
