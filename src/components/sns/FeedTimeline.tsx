"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";
import CommentSection from "./CommentSection";
import DailyCheckin from "./DailyCheckin";
import OnboardingGuide from "./OnboardingGuide";
import RecommendedUsers from "./RecommendedUsers";
import SkeletonCard from "./SkeletonCard";
import WeeklySummaryCard from "./WeeklySummaryCard";
import { Loader2, RefreshCw } from "lucide-react";

interface Props {
  currentUserId: string;
}

export default function FeedTimeline({ currentUserId }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [composerPrompt, setComposerPrompt] = useState<string | undefined>();
  const observerRef = useRef<HTMLDivElement>(null);
  // pull-to-refresh
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const [pullDistance, setPullDistance] = useState(0);

  const fetchPosts = useCallback(async (cursorParam?: string | null) => {
    const isInitial = !cursorParam;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({ limit: "20" });
      if (cursorParam) params.set("cursor", cursorParam);

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
    fetchPosts();
  }, [fetchPosts]);

  // 無限スクロール
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && cursor) {
          fetchPosts(cursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, fetchPosts]);

  // Pull-to-refresh
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 0) return;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (dy > 0) setPullDistance(Math.min(dy * 0.4, 70));
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= 60 && !refreshing) {
        setRefreshing(true);
        setPullDistance(0);
        await fetchPosts();
        setRefreshing(false);
      } else {
        setPullDistance(0);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, refreshing, fetchPosts]);

  const handlePosted = () => {
    setComposerPrompt(undefined);
    fetchPosts();
  };

  const handleDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleUpdated = (updated: any) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
  };

  const handleCommentClose = () => {
    setCommentPostId(null);
    fetchPosts();
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Pull-to-refresh インジケーター */}
      {(pullDistance > 0 || refreshing) && (
        <div
          className="flex items-center justify-center transition-all duration-200"
          style={{ height: refreshing ? 40 : pullDistance }}
        >
          <RefreshCw
            size={18}
            className={`text-teal-500 transition-transform ${refreshing ? "animate-spin" : ""}`}
            style={{ transform: `rotate(${pullDistance * 3}deg)` }}
          />
        </div>
      )}

      {/* はじめてガイド（初回ユーザー向け） */}
      <OnboardingGuide />

      {/* 週次サマリーカード（月曜日のみ） */}
      <WeeklySummaryCard />

      {/* デイリーチェックイン */}
      <DailyCheckin
        onCheckinAndPost={(prompt) => setComposerPrompt(prompt)}
      />

      {/* 投稿フォーム（チェックイン時にプロンプトを渡す） */}
      <PostComposer onPosted={handlePosted} initialPrompt={composerPrompt} />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-3xl">🌱</p>
          <p className="text-stone-500 text-sm font-medium">まだ投稿がありません</p>
          <p className="text-stone-400 text-xs">仲間をフォローするとここに投稿が流れてきます</p>
          {/* フィードが空のときはおすすめを優先表示 */}
          <div className="mt-4 text-left">
            <RecommendedUsers />
          </div>
        </div>
      ) : (
        <>
          {posts.map((post, i) => (
            <div key={post.id}>
              <PostCard
                post={post}
                currentUserId={currentUserId}
                onDeleted={handleDeleted}
                onUpdated={handleUpdated}
                onCommentClick={(id) => setCommentPostId(id)}
              />
              {/* 5投稿目の後におすすめユーザーを差し込む */}
              {i === 4 && <div className="mt-4"><RecommendedUsers /></div>}
            </div>
          ))}
        </>
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
