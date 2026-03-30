"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Loader2, LogOut, Trash2 } from "lucide-react";
import CirclePostComposer from "./CirclePostComposer";

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

interface Circle {
  id: string;
  name: string;
  theme_tag: string;
  description?: string;
  max_members: number;
  member_count: number;
  is_full: boolean;
  created_by: string;
}

interface Member {
  user_id: string;
  role: string;
  joined_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public_profiles: any;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public_profiles: any;
}

export default function CircleDetailView({
  circleId,
  currentUserId,
}: {
  circleId: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadCircle = useCallback(async () => {
    const res = await fetch(`/api/sns/circles/${circleId}`);
    if (!res.ok) { router.push("/sns/circles"); return; }
    const data = await res.json();
    setCircle(data.circle);
    setMembers(data.members || []);
    setMyRole(data.my_role);
    setIsMember(data.is_member);
    setLoading(false);
  }, [circleId, router]);

  const loadPosts = useCallback(async (cursor?: string) => {
    setPostsLoading(true);
    try {
      const params = cursor ? `?cursor=${cursor}` : "";
      const res = await fetch(`/api/sns/circles/${circleId}/posts${params}`);
      const data = await res.json();
      setPosts((prev) => cursor ? [...prev, ...(data.posts || [])] : (data.posts || []));
      setNextCursor(data.nextCursor);
    } finally {
      setPostsLoading(false);
    }
  }, [circleId]);

  useEffect(() => {
    loadCircle();
  }, [loadCircle]);

  useEffect(() => {
    if (isMember) loadPosts();
  }, [isMember, loadPosts]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!nextCursor || postsLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPosts(nextCursor);
      },
      { threshold: 0.5 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [nextCursor, postsLoading, loadPosts]);

  async function handleJoin() {
    setJoining(true);
    try {
      const res = await fetch(`/api/sns/circles/${circleId}/join`, { method: "POST" });
      if (res.ok) {
        await loadCircle();
        loadPosts();
      }
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    if (!confirm("サークルを退出しますか？")) return;
    await fetch(`/api/sns/circles/${circleId}/join`, { method: "DELETE" });
    router.push("/sns/circles");
  }

  async function handleDelete() {
    if (!confirm("このサークルを削除しますか？この操作は取り消せません。")) return;
    await fetch(`/api/sns/circles/${circleId}`, { method: "DELETE" });
    router.push("/sns/circles");
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-stone-300" />
      </div>
    );
  }

  if (!circle) return null;

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <div className="shrink-0 bg-white border-b border-stone-100 px-4 pt-safe pt-4 pb-3">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push("/sns/circles")}>
            <ArrowLeft size={20} className="text-stone-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-stone-900 truncate">{circle.name}</h1>
            <span className="text-xs text-teal-600">#{circle.theme_tag}</span>
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Users size={14} />
            {circle.member_count}/{circle.max_members}人
          </button>
        </div>

        {circle.description && (
          <p className="text-xs text-stone-400 ml-8">{circle.description}</p>
        )}
      </div>

      {/* メンバー一覧（折りたたみ） */}
      {showMembers && (
        <div className="shrink-0 bg-stone-50 border-b border-stone-100 px-4 py-3">
          <div className="flex gap-3 overflow-x-auto">
            {members.map((m) => (
              <div key={m.user_id} className="flex flex-col items-center gap-1 shrink-0">
                {m.public_profiles?.avatar_url ? (
                  <Image
                    src={m.public_profiles.avatar_url}
                    alt={m.public_profiles.nickname}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {m.public_profiles?.nickname?.[0] || "?"}
                  </div>
                )}
                <span className="text-xs text-stone-500 max-w-[60px] truncate">
                  {m.public_profiles?.nickname || "？"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 投稿一覧 or 非メンバー向けCTA */}
      {isMember ? (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {posts.length === 0 && !postsLoading && (
              <div className="text-center py-10">
                <p className="text-stone-400 text-sm">まだ投稿がありません。最初に投稿しましょう！</p>
              </div>
            )}
            {posts.map((post) => (
              <CirclePostCard
                key={post.id}
                post={post}
                isOwn={post.user_id === currentUserId}
                onDelete={async () => {
                  await fetch(
                    `/api/sns/circles/${circleId}/posts?post_id=${post.id}`,
                    { method: "DELETE" }
                  );
                  setPosts((prev) => prev.filter((p) => p.id !== post.id));
                }}
              />
            ))}
            {postsLoading && (
              <div className="flex justify-center py-4">
                <Loader2 size={18} className="animate-spin text-stone-300" />
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>

          {/* 投稿フォーム */}
          <div className="shrink-0">
            <CirclePostComposer
              circleId={circleId}
              onPosted={() => loadPosts()}
            />
          </div>

          {/* 退出/削除ボタン */}
          <div className="shrink-0 px-4 pb-4 flex gap-2 bg-white border-t border-stone-50 pt-2">
            {myRole === "owner" ? (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200 ml-auto"
              >
                <Trash2 size={13} />
                サークルを削除
              </button>
            ) : (
              <button
                onClick={handleLeave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200 ml-auto"
              >
                <LogOut size={13} />
                退出する
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          <p className="text-stone-500 text-sm text-center">
            このサークルに参加すると投稿を閲覧・参加できます
          </p>
          <button
            onClick={handleJoin}
            disabled={joining || circle.is_full}
            className="px-8 py-3 bg-teal-600 disabled:bg-stone-200 text-white rounded-xl font-medium text-sm"
          >
            {joining ? "参加中..." : circle.is_full ? "満員です" : "サークルに参加する"}
          </button>
        </div>
      )}
    </div>
  );
}

function CirclePostCard({
  post,
  isOwn,
  onDelete,
}: {
  post: Post;
  isOwn: boolean;
  onDelete: () => void;
}) {
  const relTime = timeAgo(post.created_at);

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* アバター */}
      {post.public_profiles?.avatar_url ? (
        <Image
          src={post.public_profiles.avatar_url}
          alt={post.public_profiles.nickname}
          width={32}
          height={32}
          className="rounded-full object-cover shrink-0 self-end"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0 self-end">
          {post.public_profiles?.nickname?.[0] || "?"}
        </div>
      )}

      {/* バブル */}
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        {!isOwn && (
          <span className="text-xs text-stone-400 ml-1">
            {post.public_profiles?.nickname}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-teal-500 text-white rounded-br-sm"
              : "bg-stone-100 text-stone-800 rounded-bl-sm"
          }`}
        >
          {post.content}
        </div>
        <div className={`flex items-center gap-2 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
          <span className="text-xs text-stone-300">{relTime}</span>
          {isOwn && (
            <button onClick={onDelete} className="text-xs text-stone-300 hover:text-red-400">
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
