"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, ChevronUp, Loader2 } from "lucide-react";

interface Props {
  onPosted?: () => void;
  /** チェックインやチャレンジ連携時の初期プロンプト */
  initialPrompt?: string;
}

export default function PostComposer({ onPosted, initialPrompt }: Props) {
  const searchParams = useSearchParams();
  const challengeTitle = searchParams.get("challenge");
  const challengeProgress = searchParams.get("progress");

  const defaultDid = challengeTitle
    ? `「${challengeTitle}」進捗${challengeProgress ? ` ${challengeProgress}%` : ""}`
    : "";

  const [expanded, setExpanded] = useState(!!(challengeTitle || initialPrompt));
  const [did, setDid] = useState(defaultDid);
  const [learned, setLearned] = useState("");
  const [tomorrow, setTomorrow] = useState("");
  const [posting, setPosting] = useState(false);

  // initialPrompt が変わったら展開＋placeholder更新
  useEffect(() => {
    if (initialPrompt) setExpanded(true);
  }, [initialPrompt]);

  useEffect(() => {
    if (challengeTitle) setExpanded(true);
  }, [challengeTitle]);

  const handleSubmit = async () => {
    if (!did.trim()) return;
    setPosting(true);

    try {
      const res = await fetch("/api/sns/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_type: "update",
          content: {
            did: did.trim(),
            learned: learned.trim() || null,
            tomorrow: tomorrow.trim() || null,
          },
        }),
      });

      if (res.ok) {
        setDid("");
        setLearned("");
        setTomorrow("");
        setExpanded(false);
        onPosted?.();
      }
    } catch {
      // silently fail
    } finally {
      setPosting(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full p-4 bg-white rounded-xl border border-stone-200 text-left text-sm text-stone-400 hover:border-teal-200 hover:text-stone-500 transition-colors flex items-center gap-2"
      >
        <span className="text-lg">✏️</span>
        今日の更新を記録する...
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-teal-200 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-800">きょうの更新</h3>
        <button
          onClick={() => setExpanded(false)}
          className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
        >
          <ChevronUp size={18} />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-teal-700 mb-1">
          やったこと <span className="text-red-400">*</span>
        </label>
        <textarea
          value={did}
          onChange={(e) => setDid(e.target.value)}
          maxLength={140}
          rows={2}
          placeholder={initialPrompt || "今日取り組んだことを書く"}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          autoFocus={!!challengeTitle}
        />
        <p className="text-xs text-stone-400 text-right">{did.length}/140</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-teal-700 mb-1">
          気づいたこと
        </label>
        <textarea
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          maxLength={140}
          rows={2}
          placeholder="気づきや学びがあれば"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-teal-700 mb-1">
          明日やること
        </label>
        <textarea
          value={tomorrow}
          onChange={(e) => setTomorrow(e.target.value)}
          maxLength={140}
          rows={2}
          placeholder="明日の一歩を宣言"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!did.trim() || posting}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        投稿する
      </button>
    </div>
  );
}
