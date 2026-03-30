"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface Props {
  postId: string;
  isBookmarked: boolean;
}

export default function BookmarkButton({ postId, isBookmarked: initial }: Props) {
  const [bookmarked, setBookmarked] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    const newState = !bookmarked;
    setBookmarked(newState); // optimistic

    try {
      if (newState) {
        await fetch("/api/sns/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId }),
        });
      } else {
        await fetch(`/api/sns/bookmarks?post_id=${postId}`, { method: "DELETE" });
      }
    } catch {
      setBookmarked(!newState); // revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-colors ${
        bookmarked
          ? "text-teal-600 hover:bg-teal-50"
          : "text-stone-300 hover:text-stone-500 hover:bg-stone-100"
      }`}
      title={bookmarked ? "ブックマーク済み" : "ブックマークする"}
    >
      {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </button>
  );
}
