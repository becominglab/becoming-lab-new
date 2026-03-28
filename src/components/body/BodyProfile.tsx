"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Bell, Scale } from "lucide-react";
import Link from "next/link";

export default function BodyProfile() {
  const router = useRouter();
  const [whyText, setWhyText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [lineCode, setLineCode] = useState("");
  const [lineLinked, setLineLinked] = useState(false);
  const [lineRemind, setLineRemind] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tanitaConnected, setTanitaConnected] = useState(false);

  useEffect(() => {
    fetch("/api/body/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setWhyText(d.profile.why_text || "");
          setGoalText(d.profile.goal_text || "");
          setLineLinked(!!d.profile.line_user_id);
          setLineRemind(d.profile.line_remind || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Check Tanita connection status
    fetch("/api/body/tanita")
      .then((r) => r.json())
      .then((d) => setTanitaConnected(d.connected === true))
      .catch(() => {});
  }, []);

  // Auto-dismiss error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/body/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          why_text: whyText.trim(),
          goal_text: goalText.trim(),
          line_code: lineCode.trim() || undefined,
          line_remind: lineRemind,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => router.push("/body"), 1000);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || "保存に失敗しました。もう一度お試しください。");
      }
    } catch {
      setError("通信エラーが発生しました。接続を確認してください。");
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
    <div className="px-6 pt-12 pb-28">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
          <div className="mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-lg">
            {error}
          </div>
        </div>
      )}

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

      {/* LINE Reminder Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">LINEリマインダー</span>
        </div>

        {lineLinked ? (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-800 font-medium">LINE連携済み</p>
                <p className="text-xs text-emerald-600 mt-1">毎日20時にリマインドが届きます</p>
              </div>
              <button
                type="button"
                onClick={() => setLineRemind(!lineRemind)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  lineRemind ? "bg-emerald-500" : "bg-stone-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    lineRemind ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <p className="text-xs text-stone-500 mb-3">
              LINEで毎日リマインドを受け取れます。
              <br />
              Bot を友だち追加し、連携コードを入力してください。
            </p>
            <input
              type="text"
              value={lineCode}
              onChange={(e) => setLineCode(e.target.value)}
              placeholder="連携コード（8文字）"
              maxLength={8}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
            />
          </div>
        )}
      </div>

      {/* Tanita Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={16} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">タニタ体組成計</span>
        </div>

        {tanitaConnected ? (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-indigo-600" />
              <div>
                <p className="text-sm text-indigo-800 font-medium">連携済み</p>
                <p className="text-xs text-indigo-600 mt-0.5">
                  記録時に体重が自動入力されます
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <p className="text-xs text-stone-500 mb-3">
              タニタの体組成計を連携すると、記録時に体重が自動で入力されます。
            </p>
            <a
              href="/api/healthplanet/auth"
              className="block w-full py-3 text-center bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              Health Planet と連携する
            </a>
          </div>
        )}
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
