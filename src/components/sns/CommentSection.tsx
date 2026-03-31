"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, X, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_own: boolean;
  public_profiles: {
    nickname: string;
    avatar_url: string | null;
  };
}

interface Props {
  postId: string;
  onClose: () => void;
  /** インライン表示モード（投稿詳細ページ用） */
  inline?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function CommentContent({
  comments,
  loading,
  text,
  posting,
  onTextChange,
  onSubmit,
  onDelete,
  onKeyDown,
  inputRef,
  commentsHasMore,
  onLoadMore,
}: {
  comments: Comment[];
  loading: boolean;
  text: string;
  posting: boolean;
  onTextChange: (v: string) => void;
  onSubmit: () => void;
  onDelete: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  commentsHasMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <>
      {/* コメント一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="h-3 bg-stone-200 rounded w-16" />
                  <div className="h-3 bg-stone-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-400 text-sm">まだコメントはありません</p>
            <p className="text-stone-300 text-xs mt-1">最初のコメントを書きましょう</p>
          </div>
        ) : (
          comments.map((comment) => {
            const initial = comment.public_profiles.nickname?.[0] || "?";
            return (
              <div key={comment.id} className="flex gap-3">
                {comment.public_profiles.avatar_url ? (
                  <Image
                    src={comment.public_profiles.avatar_url}
                    alt={comment.public_profiles.nickname}
                    width={32}
                    height={32}
                    className="rounded-full object-cover shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0 mt-0.5">
                    {initial}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="bg-stone-50 rounded-2xl rounded-tl-sm px-3 py-2">
                    <p className="text-xs font-semibold text-stone-700 mb-0.5">
                      {comment.public_profiles.nickname}
                    </p>
                    <p className="text-sm text-stone-800 leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <span className="text-[10px] text-stone-400">{timeAgo(comment.created_at)}</span>
                    {comment.is_own && (
                      <button
                        onClick={() => onDelete(comment.id)}
                        className="text-[10px] text-stone-300 hover:text-red-400 transition-colors flex items-center gap-0.5"
                      >
                        <Trash2 size={10} />
                        削除
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {commentsHasMore && (
          <button
            onClick={onLoadMore}
            className="w-full text-xs text-stone-400 hover:text-teal-600 py-2 transition-colors"
          >
            もっと見る
          </button>
        )}
      </div>

      {/* 入力エリア */}
      <div className="shrink-0 px-4 py-3 border-t border-stone-200">
        <div className="flex gap-2 items-end">
          <div className="flex-1 flex flex-col">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="コメントを入力... (Enterで送信)"
              maxLength={200}
              rows={1}
              className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[40px] max-h-[100px]"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <p className={`text-[10px] text-right mt-0.5 ${text.length > 180 ? "text-orange-500" : "text-stone-400"}`}>
              {text.length}/200
            </p>
          </div>
          <button
            onClick={onSubmit}
            disabled={!text.trim() || posting}
            className="w-10 h-10 bg-teal-600 disabled:bg-stone-200 text-white rounded-xl flex items-center justify-center transition-colors hover:bg-teal-700 shrink-0"
          >
            {posting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default function CommentSection({ postId, onClose, inline }: Props) {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [commentsHasMore, setCommentsHasMore] = useState(false);
  const [commentsPage, setCommentsPage] = useState(0);
  const COMMENTS_LIMIT = 10;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/sns/posts/${postId}/comments?limit=${COMMENTS_LIMIT}&offset=0`);
        if (!res.ok) {
          showToast("コメントの読み込みに失敗しました", "error");
          return;
        }
        const data = await res.json();
        setComments(data.comments || []);
        setCommentsHasMore((data.comments || []).length === COMMENTS_LIMIT);
      } catch {
        showToast("コメントの読み込みに失敗しました", "error");
      } finally {
        setLoading(false);
        if (!inline) setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const loadMoreComments = async () => {
    const nextPage = commentsPage + 1;
    try {
      const res = await fetch(`/api/sns/posts/${postId}/comments?limit=${COMMENTS_LIMIT}&offset=${nextPage * COMMENTS_LIMIT}`);
      const data = await res.json();
      const newComments = data.comments || [];
      setComments((prev) => [...prev, ...newComments]);
      setCommentsPage(nextPage);
      setCommentsHasMore(newComments.length === COMMENTS_LIMIT);
    } catch { /* silently fail */ }
  };

  const handleSubmit = async () => {
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/sns/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setText("");
      } else {
        showToast(data.error || "コメントの投稿に失敗しました", "error");
      }
    } catch {
      showToast("コメントの投稿に失敗しました", "error");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(
        `/api/sns/posts/${postId}/comments?comment_id=${commentId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        showToast("コメントを削除しました", "success");
      } else {
        showToast("削除に失敗しました", "error");
      }
    } catch {
      showToast("削除に失敗しました", "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // インラインモード（投稿詳細ページ）
  if (inline) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-200">
          <h3 className="font-semibold text-stone-800 text-sm">
            コメント {comments.length > 0 && <span className="text-stone-400">({comments.length})</span>}
          </h3>
        </div>
        <div className="flex flex-col" style={{ maxHeight: "60vh" }}>
          <CommentContent
            comments={comments}
            loading={loading}
            text={text}
            posting={posting}
            onTextChange={setText}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            commentsHasMore={commentsHasMore}
            onLoadMore={loadMoreComments}
          />
        </div>
      </div>
    );
  }

  // モーダルモード（フィード画面）
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0">
          <h3 className="font-semibold text-stone-800 text-sm">
            コメント {comments.length > 0 && <span className="text-stone-400">({comments.length})</span>}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-stone-400" />
          </button>
        </div>

        <CommentContent
          comments={comments}
          loading={loading}
          text={text}
          posting={posting}
          onTextChange={setText}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          commentsHasMore={commentsHasMore}
          onLoadMore={loadMoreComments}
        />
      </div>
    </div>
  );
}
