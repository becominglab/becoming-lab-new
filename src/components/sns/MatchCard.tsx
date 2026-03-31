"use client";

import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";

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

const phaseLabel: Record<string, string> = {
  exploring: "模索中",
  starting: "始動中",
  building: "構築中",
  maintaining: "維持中",
};

export default function MatchCard({ user }: { user: MatchUser }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200">
      {/* マッチ理由バナー */}
      <div className="mb-3 px-2 py-1.5 bg-teal-50 rounded-lg text-xs text-teal-700 font-medium flex items-center gap-1.5">
        <span>✨</span>
        {user.match_reason}
      </div>

      <div className="flex items-start gap-3">
        {/* アバター */}
        <Link href={`/sns/profile/${user.user_id}`} className="shrink-0">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.nickname}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
              {user.nickname[0]}
            </div>
          )}
        </Link>

        {/* プロフィール情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/sns/profile/${user.user_id}`}
              className="font-semibold text-stone-900 text-sm truncate hover:underline"
            >
              {user.nickname}
            </Link>
            {user.update_phase && (
              <span className="shrink-0 text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                {phaseLabel[user.update_phase] || user.update_phase}
              </span>
            )}
          </div>

          {user.bio && (
            <p className="text-stone-500 text-xs line-clamp-2 mb-2">{user.bio}</p>
          )}

          {/* タグ */}
          {(user.challenge_tags || []).length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {(user.challenge_tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <FollowButton
            userId={user.user_id}
            isFollowing={user.is_following}
          />
        </div>
      </div>
    </div>
  );
}
