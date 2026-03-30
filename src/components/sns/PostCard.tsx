"use client";

import Link from "next/link";
import ReactionBar from "./ReactionBar";
import { Flame, MessageSquare, Trophy, FileText } from "lucide-react";

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
}

const SCORE_LABELS: Record<number, string> = { 1: "\u25CB", 2: "\u25CE", 3: "\u25C9" };

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
          <p className="text-sm text-stone-800">{content.did}</p>
        </div>
      )}
      {content.learned && (
        <div>
          <p className="text-[10px] font-medium text-teal-600 mb-0.5">気づき</p>
          <p className="text-sm text-stone-800">{content.learned}</p>
        </div>
      )}
      {content.tomorrow && (
        <div>
          <p className="text-[10px] font-medium text-teal-600 mb-0.5">明日やること</p>
          <p className="text-sm text-stone-800">{content.tomorrow}</p>
        </div>
      )}
    </div>
  );
}

function AutoLogContent({ content }: { content: PostContent }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="text-stone-500">食事</span>
        <span className="font-medium">{SCORE_LABELS[content.meal_score || 1]}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-stone-500">運動</span>
        <span className="font-medium">{SCORE_LABELS[content.workout_score || 1]}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-stone-500">気分</span>
        <span className="font-medium">{SCORE_LABELS[content.mood || 1]}</span>
      </div>
      {(content.streak || 0) > 0 && (
        <div className="flex items-center gap-1 text-orange-600">
          <Flame size={14} />
          <span className="font-medium">{content.streak}日連続</span>
        </div>
      )}
    </div>
  );
}

export default function PostCard({ post, currentUserId }: Props) {
  const { public_profiles: profile } = post;
  const isOwn = post.user_id === currentUserId;
  const initial = profile.nickname?.[0] || "?";

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <Link
          href={isOwn ? "/sns/profile" : `/sns/profile/${post.user_id}`}
          className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 shrink-0"
        >
          {initial}
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
      </div>

      {/* コンテンツ */}
      <div>
        {post.post_type === "update" && <UpdateContent content={post.content} />}
        {post.post_type === "auto_log" && <AutoLogContent content={post.content} />}
        {post.post_type === "declaration" && (
          <p className="text-sm text-stone-800 border-l-2 border-blue-400 pl-3 italic">
            {post.content.content}
          </p>
        )}
        {post.post_type === "milestone" && (
          <div className="flex items-center gap-2 text-sm">
            <Trophy size={18} className="text-amber-500" />
            <span className="font-medium text-stone-800">{post.content.label}</span>
          </div>
        )}
      </div>

      {/* リアクション */}
      <ReactionBar
        postId={post.id}
        myReactions={post.reactions.myReactions}
        types={post.reactions.types}
        counts={post.reactions.counts}
        isOwn={isOwn}
      />
    </div>
  );
}
