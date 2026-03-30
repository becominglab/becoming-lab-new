"use client";

import { useState, useEffect, useCallback } from "react";
import CircleCard from "./CircleCard";
import { Plus, Loader2, X } from "lucide-react";

interface Circle {
  id: string;
  name: string;
  theme_tag: string;
  description?: string;
  max_members: number;
  member_count: number;
  is_full?: boolean;
  my_role?: string;
}

const TAG_OPTIONS = [
  "ダイエット", "筋トレ", "ランニング", "読書", "瞑想",
  "早起き", "英語", "副業", "食事改善",
];

export default function CirclesView() {
  const [tab, setTab] = useState<"joined" | "discover">("joined");
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadCircles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sns/circles?tab=${tab}`);
      const data = await res.json();
      setCircles(data.circles || []);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    loadCircles();
  }, [loadCircles]);

  return (
    <div>
      {/* ヘッダー */}
      <div className="px-4 flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-stone-900">挑戦サークル</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} />
          作成
        </button>
      </div>

      {/* タブ */}
      <div className="flex gap-1 px-4 mb-4">
        <button
          onClick={() => setTab("joined")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "joined" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          参加中
        </button>
        <button
          onClick={() => setTab("discover")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "discover" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          みつける
        </button>
      </div>

      {/* サークル一覧 */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-stone-300" />
          </div>
        ) : circles.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-3xl">{tab === "joined" ? "🌱" : "🔍"}</p>
            <p className="text-stone-500 text-sm">
              {tab === "joined"
                ? "まだサークルに参加していません"
                : "公開サークルが見つかりませんでした"}
            </p>
            {tab === "joined" && (
              <button
                onClick={() => setTab("discover")}
                className="mt-2 text-teal-600 text-sm underline"
              >
                サークルをみつける
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {circles.map((circle) => (
              <CircleCard key={circle.id} circle={circle} />
            ))}
          </div>
        )}
      </div>

      {/* サークル作成モーダル */}
      {showCreate && (
        <CreateCircleModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            setTab("joined");
            loadCircles();
          }}
        />
      )}
    </div>
  );
}

function CreateCircleModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [themeTag, setThemeTag] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTag = themeTag || customTag;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !selectedTag.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sns/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          theme_tag: selectedTag,
          description: description || undefined,
          max_members: maxMembers,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "作成に失敗しました");
        return;
      }

      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-stone-900">サークルを作成</h2>
          <button onClick={onClose}>
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-stone-500 mb-1 block">サークル名 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：毎朝5時起き部"
              maxLength={40}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <p className="text-right text-xs text-stone-300 mt-0.5">{name.length}/40</p>
          </div>

          <div>
            <label className="text-xs text-stone-500 mb-1 block">テーマタグ *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setThemeTag(tag); setCustomTag(""); }}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    themeTag === tag
                      ? "bg-teal-600 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <input
              value={customTag}
              onChange={(e) => { setCustomTag(e.target.value); setThemeTag(""); }}
              placeholder="カスタムタグ（任意）"
              maxLength={20}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-xs text-stone-500 mb-1 block">説明（任意）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="どんな仲間を募集するか..."
              maxLength={200}
              rows={2}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-xs text-stone-500 mb-1 block">
              定員: {maxMembers}人
            </label>
            <input
              type="range"
              min={2}
              max={10}
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-xs text-stone-300">
              <span>2人</span>
              <span>10人</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || !selectedTag.trim() || loading}
            className="w-full py-3 bg-teal-600 disabled:bg-stone-200 text-white rounded-xl font-medium text-sm transition-colors"
          >
            {loading ? "作成中..." : "サークルを作成する"}
          </button>
        </form>
      </div>
    </div>
  );
}
