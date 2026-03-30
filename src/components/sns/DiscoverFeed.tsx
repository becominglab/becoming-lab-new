"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";
import SkeletonCard from "./SkeletonCard";
import { Loader2, Hash, X } from "lucide-react";

interface Props {
  currentUserId: string;
  initialTag?: string;
}

const POPULAR_TAGS = ["運動", "英語", "読書", "睡眠改善", "ダイエット", "早起き", "瞑想", "料理"];

export default function DiscoverFeed({ currentUserId, initialTag }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (cursorParam?: string | null, tag?: string | null) => {
    const isInitial = !cursorParam;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({ limit: "20", feed: "discover" });
      if (cursorParam) params.set("cursor", cursorParam);
      if (tag) params.set("tag", tag);

      const res = await fetch(`/api/sns/posts?${params}`);
      const data = await res.json();

      if (isInitial) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(null, selectedTag);
  }, [fetchPosts, selectedTag]);

  // 無限スクロール
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && cursor) {
          fetchPosts(cursor, selectedTag);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, fetchPosts, selectedTag]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setCursor(null);
    setHasMore(true);
  };

  const handleDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="space-y-4">
      {/* タグフィルター */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => handleTagSelect(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !selectedTag ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          すべて
        </button>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagSelect(selectedTag === tag ? null : tag)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedTag === tag ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Hash size={10} />
            {tag}
          </button>
        ))}
      </div>

      {/* 選択中タグ表示 */}
      {selectedTag && !POPULAR_TAGS.includes(selectedTag) && (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
            <Hash size={10} />
            {selectedTag}
            <button onClick={() => handleTagSelect(null)} className="ml-1">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* 投稿リスト */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-2xl">🔍</p>
          <p className="text-stone-500 text-sm font-medium">
            {selectedTag ? `#${selectedTag} の投稿はまだありません` : "まだ投稿がありません"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onDeleted={handleDeleted}
              onCommentClick={(id) => setCommentPostId(id)}
            />
          ))}
        </div>
      )}

      {/* 無限スクロールトリガー */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {loadingMore && <Loader2 size={18} className="animate-spin text-stone-400" />}
      </div>

      {/* コメントセクション（将来対応用にプレースホルダー） */}
      {commentPostId && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end" onClick={() => setCommentPostId(null)}>
          <div className="bg-white w-full rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-sm text-stone-500 py-4">コメント機能は準備中です</p>
          </div>
        </div>
      )}
    </div>
  );
}
