"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";
import CommentSection from "./CommentSection";
import SkeletonCard from "./SkeletonCard";
import { Loader2, Hash, X, TrendingUp, Clock } from "lucide-react";

interface Props {
  currentUserId: string;
  initialTag?: string;
}

type DiscoverMode = "latest" | "trending";

export default function DiscoverFeed({ currentUserId, initialTag }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null);
  const [mode, setMode] = useState<DiscoverMode>("latest");
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (cursorParam?: string | null, tag?: string | null, currentMode?: DiscoverMode) => {
    const isInitial = !cursorParam;
    const feedMode = currentMode || "latest";
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({ limit: "20", feed: feedMode === "trending" ? "trending" : "discover" });
      if (cursorParam && feedMode !== "trending") params.set("cursor", cursorParam);
      if (tag && feedMode !== "trending") params.set("tag", tag);

      const res = await fetch(`/api/sns/posts?${params}`);
      const data = await res.json();

      if (isInitial) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor && feedMode !== "trending");
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/sns/trending-tags")
      .then((r) => r.json())
      .then((d) => {
        const tags = (d.tags || []).map((t: { tag: string }) => t.tag);
        setPopularTags(tags.length > 0 ? tags : ["運動", "英語", "読書", "睡眠改善", "ダイエット", "早起き", "瞑想", "料理"]);
      })
      .catch(() => setPopularTags(["運動", "英語", "読書", "睡眠改善", "ダイエット", "早起き", "瞑想", "料理"]));
  }, []);

  useEffect(() => {
    fetchPosts(null, selectedTag, mode);
  }, [fetchPosts, selectedTag, mode]);

  // 無限スクロール
  useEffect(() => {
    if (!observerRef.current || !hasMore || mode === "trending") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && cursor) {
          fetchPosts(cursor, selectedTag, mode);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, fetchPosts, selectedTag, mode]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setCursor(null);
    setHasMore(true);
  };

  const handleModeChange = (newMode: DiscoverMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setCursor(null);
    setHasMore(true);
    setSelectedTag(null);
  };

  const handleDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleCommentClose = () => {
    setCommentPostId(null);
  };

  return (
    <div className="space-y-4">
      {/* 最新 / トレンド 切り替え */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeChange("latest")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            mode === "latest" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <Clock size={12} />
          最新
        </button>
        <button
          onClick={() => handleModeChange("trending")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            mode === "trending" ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <TrendingUp size={12} />
          人気（週間）
        </button>
      </div>

      {/* タグフィルター（最新モードのみ） */}
      {mode === "latest" && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleTagSelect(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedTag ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            すべて
          </button>
          {popularTags.map((tag) => (
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
      )}

      {/* 選択中カスタムタグ */}
      {mode === "latest" && selectedTag && !popularTags.includes(selectedTag) && (
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

      {/* トレンドの説明 */}
      {mode === "trending" && (
        <p className="text-xs text-stone-400 bg-amber-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <TrendingUp size={12} className="text-amber-500 shrink-0" />
          過去7日間で最もリアクションを受けた投稿
        </p>
      )}

      {/* 投稿リスト */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-2xl">{mode === "trending" ? "🔥" : "🔍"}</p>
          <p className="text-stone-500 text-sm font-medium">
            {mode === "trending"
              ? "今週の人気投稿はまだありません"
              : selectedTag ? `#${selectedTag} の投稿はまだありません` : "まだ投稿がありません"}
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

      {/* コメントセクション */}
      {commentPostId && (
        <CommentSection postId={commentPostId} onClose={handleCommentClose} />
      )}
    </div>
  );
}
