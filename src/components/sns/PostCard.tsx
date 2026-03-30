"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactionBar from "./ReactionBar";
import BookmarkButton from "./BookmarkButton";
import { Flame, MessageSquare, Trophy, FileText, Trash2, MoreHorizontal, Pencil, Hash } from "lucide-react";

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
  tags?: string[];
  created_at: string;
  comment_count?: number;
  is_bookmarked?: boolean;
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
  onUpdated?: (post: Post) => void;
}

const SCORE_LABELS: Record<number, string> = { 1: "○", 2: "◎", 3: "◉" };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
void SCORE_LABELS;

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

const SCORE_COLORS: Record<number, string> = {
  1: "bg-stone-100 text-stone-500",
  2: "bg-teal-100 text-teal-700",
  3: "bg-teal-500 text-white",
};
const SCORE_EMOJI: Record<number, string> = { 1: "△", 2: "○", 3: "◎" };

function ScoreBadge({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-stone-400">{label}</span>
      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${SCORE_COLORS[score] || SCORE_COLORS[1]}`}>
        {SCORE_EMOJI[score] || "△"}
      </span>
    </div>
  );
}

function AutoLogContent({ content }: { content: PostContent }) {
  // 体重・数値ログ対応
  if (content.type && content.value !== undefined) {
    const unit = content.type === "weight" ? "kg" : content.type === "steps" ? "歩" : "";
    const label = content.type === "weight" ? "体重" : content.type === "steps" ? "歩数" : content.label || content.type;
    return (
      <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3">
        <div className="flex-1">
          <p className="text-[11px] text-orange-500 font-medium mb-0.5">{label}</p>
          <p className="text-2xl font-bold text-stone-800">
            {content.value.toLocaleString()}
            <span className="text-sm font-normal text-stone-400 ml-1">{unit}</span>
          </p>
        </div>
        {(content.streak || 0) > 0 && (
          <div className="flex flex-col items-center gap-0.5 bg-orange-100 rounded-xl px-3 py-2">
            <Flame size={16} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600">{content.streak}日</span>
            <span className="text-[10px] text-orange-400">連続</span>
          </div>
        )}
      </div>
    );
  }

  // 食事・運動・気分スコア
  return (
    <div className="bg-orange-50 rounded-xl px-4 py-3">
      <div className="flex items-center justify-around">
        <ScoreBadge label="食事" score={content.meal_score || 1} />
        <div className="w-px h-8 bg-orange-100" />
        <ScoreBadge label="運動" score={content.workout_score || 1} />
        <div className="w-px h-8 bg-orange-100" />
        <ScoreBadge label="気分" score={content.mood || 1} />
        {(content.streak || 0) > 0 && (
          <>
            <div className="w-px h-8 bg-orange-100" />
            <div className="flex flex-col items-center gap-0.5">
              <Flame size={16} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-600">{content.streak}日</span>
              <span className="text-[10px] text-orange-400">連続</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// インライン編集フォーム
function EditForm({ post, onSave, onCancel }: { post: Post; onSave: (updated: Post) => void; onCancel: () => void }) {
  const [did, setDid] = useState(post.content.did || "");
  const [learned, setLearned] = useState(post.content.learned || "");
  const [tomorrow, setTomorrow] = useState(post.content.tomorrow || "");
  const [tagInput, setTagInput] = useState((post.tags || []).join(" "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!did.trim()) { setError("「やったこと」を入力してください"); return; }
    setSaving(true);
    setError("");
    try {
      const tags = tagInput.split(/[\s,　]+/).map((t) => t.replace(/^#/, "").trim()).filter(Boolean).slice(0, 5);
      const res = await fetch("/api/sns/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          content: { did: did.trim(), learned: learned.trim() || null, tomorrow: tomorrow.trim() || null },
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "保存に失敗しました"); return; }
      onSave({ ...post, content: data.post.content, tags: data.post.tags });
    } catch {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="text-[10px] font-medium text-teal-600 mb-1">やったこと *</p>
        <textarea value={did} onChange={(e) => setDid(e.target.value)} maxLength={140} rows={2}
          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400" />
        <p className="text-[10px] text-stone-400 text-right">{did.length}/140</p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-teal-600 mb-1">気づき</p>
        <textarea value={learned} onChange={(e) => setLearned(e.target.value)} maxLength={140} rows={2}
          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>
      <div>
        <p className="text-[10px] font-medium text-stone-400 mb-1">明日やること</p>
        <textarea value={tomorrow} onChange={(e) => setTomorrow(e.target.value)} maxLength={140} rows={2}
          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>
      <div>
        <p className="text-[10px] font-medium text-stone-400 mb-1">タグ（スペース区切り、最大5個）</p>
        <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="運動 英語 読書"
          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors">
          {saving ? "保存中..." : "保存する"}
        </button>
        <button onClick={onCancel}
          className="flex-1 py-1.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-lg hover:bg-stone-200 transition-colors">
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default function PostCard({ post: initialPost, currentUserId, onDeleted, onCommentClick, onUpdated }: Props) {
  const [post, setPost] = useState(initialPost);
  const { public_profiles: profile } = post;
  const isOwn = post.user_id === currentUserId;
  const initial = profile.nickname?.[0] || "?";
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

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

  const handleSaved = (updated: Post) => {
    setPost(updated);
    setEditing(false);
    onUpdated?.(updated);
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

        {/* ブックマークボタン（全投稿） */}
        <BookmarkButton postId={post.id} isBookmarked={post.is_bookmarked || false} />

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
                  {post.post_type === "update" && (
                    <button
                      onClick={() => { setEditing(true); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      <Pencil size={14} />
                      編集する
                    </button>
                  )}
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

      {/* コンテンツ（編集中 or 表示） */}
      {editing && post.post_type === "update" ? (
        <EditForm post={post} onSave={handleSaved} onCancel={() => setEditing(false)} />
      ) : (
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
      )}

      {/* タグ */}
      {!editing && post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-0.5 text-[11px] px-2 py-0.5 bg-stone-50 text-stone-500 rounded-full border border-stone-200">
              <Hash size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* フッター: リアクション + コメント */}
      {!editing && (
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
      )}
    </div>
  );
}
