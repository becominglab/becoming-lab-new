"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";
import CommentSection from "./CommentSection";
import DailyCheckin from "./DailyCheckin";
import OnboardingGuide from "./OnboardingGuide";
import RecommendedUsers from "./RecommendedUsers";
import SkeletonCard from "./SkeletonCard";
import WeeklySummaryCard from "./WeeklySummaryCard";
import { Loader2, RefreshCw, TrendingUp, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function getDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "今日";
  if (d.toDateString() === yesterday.toDateString()) return "昨日";
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}

interface Props {
  currentUserId: string;
}

export default function FeedTimeline({ currentUserId }: Props) {
  const searchParams = useSearchParams();
  const autoCompose = searchParams.get("compose") === "1";
  const [posts, setPosts] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [composerPrompt, setComposerPrompt] = useState<string | undefined>(autoCompose ? " " : undefined);
  const observerRef = useRef<HTMLDivElement>(null);
  // pull-to-refresh
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [newPostCount, setNewPostCount] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [welcomeBack, setWelcomeBack] = useState(false);

  const fetchPosts = useCallback(async (cursorParam?: string | null, filterOverride?: string | null) => {
    const isInitial = !cursorParam;
    if (isInitial) {
      setNewPostCount(0);
      setLoading(true);
    } else setLoadingMore(true);

    try {
      const activeFilter = filterOverride !== undefined ? filterOverride : typeFilter;
      const params = new URLSearchParams({ limit: "20" });
      if (cursorParam) params.set("cursor", cursorParam);
      if (activeFilter) params.set("post_type", activeFilter);

      const res = await fetch(`/api/sns/posts?${params}`);
      const data = await res.json();

      if (isInitial) {
        setPosts(data.posts || []);
        // フィードが空の場合はトレンド投稿を取得
        if ((data.posts || []).length === 0) {
          fetchTrending();
        }
        // 久しぶりチェック
        try {
          const lastVisit = localStorage.getItem("sns_last_visit");
          const now = Date.now();
          if (lastVisit && now - parseInt(lastVisit) > 2 * 24 * 60 * 60 * 1000) {
            setWelcomeBack(true);
          }
          localStorage.setItem("sns_last_visit", String(now));
        } catch { /* ignore */ }
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTrending = async () => {
    try {
      const res = await fetch("/api/sns/posts?feed=trending&limit=5");
      const data = await res.json();
      setTrendingPosts(data.posts || []);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchPosts(null, null);
  }, [fetchPosts]);

  // typeFilterが変わったらリセットして再取得
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    fetchPosts(null, typeFilter);
  }, [typeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Realtime: フォロー中ユーザーの新着投稿を検知
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("posts:new")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        () => {
          // フィードが既に表示中(posts.length > 0)なら新着バッジをインクリメント
          setNewPostCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShowNewPosts = async () => {
    setNewPostCount(0);
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
    // スクロールをトップに戻す
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {/* 新着投稿バナー */}
      {newPostCount > 0 && posts.length > 0 && (
        <button
          onClick={handleShowNewPosts}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all shadow-sm"
        >
          <RefreshCw size={14} />
          {newPostCount}件の新しい投稿を見る ↑
        </button>
      )}

      {welcomeBack && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">おかえりなさい👋</p>
            <p className="text-xs text-amber-600">仲間の新しい更新が届いています</p>
          </div>
          <button onClick={() => setWelcomeBack(false)} className="text-amber-400 hover:text-amber-600 p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      {/* デイリーチェックイン（最上部に配置） */}
      <DailyCheckin
        onCheckinAndPost={(prompt) => setComposerPrompt(prompt)}
      />

      {/* 投稿タイプフィルター */}
      {posts.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-0 px-0">
          {[
            { type: null, label: "すべて" },
            { type: "update", label: "📝 更新" },
            { type: "declaration", label: "💪 宣言" },
            { type: "milestone", label: "🏆 達成" },
            { type: "auto_log", label: "🔥 Body記録" },
          ].map(({ type, label }) => (
            <button
              key={String(type)}
              onClick={() => setTypeFilter(type)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                typeFilter === type
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="space-y-4">
          {/* 空フィード: おすすめユーザー */}
          <div className="text-center py-6 space-y-2">
            <p className="text-2xl">🌱</p>
            <p className="text-stone-500 text-sm font-medium">まだ投稿がありません</p>
            <p className="text-stone-400 text-xs">仲間をフォローするとここに投稿が流れてきます</p>
          </div>

          <RecommendedUsers />

          {/* 空フィード: 人気投稿をプレビュー */}
          {trendingPosts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                  <TrendingUp size={13} className="text-amber-500" />
                  みんなの人気投稿
                </div>
                <Link
                  href="/sns?tab=discover"
                  className="flex items-center gap-1 text-xs text-teal-600 hover:underline"
                >
                  <Compass size={11} />
                  もっと見る
                </Link>
              </div>
              {trendingPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onCommentClick={(id) => setCommentPostId(id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <WeeklySummaryCard />

          {/* はじめてガイド（初回ユーザー向け） */}
          <OnboardingGuide />

          {(() => {
            let lastDate = "";
            const items = [];
            for (let i = 0; i < posts.length; i++) {
              const post = posts[i];
              const dateLabel = getDateLabel(post.created_at);
              if (dateLabel !== lastDate) {
                lastDate = dateLabel;
                items.push(
                  <div key={`date-${dateLabel}`} className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-stone-100" />
                    <span className="text-[10px] text-stone-400 font-medium px-2">{dateLabel}</span>
                    <div className="flex-1 h-px bg-stone-100" />
                  </div>
                );
              }
              items.push(
                <div key={post.id}>
                  <PostCard
                    post={post}
                    currentUserId={currentUserId}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                    onCommentClick={(id) => setCommentPostId(id)}
                  />
                  {/* 2投稿目の後にPostComposerを差し込む */}
                  {i === 1 && (
                    <div className="mt-4">
                      <PostComposer onPosted={handlePosted} initialPrompt={composerPrompt} />
                    </div>
                  )}
                  {/* 5投稿目の後におすすめユーザーを差し込む */}
                  {i === 4 && <div className="mt-4"><RecommendedUsers /></div>}
                </div>
              );
            }
            if (posts.length <= 1 && !typeFilter) {
              items.push(
                <PostComposer key="bottom-composer" onPosted={handlePosted} initialPrompt={composerPrompt} />
              );
            }
            return items;
          })()}
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
