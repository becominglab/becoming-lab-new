"use client";

import { useState, useEffect } from "react";

const CHALLENGE_TAG_OPTIONS = [
  "ダイエット", "筋トレ", "ランニング", "読書", "瞑想",
  "早起き", "英語", "副業", "禁酒", "禁煙", "食事改善", "ストレッチ",
];

interface Declaration {
  id: string;
  content: string;
  created_at: string;
}

interface Props {
  vol: string;
}

export default function MigrateWizard({ vol }: Props) {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [declaration, setDeclaration] = useState("");
  const [existingDeclarations, setExistingDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 0: 既存宣言を取得
  useEffect(() => {
    fetch("/api/declarations")
      .then((r) => r.json())
      .then((d) => {
        if (d.declarations) setExistingDeclarations(d.declarations);
      })
      .catch(() => {});
  }, []);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sns/event-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vol: parseInt(vol),
          nickname,
          declaration: declaration.trim() || undefined,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }
      window.location.href = "/sns";
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.round((step / 3) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="bg-[#1B6B7A] text-white py-8 px-8">
        <div className="max-w-lg mx-auto">
          <p className="text-xs tracking-widest opacity-70 mb-1">自分で選んだ道</p>
          <p className="text-sm opacity-80">vol.{vol} 参加者向け移行ガイド</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-8 py-8">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-stone-400 mb-2">
            <span>ステップ {step} / 3</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step 1: あなたの道を教えて */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-1">
                vol.{vol}の仲間として参加します
              </h2>
              <p className="text-sm text-stone-500">
                SNSでの表示名とチャレンジタグを設定しましょう
              </p>
            </div>

            {/* ニックネーム */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                ニックネーム <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                placeholder="SNSでの表示名"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* チャレンジタグ */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                チャレンジタグ（複数選択可）
              </label>
              <div className="flex flex-wrap gap-2">
                {CHALLENGE_TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      tags.includes(tag)
                        ? "bg-teal-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!nickname.trim()) {
                  setError("ニックネームを入力してください");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="w-full py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
            >
              次へ
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}

        {/* Step 2: あなたの宣言 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-1">
                あなたが選んだ道は？
              </h2>
              <p className="text-sm text-stone-500">
                宣言はSNSに投稿され、仲間に共有されます（スキップ可）
              </p>
            </div>

            {/* 既存宣言がある場合 */}
            {existingDeclarations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-stone-500 mb-2">
                  以前の宣言から選ぶ
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {existingDeclarations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDeclaration(d.content)}
                      className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
                        declaration === d.content
                          ? "border-teal-500 bg-teal-50 text-teal-800"
                          : "border-stone-200 hover:border-stone-300 text-stone-700"
                      }`}
                    >
                      {d.content}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 新規宣言入力 */}
            <div>
              <textarea
                value={declaration}
                onChange={(e) => setDeclaration(e.target.value)}
                maxLength={200}
                rows={4}
                placeholder={`例「毎朝6時に起きて、自分だけの1時間を作る」`}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-stone-400 mt-1 text-right">{declaration.length}/200</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeclaration("");
                  setStep(3);
                }}
                className="flex-1 py-3 border border-stone-300 text-stone-600 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
              >
                スキップ
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* Step 3: サークルに参加 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-1">
                vol.{vol}の仲間と繋がろう
              </h2>
              <p className="text-sm text-stone-500">
                イベントの参加者専用サークルに参加します
              </p>
            </div>

            <div className="p-5 bg-teal-50 border border-teal-200 rounded-xl space-y-3">
              <p className="font-semibold text-teal-900">
                自分で選んだ道 vol.{vol}
              </p>
              <p className="text-sm text-teal-700 leading-relaxed">
                同じイベントに参加した仲間だけのクローズドグループです。
                4〜6人の小さなサークルで、日々の歩みを共有し合いましょう。
              </p>
              <div className="flex items-center gap-2 text-xs text-teal-600">
                <span>🔒 クローズドグループ</span>
                <span>·</span>
                <span>最大10名</span>
              </div>
            </div>

            {/* 設定内容の確認 */}
            <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-sm text-stone-600">
              <p><span className="font-medium text-stone-700">ニックネーム:</span> {nickname}</p>
              {tags.length > 0 && (
                <p><span className="font-medium text-stone-700">タグ:</span> {tags.join(", ")}</p>
              )}
              {declaration && (
                <p><span className="font-medium text-stone-700">宣言:</span> {declaration.slice(0, 50)}{declaration.length > 50 ? "…" : ""}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "参加中…" : "サークルに参加する"}
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2 text-stone-400 text-sm hover:text-stone-600 transition-colors"
            >
              ← 戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
