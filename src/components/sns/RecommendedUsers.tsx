"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { Sparkles } from "lucide-react";

interface User {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  bio?: string;
  challenge_tags: string[];
  update_phase?: string;
}

const PHASE_LABELS: Record<string, string> = {
  exploring: "模索中",
  starting: "始めたて",
  building: "軌道に乗ってきた",
  maintaining: "定着期",
};

export default function RecommendedUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sns/recommendations")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || users.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-amber-500" />
        <p className="text-xs font-semibold text-stone-700">あなたにおすすめの仲間</p>
        <span className="text-xs text-stone-400">— タグが似ているユーザー</span>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.user_id} className="flex items-center gap-3">
            <Link href={`/sns/profile/${u.user_id}`} className="shrink-0">
              {u.avatar_url ? (
                <Image
                  src={u.avatar_url}
                  alt={u.nickname}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                  {u.nickname?.[0] || "?"}
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={`/sns/profile/${u.user_id}`}
                className="text-sm font-medium text-stone-800 hover:underline truncate block"
              >
                {u.nickname}
              </Link>
              <div className="flex items-center gap-1.5 flex-wrap">
                {u.update_phase && (
                  <span className="text-[10px] text-stone-400">
                    {PHASE_LABELS[u.update_phase] || u.update_phase}
                  </span>
                )}
                {u.challenge_tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <FollowButton userId={u.user_id} isFollowing={false} compact />
          </div>
        ))}
      </div>

      <Link
        href="/sns/search?tab=match"
        className="block text-center text-xs text-teal-600 hover:text-teal-700 mt-3 font-medium"
      >
        もっと見る →
      </Link>
    </div>
  );
}
