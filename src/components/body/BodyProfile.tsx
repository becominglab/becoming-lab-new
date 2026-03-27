"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function BodyProfile() {
  const router = useRouter();
  const [whyText, setWhyText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/body/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setWhyText(d.profile.why_text || "");
          setGoalText(d.profile.goal_text || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/body/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ why_text: whyText.trim(), goal_text: goalText.trim() }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => router.push("/body"), 1000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link href="/body" className="text-stone-400 hover:text-stone-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">
            YOUR WHY
          </p>
          <h1 className="text-xl font-light text-gray-900 mt-1">
            変わる理由を言葉にする
          </h1>
        </div>
      </div>

      {/* Why */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          なぜ変わりたいのか？
        </label>
        <textarea
          value={whyText}
          onChange={(e) => setWhyText(e.target.value)}
          placeholder="例: 子どもと走り回れる体でいたい"
          rows={3}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white resize-none"
        />
      </div>

      {/* Goal */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          どんな自分になりたいか？
        </label>
        <textarea
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder="例: 毎日を軽やかに動ける人"
          rows={3}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white resize-none"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className={`w-full py-4 rounded-xl text-sm font-medium transition-all ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
        } disabled:opacity-60`}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={16} /> 保存しました
          </span>
        ) : saving ? (
          "保存中..."
        ) : (
          "保存する"
        )}
      </button>

      {/* Note */}
      <p className="text-xs text-stone-400 text-center mt-4 font-light">
        迷った時に戻る場所になります
      </p>
    </div>
  );
}
