"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Target } from "lucide-react";
import FollowButton from "./FollowButton";
import { PHASE_LABELS } from "@/lib/sns/phases";

const TAG_OPTIONS = [
  "ダイエット", "筋トレ", "ランニング", "読書", "瞑想",
  "早起き", "英語", "副業", "食事改善",
];

const PHASE_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "exploring", label: PHASE_LABELS.exploring },
  { value: "starting", label: PHASE_LABELS.starting },
  { value: "building", label: PHASE_LABELS.building },
  { value: "maintaining", label: PHASE_LABELS.maintaining },
];

interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date?: string;
  target_date?: string;
  status: string;
  is_own: boolean;
  is_following: boolean;
  profile?: {
    nickname: string;
    avatar_url?: string;
    update_phase?: string;
    challenge_tags?: string[];
  };
}

export default function ChallengeBoardView() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");
  const [phase, setPhase] = useState("");

  useEffect(() => {
    loadChallenges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, phase]);

  async function loadChallenges() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTag) params.set("tag", selectedTag);
      if (phase) params.set("phase", phase);
      const res = await fetch(`/api/sns/challenge-board?${params}`);
      const data = await res.json();
      setChallenges(data.challenges || []);
    } finally {
      setLoading(false);
    }
  }

  const daysRemaining = (targetDate?: string) => {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-4">
      {/* タグフィルター */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTag("")}
          className={`shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
            !selectedTag ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          すべて
        </button>
        {TAG_OPTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
              selectedTag === tag ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-500"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* フェーズフィルター */}
      <div className="flex gap-1 overflow-x-auto">
        {PHASE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPhase(opt.value)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-colors ${
              phase === opt.value
                ? "bg-stone-700 text-white"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* チャレンジ一覧 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={22} className="animate-spin text-stone-300" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <Target size={32} className="mx-auto text-stone-200" />
          <p className="text-stone-400 text-sm">チャレンジ中のメンバーが見つかりません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {challenges.map((c) => {
            const remaining = daysRemaining(c.target_date);
            return (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
                {/* ユーザー情報 */}
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => router.push(`/sns/profile/${c.user_id}`)}>
                    {c.profile?.avatar_url ? (
                      <Image
                        src={c.profile.avatar_url}
                        alt={c.profile.nickname}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {c.profile?.nickname?.[0] || "?"}
                      </div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => router.push(`/sns/profile/${c.user_id}`)}
                      className="text-xs font-medium text-stone-700 truncate"
                    >
                      {c.profile?.nickname}
                    </button>
                  </div>
                  {!c.is_own && (
                    <FollowButton userId={c.user_id} isFollowing={c.is_following} />
                  )}
                </div>

                {/* チャレンジ内容 */}
                <div className="flex items-start gap-2">
                  <Target size={14} className="text-teal-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-800">{c.title}</p>
                    {c.description && (
                      <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{c.description}</p>
                    )}
                  </div>
                </div>

                {/* 期限 */}
                {remaining !== null && (
                  <div className="mt-2 text-right">
                    <span className={`text-xs ${remaining < 0 ? "text-red-400" : remaining < 7 ? "text-amber-500" : "text-stone-300"}`}>
                      {remaining < 0
                        ? `${Math.abs(remaining)}日超過`
                        : remaining === 0
                        ? "今日が期限"
                        : `あと${remaining}日`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
