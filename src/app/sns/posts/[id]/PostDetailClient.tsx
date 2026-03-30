"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/sns/PostCard";
import CommentSection from "@/components/sns/CommentSection";
import SkeletonCard from "@/components/sns/SkeletonCard";
import { ArrowLeft } from "lucide-react";

interface Props {
  postId: string;
  currentUserId: string;
}

export default function PostDetailClient({ postId, currentUserId }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/sns/posts/${postId}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setPost(data.post);
        // 投稿詳細ページではコメントを自動表示
        setTimeout(() => setShowComments(true), 300);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleDeleted = () => {
    router.push("/sns");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdated = (updated: any) => {
    setPost((prev: any) => ({ ...prev, ...updated }));
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* 戻るヘッダー */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-semibold text-stone-800">投稿の詳細</h1>
      </div>

      {loading ? (
        <SkeletonCard />
      ) : notFound ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-3xl">🔍</p>
          <p className="text-stone-500 text-sm font-medium">投稿が見つかりません</p>
          <p className="text-stone-400 text-xs">削除されたか、非公開の投稿です</p>
          <Link
            href="/sns"
            className="inline-block mt-2 text-sm text-teal-600 hover:underline"
          >
            フィードに戻る
          </Link>
        </div>
      ) : post ? (
        <>
          <PostCard
            post={post}
            currentUserId={currentUserId}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
            onCommentClick={() => setShowComments(true)}
          />
          {showComments && (
            <CommentSection
              postId={postId}
              onClose={() => setShowComments(false)}
              inline
            />
          )}
        </>
      ) : null}
    </div>
  );
}
