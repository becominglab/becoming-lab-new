"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";
import SkeletonCard from "./SkeletonCard";
import { Loader2, Bookmark } from "lucide-react";

interface Props {
  currentUserId: string;
}

export default function BookmarksList({ currentUserId }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchBookmarks = useCallback(async (cursorParam?: string | null) => {
    const isInitial = !cursorParam;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams();
      if (cursorParam) params.set("cursor", cursorParam);

      const res = await fetch(`/api/sns/bookmarks?${params}`);
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
    fetchBookmarks();
  }, [fetchBookmarks]);

  // 無限スクロール
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && cursor) {
          fetchBookmarks(cursor);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, fetchBookmarks]);

  const handleDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <Bookmark size={32} className="mx-auto text-stone-300" />
        <p className="text-stone-500 text-sm font-medium">ブックマークがありません</p>
        <p className="text-stone-400 text-xs">投稿右上のブックマークアイコンで保存できます</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{ ...post, is_bookmarked: true }}
          currentUserId={currentUserId}
          onDeleted={handleDeleted}
        />
      ))}

      {/* 無限スクロールトリガー */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {loadingMore && <Loader2 size={18} className="animate-spin text-stone-400" />}
      </div>
    </div>
  );
}
