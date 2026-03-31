"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Bookmark, Hash, Compass, Users } from "lucide-react";
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

const FALLBACK_TAGS: TrendTag[] = [
  { tag: "運動", count: 0 },
  { tag: "英語", count: 0 },
  { tag: "読書", count: 0 },
  { tag: "睡眠改善", count: 0 },
  { tag: "ダイエット", count: 0 },
];

export default function SnsSidebar() {
  const [recommended, setRecommended] = useState<RecommendedUser[]>([]);
  const [trendTags, setTrendTags] = useState<TrendTag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [trendPosts, setTrendPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sns/recommendations")
      .then((r) => r.json())
      .then((d) => setRecommended((d.users || []).slice(0, 3)))
      .catch(() => {});

    fetch("/api/sns/posts?feed=trending&limit=3")
      .then((r) => r.json())
      .then((d) => setTrendPosts((d.posts || []).slice(0, 3)))
      .catch(() => {});

    fetch("/api/sns/trending-tags")
      .then((r) => r.json())
      .then((d) => {
        const tags: TrendTag[] = d.tags || [];
        setTrendTags(tags.length > 0 ? tags : FALLBACK_TAGS);
      })
      .catch(() => setTrendTags(FALLBACK_TAGS))
      .finally(() => setTagsLoading(false));
  }, []);

  return (
    <aside className="space-y-4">
      {/* 今週の人気投稿 */}
      {trendPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-amber-500" />
            <p className="text-xs font-semibold text-stone-700">今週の人気投稿</p>
          </div>
          <div className="space-y-2.5">
            {trendPosts.map((post) => (
              <Link
                key={post.id}
                href={`/sns/posts/${post.id}`}
                className="block group"
              >
                <div className="flex items-start gap-2">
                  {post.public_profiles?.avatar_url ? (
                    <Image
                      src={post.public_profiles.avatar_url}
                      alt={post.public_profiles.nickname}
                      width={24}
                      height={24}
                      className="rounded-full object-cover shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700 shrink-0 mt-0.5">
                      {post.public_profiles?.nickname?.[0] || "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-stone-700 line-clamp-2 group-hover:text-teal-600 transition-colors leading-relaxed">
                      {post.content?.did || post.content?.content || post.content?.label || ""}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {post.public_profiles?.nickname} · {post.reactions?.total || 0}❤
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* トレンドタグ */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-teal-600" />
          <p className="text-xs font-semibold text-stone-700">トレンドタグ</p>
        </div>
        <div className="space-y-1.5">
          {tagsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                <div className="w-4 h-3 bg-stone-100 rounded animate-pulse" />
                <div className="flex-1 h-3 bg-stone-100 rounded animate-pulse" />
                <div className="w-6 h-3 bg-stone-100 rounded animate-pulse" />
              </div>
            ))
          ) : (
            trendTags.map((t, i) => (
              <Link
                key={t.tag}
                href={`/sns?tab=discover&tag=${encodeURIComponent(t.tag)}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-50 transition-colors group"
              >
                <span className="text-xs text-stone-400 w-4">{i + 1}</span>
                <Hash size={11} className="text-teal-500" />
                <span className="text-sm text-stone-700 group-hover:text-teal-600 transition-colors">{t.tag}</span>
                <span className="text-xs text-stone-400 ml-auto">{t.count > 0 ? t.count : ""}</span>
              </Link>
            ))
          )}
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
        <p className="text-xs font-semibold text-stone-700 mb-2">クイックリンク</p>
        <div className="space-y-1">
          <Link href="/sns?tab=discover" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-600 hover:text-teal-600 transition-colors">
            <Compass size={14} />
            発見する
          </Link>
          <Link href="/sns/search?tab=match" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-600 hover:text-teal-600 transition-colors">
            <Sparkles size={14} />
            マッチング
          </Link>
          <Link href="/sns/bookmarks" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-600 hover:text-teal-600 transition-colors">
            <Bookmark size={14} />
            ブックマーク
          </Link>
          <Link href="/sns/circles" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-600 hover:text-teal-600 transition-colors">
            <Users size={14} />
            サークル
          </Link>
        </div>
      </div>
    </aside>
  );
}
