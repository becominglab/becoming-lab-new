"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserSearchResults from "./UserSearchResults";
import MatchCard from "./MatchCard";
import MentorRequestButton from "./MentorRequestButton";
import { Loader2, Sparkles, GraduationCap } from "lucide-react";

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

export default function SearchTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<"search" | "match" | "mentor">("search");
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
          さがす
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
