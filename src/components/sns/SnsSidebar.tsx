"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Bookmark, Hash } from "lucide-react";
import FollowButton from "./FollowButton";

interface TrendTag {
  tag: string;
  count: number;
}

interface RecommendedUser {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  challenge_tags: string[];
}

export default function SnsSidebar() {
  const [recommended, setRecommended] = useState<RecommendedUser[]>([]);
  const [trendTags] = useState<TrendTag[]>([
    { tag: "運動", count: 42 },
    { tag: "英語", count: 38 },
    { tag: "読書", count: 31 },
    { tag: "睡眠改善", count: 27 },
    { tag: "ダイエット", count: 24 },
  ]);

  useEffect(() => {
    fetch("/api/sns/recommendations")
      .then((r) => r.json())
      .then((d) => setRecommended((d.users || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <aside className="space-y-4">
      {/* トレンドタグ */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-teal-600" />
          <p className="text-xs font-semibold text-stone-700">トレンドタグ</p>
        </div>
        <div className="space-y-1.5">
          {trendTags.map((t, i) => (
            <Link
              key={t.tag}
              href={`/sns?tab=discover&tag=${encodeURIComponent(t.tag)}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-50 transition-colors group"
            >
              <span className="text-xs text-stone-400 w-4">{i + 1}</span>
              <Hash size={11} className="text-teal-500" />
              <span className="text-sm text-stone-700 group-hover:text-teal-600 transition-colors">{t.tag}</span>
              <span className="text-xs text-stone-400 ml-auto">{t.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* おすすめユーザー */}
      {recommended.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <p className="text-xs font-semibold text-stone-700">おすすめの仲間</p>
          </div>
          <div className="space-y-3">
            {recommended.map((u) => (
              <div key={u.user_id} className="flex items-center gap-2.5">
                <Link href={`/sns/profile/${u.user_id}`} className="shrink-0">
                  {u.avatar_url ? (
                    <Image src={u.avatar_url} alt={u.nickname} width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {u.nickname?.[0] || "?"}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/sns/profile/${u.user_id}`} className="text-xs font-medium text-stone-800 hover:underline block truncate">
                    {u.nickname}
                  </Link>
                  <div className="flex gap-1 flex-wrap">
                    {u.challenge_tags.slice(0, 1).map((tag) => (
                      <span key={tag} className="text-[10px] px-1 py-0.5 bg-teal-50 text-teal-600 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>
                <FollowButton userId={u.user_id} isFollowing={false} compact />
              </div>
            ))}
          </div>
          <Link href="/sns/search?tab=match" className="block text-center text-xs text-teal-600 hover:text-teal-700 mt-3 font-medium">
            もっと見る →
          </Link>
        </div>
      )}

      {/* クイックリンク */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="space-y-1">
          <Link href="/sns/bookmarks" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-600 hover:text-teal-600 transition-colors">
            <Bookmark size={14} />
            ブックマーク
          </Link>
        </div>
      </div>
    </aside>
  );
}
