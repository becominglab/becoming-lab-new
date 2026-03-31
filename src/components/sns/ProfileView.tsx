"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FollowButton from "./FollowButton";
import BadgeGrid from "./BadgeGrid";
import UpdateCalendar from "./UpdateCalendar";
import PostCard from "./PostCard";
import MentorRequestButton from "./MentorRequestButton";
import FollowListModal from "./FollowListModal";
import { Loader2, Share2, Pencil } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

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
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [mentorStatus, setMentorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [followModal, setFollowModal] = useState<"followers" | "following" | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [totalReactions, setTotalReactions] = useState(0);
  const [postsHasMore, setPostsHasMore] = useState(false);
  const [postsLoadingMore, setPostsLoadingMore] = useState(false);
  const [profileTab, setProfileTab] = useState<"posts" | "badges" | "calendar">("posts");
  const isOwn = userId === currentUserId;
  const { showToast } = useToast();

  const handleShareProfile = async () => {
    const url = `${window.location.origin}/sns/profile/${userId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile?.nickname}のプロフィール`, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("リンクをコピーしました", "success");
      }
    } catch {
      // user cancelled
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, postsRes, mentorsRes] = await Promise.all([
          fetch(`/api/sns/profile?user_id=${userId}`),
          fetch(`/api/sns/posts?user_id=${userId}&limit=10`),
          !isOwn ? fetch("/api/sns/mentors?tab=mentors") : Promise.resolve(null),
        ]);

        // プロフィール取得（新APIで自分も他人も統一）
        const pData = await profileRes.json();
        setProfile(pData.profile);
        setIsFollowing(pData.is_following || false);
        setFollowerCount(pData.follower_count || 0);
        setFollowingCount(pData.following_count || 0);

        // 投稿取得
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
        const count = (postsData.posts || []).length;
        setPostCount(count);
        const reactions = (postsData.posts || []).reduce((sum: number, p: any) => sum + (p.reactions?.total || 0), 0);
        setTotalReactions(reactions);
        setPostsHasMore(count >= 10);

        // メンター接続状態取得 (他ユーザーのみ)
        if (!isOwn && mentorsRes) {
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

  const loadMorePosts = async () => {
    if (postsLoadingMore || !postsHasMore || posts.length === 0) return;
    setPostsLoadingMore(true);
    try {
      const lastPost = posts[posts.length - 1];
      const res = await fetch(`/api/sns/posts?user_id=${userId}&limit=10&cursor=${encodeURIComponent(lastPost.created_at)}`);
      const data = await res.json();
      const newPosts = data.posts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setPostsHasMore(newPosts.length >= 10);
    } catch {
      // silently fail
    } finally {
      setPostsLoadingMore(false);
    }
  };

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
          {/* アバター */}
          <div className="shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.nickname}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-700">
                {initial}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-stone-900 truncate">{profile.nickname}</h2>
              {!isOwn && (
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <FollowButton
                    userId={userId}
                    isFollowing={isFollowing}
                    onToggle={(nowFollowing) => {
                      setIsFollowing(nowFollowing);
                      setFollowerCount((c) => nowFollowing ? c + 1 : Math.max(0, c - 1));
                    }}
                  />
                  {profile.is_mentor && (
                    <MentorRequestButton
                      mentorUserId={userId}
                      initialStatus={mentorStatus}
                    />
                  )}
                </div>
              )}
              {/* 自分のプロフィール操作ボタン */}
              {isOwn && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="#profile-edit"
                    className="flex items-center gap-1 px-3 py-1.5 border border-stone-200 text-stone-500 hover:text-teal-600 hover:border-teal-200 rounded-xl text-xs transition-colors"
                  >
                    <Pencil size={12} />
                    編集
                  </a>
                  <button
                    onClick={handleShareProfile}
                    className="flex items-center gap-1 px-3 py-1.5 border border-stone-200 text-stone-500 hover:text-teal-600 hover:border-teal-200 rounded-xl text-xs transition-colors"
                  >
                    <Share2 size={13} />
                    シェア
                  </button>
                </div>
              )}
            </div>

            {/* フォロワー・フォロー数（クリックでモーダル） */}
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <button
                onClick={() => setFollowModal("followers")}
                className="text-xs text-stone-500 hover:text-teal-600 transition-colors"
              >
                <span className="font-semibold text-stone-800">{followerCount}</span>
                <span className="ml-1">フォロワー</span>
              </button>
              <button
                onClick={() => setFollowModal("following")}
                className="text-xs text-stone-500 hover:text-teal-600 transition-colors"
              >
                <span className="font-semibold text-stone-800">{followingCount}</span>
                <span className="ml-1">フォロー中</span>
              </button>
              <button className="text-xs text-stone-500">
                <span className="font-semibold text-stone-800">{postsHasMore ? `${postCount}+` : postCount}</span>
                <span className="ml-1">投稿</span>
              </button>
              {totalReactions > 0 && (
                <span className="text-xs text-stone-500">
                  <span className="font-semibold text-stone-800">{totalReactions}</span>
                  <span className="ml-1">❤️もらった</span>
                </span>
              )}
            </div>

            <p className="text-xs text-stone-400 mt-1.5">
              {PHASE_LABELS[profile.update_phase]}
              {profile.seeking && ` · ${SEEKING_LABELS[profile.seeking]}`}
            </p>
            {profile.bio && (
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">{profile.bio}</p>
            )}

            {/* 挑戦タグ */}
            {profile.challenge_tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.challenge_tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/sns/search?tab=search&tag=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs hover:bg-teal-100 transition-colors"
                  >
                    #{tag}
                  </a>
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

      {/* プロフィールタブ */}
      <div className="flex gap-1 bg-white rounded-xl border border-stone-200 p-1">
        {(["posts", "badges", "calendar"] as const).map((tab) => {
          const labels = { posts: "投稿", badges: "バッジ", calendar: "カレンダー" };
          const icons = { posts: "📝", badges: "🏅", calendar: "📅" };
          return (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                profileTab === tab ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              <span>{icons[tab]}</span>
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* 更新カレンダー */}
      {profileTab === "calendar" && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <UpdateCalendar userId={userId} />
        </div>
      )}

      {/* バッジ一覧 */}
      {profileTab === "badges" && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <BadgeGrid userId={isOwn ? undefined : userId} />
        </div>
      )}

      {/* 最近の投稿 */}
      {profileTab === "posts" && posts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-stone-700">最近の更新</h3>
                {isOwn && postCount === 1 && posts.length === 1 && (
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-4 text-white text-center space-y-1.5">
                    <p className="text-2xl">🎉</p>
                    <p className="text-sm font-bold">最初の投稿！おめでとうございます</p>
                    <p className="text-xs opacity-80">これが習慣化への第一歩です。毎日続けてみましょう</p>
                  </div>
                )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
          {postsHasMore && (
            <button
              onClick={loadMorePosts}
              disabled={postsLoadingMore}
              className="w-full py-2.5 text-sm text-teal-600 hover:text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {postsLoadingMore ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  読み込み中...
                </>
              ) : (
                "もっと見る"
              )}
            </button>
          )}
        </div>
      )}
      {profileTab === "posts" && posts.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-2">
          <p className="text-2xl">📝</p>
          <p className="text-stone-400 text-sm">まだ投稿がありません</p>
        </div>
      )}

      {/* フォロワー/フォロー中モーダル */}
      {followModal && (
        <FollowListModal
          userId={userId}
          currentUserId={currentUserId}
          type={followModal}
          onClose={() => setFollowModal(null)}
        />
      )}
    </div>
  );
}
