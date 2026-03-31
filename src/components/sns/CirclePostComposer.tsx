"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  circleId: string;
  onPosted: () => void;
}

export default function CirclePostComposer({ circleId, onPosted }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/sns/circles/${circleId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "投稿に失敗しました");
        return;
      }

      setContent("");
      onPosted();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-stone-100 p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="サークルに投稿する..."
          maxLength={500}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[40px] max-h-32"
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="shrink-0 w-10 h-10 bg-teal-500 disabled:bg-stone-200 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {content.length > 400 && (
        <p className="text-right text-xs text-stone-400 mt-1">{content.length}/500</p>
      )}
    </form>
  );
}
