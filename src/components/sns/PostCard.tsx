"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactionBar from "./ReactionBar";
import { Flame, MessageSquare, Trophy, FileText, Trash2, MoreHorizontal } from "lucide-react";

interface PostContent {
  did?: string;
  learned?: string;
  tomorrow?: string;
  date?: string;
  meal_score?: number;
  workout_score?: number;
  mood?: number;
  streak?: number;
  content?: string;
  type?: string;
  label?: string;
  value?: number;
}

interface Post {
  id: string;
  user_id: string;
  post_type: string;
  content: PostContent;
  created_at: string;
  comment_count?: number;
  public_profiles: {
    nickname: string;
    avatar_url: string | null;
  };
  reactions: {
    counts?: Record<string, number>;
    types: string[];
    myReactions: string[];
  };
}

interface Props {
  post: Post;
  currentUserId: string;
  onDeleted?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
}

const SCORE_LABELS: Record<number, string> = { 1: "○", 2: "◎", 3: "◉" };

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

function postTypeBorder(type: string): string {
  switch (type) {
    case "auto_log": return "border-l-orange-400";
    case "declaration": return "border-l-blue-400";
    case "milestone": return "border-l-amber-400";
    default: return "border-l-teal-400";
  }
}

function PostTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "auto_log": return <Flame size={12} className="text-orange-500" />;
    case "declaration": return <MessageSquare size={12} className="text-blue-500" />;
    case "milestone": return <Trophy size={12} className="text-amber-500" />;
    default: return <FileText size={12} className="text-teal-500" />;
  }
}

function PostTypeLabel({ type }: { type: string }) {
  switch (type) {
    case "auto_log": return "Body記録";
    case "declaration": return "宣言";
    case "milestone": return "マイルストーン";
    default: return "更新";
  }
}

function UpdateContent({ content }: { content: PostContent }) {
  return (
    <div className="space-y-2">
      {content.did && (
        <div>
          <p className="text-[10px] font-medium text-teal-600 mb-0.5">やったこと</p>
          <p className="text-sm text-stone-800 leading-relaxed">{content.did}</p>
        </div>
      )}
      {content.learned && (
        <div>
          <p className="text-[10px] font-medium text-teal-600 mb-0.5">気づき</p>
          <p className="text-sm text-stone-600 leading-relaxed">{content.learned}</p>
        </div>
      )}
      {content.tomorrow && (
        <div>
          <p className="text-[10px] font-medium text-stone-400 mb-0.5">明日やること</p>
          <p className="text-sm text-stone-500 leading-relaxed">{content.tomorrow}</p>
        </div>
      )}
    </div>
  );
}

function AutoLogContent({ content }: { content: PostContent }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="text-stone-500 text-xs">食事</span>
        <span className="font-medium text-stone-700">{SCORE_LABELS[content.meal_score || 1]}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-stone-500 text-xs">運動</span>
        <span className="font-medium text-stone-700">{SCORE_LABELS[content.workout_score || 1]}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-stone-500 text-xs">気分</span>
        <span className="font-medium text-stone-700">{SCORE_LABELS[content.mood || 1]}</span>
      </div>
      {(content.streak || 0) > 0 && (
        <div className="flex items-center gap-1 text-orange-600 ml-auto">
          <Flame size={13} />
          <span className="font-medium text-sm">{content.streak}日連続</span>
        </div>
      )}
    </div>
  );
}

export default function PostCard({ post, currentUserId, onDeleted, onCommentClick }: Props) {
  const { public_profiles: profile } = post;
  const isOwn = post.user_id === currentUserId;
  const initial = profile.nickname?.[0] || "?";
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("この投稿を削除しますか？")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sns/posts?id=${post.id}`, { method: "DELETE" });
      if (res.ok) onDeleted?.(post.id);
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-stone-200 border-l-4 ${postTypeBorder(post.post_type)} p-4 space-y-3 relative`}>
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <Link
          href={isOwn ? "/sns/profile" : `/sns/profile/${post.user_id}`}
          className="shrink-0"
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.nickname}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
              {initial}
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={isOwn ? "/sns/profile" : `/sns/profile/${post.user_id}`}
            className="text-sm font-medium text-stone-800 hover:underline truncate block"
          >
            {profile.nickname}
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
            <PostTypeIcon type={post.post_type} />
            <span><PostTypeLabel type={post.post_type} /></span>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
        </div>

        {/* メニューボタン（自分の投稿のみ） */}
        {isOwn && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-400"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-stone-200 rounded-lg shadow-lg min-w-[120px] overflow-hidden">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    {deleting ? "削除中..." : "削除する"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div>
        {post.post_type === "update" && <UpdateContent content={post.content} />}
        {post.post_type === "auto_log" && <AutoLogContent content={post.content} />}
        {post.post_type === "declaration" && (
          <p className="text-sm text-stone-800 border-l-2 border-blue-300 pl-3 italic leading-relaxed">
            {post.content.content}
          </p>
        )}
        {post.post_type === "milestone" && (
          <div className="flex items-center gap-2 text-sm bg-amber-50 rounded-lg px-3 py-2">
            <Trophy size={18} className="text-amber-500 shrink-0" />
            <span className="font-medium text-stone-800">{post.content.label}</span>
          </div>
        )}
      </div>

      {/* フッター: リアクション + コメント */}
      <div className="flex items-center justify-between">
        <ReactionBar
          postId={post.id}
          myReactions={post.reactions.myReactions}
          types={post.reactions.types}
          counts={post.reactions.counts}
          isOwn={isOwn}
        />
        <button
          onClick={() => onCommentClick?.(post.id)}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors ml-2"
        >
          <MessageSquare size={13} />
          {post.comment_count ? (
            <span>{post.comment_count}</span>
          ) : (
            <span className="hidden sm:inline">コメント</span>
          )}
        </button>
      </div>
    </div>
  );
}
