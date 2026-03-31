"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserSearchResults from "./UserSearchResults";
import MatchCard from "./MatchCard";
import MentorRequestButton from "./MentorRequestButton";
import { Loader2, Sparkles, GraduationCap, Hash, Search, Flame, FileText, Trophy, MessageSquare } from "lucide-react";
import Link from "next/link";

interface MatchUser {
  user_id: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  challenge_tags?: string[];
  update_phase?: string;
  match_score: number;
  match_reason: string;
  is_following: boolean;
}

interface MentorUser {
  user_id: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  challenge_tags?: string[];
  connection_status: string | null;
}

interface PostResult {
  id: string;
  user_id: string;
  post_type: string;
  content: {
    did?: string;
    content?: string;
    label?: string;
  };
  tags?: string[];
  created_at: string;
  public_profiles: {
    nickname: string;
    avatar_url: string | null;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function PostTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "auto_log": return <Flame size={11} className="text-orange-500" />;
    case "declaration": return <MessageSquare size={11} className="text-blue-500" />;
    case "milestone": return <Trophy size={11} className="text-amber-500" />;
    default: return <FileText size={11} className="text-teal-500" />;
  }
}

function PostSearchTab() {
  const [tagQuery, setTagQuery] = useState("");
  const [results, setResults] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const tag = tagQuery.replace(/^#/, "").trim();
    if (!tag) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/sns/posts?tag=${encodeURIComponent(tag)}&feed=discover&limit=20`);
      const data = await res.json();
      setResults(data.posts || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ハッシュタグで投稿を検索"
            className="w-full pl-8 pr-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !tagQuery.trim()}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-stone-400 text-center">
              #{tagQuery.replace(/^#/, "")} の投稿 {results.length}件
            </p>
            {results.map((post) => (
              <Link
                key={post.id}
                href={`/sns/posts/${post.id}`}
                className="block bg-white rounded-xl border border-stone-200 p-3 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {post.public_profiles.avatar_url ? (
                    <Image
                      src={post.public_profiles.avatar_url}
                      alt={post.public_profiles.nickname}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                      {post.public_profiles.nickname?.[0] || "?"}
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-700">{post.public_profiles.nickname}</span>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 ml-auto">
                    <PostTypeIcon type={post.post_type} />
                    <span>{timeAgo(post.created_at)}</span>
                  </div>
                </div>
                <p className="text-sm text-stone-700 line-clamp-2">
                  {post.content.did || post.content.content || post.content.label || ""}
                </p>
                {(post.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(post.tags || []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          tag === tagQuery.replace(/^#/, "")
                            ? "bg-teal-100 text-teal-700 font-medium"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 space-y-1">
            <p className="text-2xl">🔍</p>
            <p className="text-stone-400 text-sm">#{tagQuery.replace(/^#/, "")} の投稿が見つかりません</p>
          </div>
        )
      ) : (
        <div className="text-center py-10 space-y-1">
          <p className="text-2xl">#</p>
          <p className="text-stone-400 text-sm">ハッシュタグで投稿を検索できます</p>
          <p className="text-stone-300 text-xs">例: #英語 #筋トレ #早起き</p>
        </div>
      )}
    </div>
  );
}

export default function SearchTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<"search" | "posts" | "match" | "mentor">("search");
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchLoaded, setMatchLoaded] = useState(false);
  const [mentorLoaded, setMentorLoaded] = useState(false);

  useEffect(() => {
    if (tab === "match" && !matchLoaded) loadMatches();
    if (tab === "mentor" && !mentorLoaded) loadMentors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function loadMatches() {
    setLoading(true);
    try {
      const res = await fetch("/api/sns/match");
      const data = await res.json();
      setMatches(data.matches || []);
      setMatchLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadMentors() {
    setLoading(true);
    try {
      const res = await fetch("/api/sns/mentors?tab=find");
      const data = await res.json();
      setMentors(data.mentors || []);
      setMentorLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* タブ */}
      <div className="flex gap-1 px-4 mb-4">
        <button
          onClick={() => setTab("search")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "search" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          ユーザー
        </button>
        <button
          onClick={() => setTab("posts")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            tab === "posts" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          <Hash size={13} />
          投稿
        </button>
        <button
          onClick={() => setTab("match")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            tab === "match" ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          <Sparkles size={13} />
          マッチ
        </button>
        <button
          onClick={() => setTab("mentor")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            tab === "mentor" ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          <GraduationCap size={13} />
          メンター
        </button>
      </div>

      {/* コンテンツ */}
      <div className="px-4">
        {tab === "search" && <UserSearchResults />}

        {tab === "posts" && <PostSearchTab />}

        {tab === "match" && (
          <div>
            {!loading && !matchLoaded && (
              <p className="text-xs text-stone-400 bg-teal-50 rounded-lg px-3 py-2 mb-4 text-center">
                ✨ 挑戦タグや目的が近いメンバーをスコアで自動マッチングします
              </p>
            )}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={24} className="animate-spin text-teal-500" />
              </div>
            ) : matchLoaded && matches.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <p className="text-2xl">🔍</p>
                <p className="text-stone-500 text-sm">
                  まずプロフィールの挑戦タグを設定すると<br />相性の良い仲間が見つかります
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchLoaded && (
                  <p className="text-xs text-stone-400 text-center mb-2">
                    あなたの挑戦タグに合う仲間 {matches.length}人
                  </p>
                )}
                {matches.map((user) => (
                  <MatchCard key={user.user_id} user={user} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "mentor" && (
          <div>
            {!loading && !mentorLoaded && (
              <p className="text-xs text-stone-400 bg-amber-50 rounded-lg px-3 py-2 mb-4 text-center">
                🎓 同じ挑戦を先に経験した仲間にアドバイスをもらえます
              </p>
            )}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={24} className="animate-spin text-amber-400" />
              </div>
            ) : mentorLoaded && mentors.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <GraduationCap size={32} className="mx-auto text-stone-200" />
                <p className="text-stone-500 text-sm">
                  現在メンター募集中のメンバーはいません
                </p>
                <p className="text-xs text-stone-400">
                  「維持中」フェーズのユーザーがメンターになれます
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mentorLoaded && (
                  <p className="text-xs text-stone-400 text-center mb-2">
                    メンター募集中 {mentors.length}人
                  </p>
                )}
                {mentors.map((mentor) => (
                  <div key={mentor.user_id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
                    <div className="flex items-start gap-3">
                      <button onClick={() => router.push(`/sns/profile/${mentor.user_id}`)}>
                        {mentor.avatar_url ? (
                          <Image
                            src={mentor.avatar_url}
                            alt={mentor.nickname}
                            width={44}
                            height={44}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                            {mentor.nickname[0]}
                          </div>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => router.push(`/sns/profile/${mentor.user_id}`)}
                          className="font-semibold text-stone-900 text-sm"
                        >
                          {mentor.nickname}
                        </button>
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                          維持中
                        </span>
                        {mentor.bio && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">{mentor.bio}</p>
                        )}
                        {(mentor.challenge_tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 mb-3">
                            {(mentor.challenge_tags || []).slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <MentorRequestButton
                          mentorUserId={mentor.user_id}
                          initialStatus={mentor.connection_status}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
