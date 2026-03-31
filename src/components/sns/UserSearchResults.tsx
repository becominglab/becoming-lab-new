"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import UserCard from "./UserCard";
import { Search, Loader2 } from "lucide-react";

const PHASE_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "exploring", label: "模索中" },
  { value: "starting", label: "始めたて" },
  { value: "building", label: "軌道に乗ってきた" },
  { value: "maintaining", label: "定着期" },
];

interface Profile {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  challenge_tags: string[];
  update_phase: string;
  is_following?: boolean;
}

export default function UserSearchResults() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") || "";

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [phase, setPhase] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/sns/trending-tags")
      .then((r) => r.json())
      .then((d) => {
        const tags = (d.tags || []).map((t: { tag: string }) => t.tag);
        setTagOptions(tags.length > 0 ? tags : ["ダイエット", "筋トレ", "ランニング", "読書", "瞑想", "早起き", "英語", "副業", "食事改善"]);
      })
      .catch(() => setTagOptions(["ダイエット", "筋トレ", "ランニング", "読書", "瞑想", "早起き", "英語", "副業", "食事改善"]));
  }, []);

  const handleSearch = useCallback(async (tagsOverride?: string[]) => {
    const tags = tagsOverride ?? selectedTags;
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (tags.length > 0) params.set("tags", tags.join(","));
      if (phase) params.set("phase", phase);

      const res = await fetch(`/api/sns/search?${params}`);
      const data = await res.json();
      setResults(data.profiles || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedTags, phase]);

  // URLのタグパラメータで自動検索
  useEffect(() => {
    if (initialTag) {
      handleSearch([initialTag]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTag]);

  // タグ・フェーズ変更で500msデバウンス自動検索
  useEffect(() => {
    if (!searched && selectedTags.length === 0 && !phase) return; // 初回は手動検索待ち
    const timer = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, phase]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-4">
      {/* 検索バー */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ニックネームで検索"
            className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "検索"}
        </button>
      </div>

      {/* タグフィルター */}
      <div>
        <p className="text-xs text-stone-500 mb-1.5">挑戦タグで絞り込み</p>
        <div className="flex flex-wrap gap-1.5">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* フェーズフィルター */}
      <div className="flex gap-1.5 overflow-x-auto">
        {PHASE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPhase(opt.value)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              phase === opt.value
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 結果 */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-stone-200 rounded w-24" />
                  <div className="h-3 bg-stone-100 rounded w-40" />
                </div>
                <div className="h-7 w-20 bg-stone-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-3">
            {selectedTags.length > 0 && (
              <p className="text-xs text-stone-400 text-center">
                #{selectedTags.join(" #")} で検索中 · {results.length}人
              </p>
            )}
            {results.map((profile) => (
              <UserCard key={profile.user_id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-stone-400 text-sm">該当するユーザーが見つかりませんでした</p>
          </div>
        )
      ) : (
        <div className="text-center py-10 space-y-1">
          <p className="text-2xl">🔍</p>
          <p className="text-stone-400 text-sm">タグやキーワードで仲間を探しましょう</p>
        </div>
      )}
    </div>
  );
}
