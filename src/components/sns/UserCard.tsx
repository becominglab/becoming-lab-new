"use client";

import Link from "next/link";
import FollowButton from "./FollowButton";

interface Profile {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  challenge_tags: string[];
  update_phase: string;
  is_following?: boolean;
}

const PHASE_LABELS: Record<string, string> = {
  exploring: "模索中",
  starting: "始めたて",
  building: "軌道に乗ってきた",
  maintaining: "定着期",
};

interface Props {
  profile: Profile;
  showFollow?: boolean;
}

export default function UserCard({ profile, showFollow = true }: Props) {
  const initial = profile.nickname?.[0] || "?";

  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-stone-200 p-4">
      <Link
        href={`/sns/profile/${profile.user_id}`}
        className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 shrink-0"
      >
        {initial}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/sns/profile/${profile.user_id}`}
            className="text-sm font-medium text-stone-800 hover:underline truncate"
          >
            {profile.nickname}
          </Link>
          {showFollow && (
            <FollowButton
              userId={profile.user_id}
              isFollowing={!!profile.is_following}
            />
          )}
        </div>

        <p className="text-xs text-stone-400 mt-0.5">
          {PHASE_LABELS[profile.update_phase] || profile.update_phase}
        </p>

        {profile.bio && (
          <p className="text-xs text-stone-600 mt-1 line-clamp-2">{profile.bio}</p>
        )}

        {profile.challenge_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.challenge_tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full text-[10px]"
              >
                {tag}
              </span>
            ))}
            {profile.challenge_tags.length > 4 && (
              <span className="text-[10px] text-stone-400">+{profile.challenge_tags.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
