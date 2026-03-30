"use client";

import { useState, useEffect } from "react";
import FollowButton from "./FollowButton";
import BadgeGrid from "./BadgeGrid";
import UpdateCalendar from "./UpdateCalendar";
import PostCard from "./PostCard";
import MentorRequestButton from "./MentorRequestButton";
import { Loader2 } from "lucide-react";

const PHASE_LABELS: Record<string, string> = {
  exploring: "模索中",
  starting: "始めたて",
  building: "軌道に乗ってきた",
  maintaining: "定着期",
};

const SEEKING_LABELS: Record<string, string> = {
  accountability: "仲間がほしい",
  inspiration: "刺激がほしい",
  advice: "先輩に聞きたい",
  companionship: "一緒に頑張りたい",
};

interface Profile {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  challenge_tags: string[];
  update_phase: string;
  seeking: string | null;
  is_mentor: boolean;
}

interface Props {
  userId: string;
  currentUserId: string;
}

export default function ProfileView({ userId, currentUserId }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mentorStatus, setMentorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwn = userId === currentUserId;

  useEffect(() => {
    const load = async () => {
      try {
        // プロフィール取得
        const profileRes = isOwn
          ? await fetch("/api/sns/profile")
          : await fetch(`/api/sns/search?q=&tags=&phase=`).then(async (r) => {
              const data = await r.json();
              const found = (data.profiles || []).find((p: any) => p.user_id === userId);
              return { json: async () => ({ profile: found || null, is_following: found?.is_following }) };
            });

        if (isOwn) {
          const pData = await profileRes.json();
          setProfile(pData.profile);
        } else {
          const pData = await profileRes.json();
          setProfile(pData.profile);
          setIsFollowing(pData.is_following || false);
        }

        // 投稿取得
        const postsRes = await fetch(`/api/sns/posts?user_id=${userId}&limit=10`);
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);

        // メンター接続状態取得 (他ユーザーのみ)
        if (!isOwn) {
          const mentorsRes = await fetch("/api/sns/mentors?tab=mentors");
          const mentorsData = await mentorsRes.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existing = (mentorsData.connections || []).find((c: any) => c.mentor_id === userId);
          setMentorStatus(existing?.status || null);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, isOwn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 text-sm">プロフィールが見つかりません</p>
      </div>
    );
  }

  const initial = profile.nickname?.[0] || "?";

  return (
    <div className="space-y-6">
      {/* プロフィールヘッダー */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-700 shrink-0">
            {initial}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">{profile.nickname}</h2>
              {!isOwn && (
                <div className="flex flex-col items-end gap-1.5">
                  <FollowButton userId={userId} isFollowing={isFollowing} />
                  {profile.is_mentor && (
                    <MentorRequestButton
                      mentorUserId={userId}
                      initialStatus={mentorStatus}
                    />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {PHASE_LABELS[profile.update_phase]}
              {profile.seeking && ` · ${SEEKING_LABELS[profile.seeking]}`}
            </p>
            {profile.bio && (
              <p className="text-sm text-stone-600 mt-2">{profile.bio}</p>
            )}

            {/* 挑戦タグ */}
            {profile.challenge_tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.challenge_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ピン留めバッジ */}
            <div className="mt-3">
              <BadgeGrid userId={userId} compact />
            </div>
          </div>
        </div>
      </div>

      {/* 更新カレンダー */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <UpdateCalendar userId={userId} />
      </div>

      {/* バッジ一覧 */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <BadgeGrid userId={isOwn ? undefined : userId} />
      </div>

      {/* 最近の投稿 */}
      {posts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-stone-700">最近の更新</h3>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
