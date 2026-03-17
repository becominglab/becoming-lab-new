"use client";

import { useState, useEffect, useCallback } from "react";

interface Declaration {
  id: string;
  content: string;
  created_at: string;
  pinned: boolean;
}

export default function DeclarationSection() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDeclarations = useCallback(async () => {
    try {
      const res = await fetch("/api/declarations");
      if (res.ok) {
        const data = await res.json();
        setDeclarations(data.declarations || []);
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const handleSave = async () => {
    if (!inputText.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/declarations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText.trim() }),
      });
      if (res.ok) {
        setInputText("");
        setShowInput(false);
        await fetchDeclarations();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handlePin = async (id: string, currentPinned: boolean) => {
    try {
      const res = await fetch("/api/declarations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pinned: !currentPinned }),
      });
      if (res.ok) {
        await fetchDeclarations();
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/declarations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeclarations((prev) => prev.filter((d) => d.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const pinned = declarations.find((d) => d.pinned);
  const others = declarations.filter((d) => !d.pinned);

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
          DECLARATION
        </p>
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          自分への宣言
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          言葉にすることで、意志が形になる。
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && (
        <>
          {/* Pinned Declaration */}
          {pinned && (
            <div className="relative mb-8 group/pin">
              <div className="bg-gray-900 rounded-2xl p-8 md:p-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.3em] text-stone-500">
                    MY DECLARATION
                  </p>
                  <button
                    onClick={() => handlePin(pinned.id, true)}
                    className="text-[10px] text-stone-500 hover:text-stone-300 transition-colors opacity-0 group-hover/pin:opacity-100"
                  >
                    ピン解除
                  </button>
                </div>
                <blockquote className="text-lg md:text-xl text-white font-light leading-relaxed">
                  {pinned.content}
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-px h-3 bg-stone-600" />
                  <time className="text-[10px] text-stone-500">
                    {new Date(pinned.created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {declarations.length === 0 && (
            <div className="text-center py-12 mb-8">
              <p className="text-sm text-stone-400 font-light">
                まだ宣言がありません。
              </p>
              <p className="text-xs text-stone-300 mt-2">
                自分への宣言を書いて、意志を形にしましょう。
              </p>
            </div>
          )}

          {/* Other Declarations */}
          <div className="space-y-3 mb-8">
            {others.map((d) => (
              <div
                key={d.id}
                className="group p-5 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors"
              >
                <p className="text-sm text-gray-700 font-light leading-relaxed">
                  {d.content}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <time className="text-[10px] text-stone-300">
                    {new Date(d.created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePin(d.id, false)}
                      className="text-[10px] text-stone-400 hover:text-[#1B6B7A] transition-colors"
                    >
                      ピン留め
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-[10px] text-stone-400 hover:text-red-400 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Declaration */}
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full p-5 rounded-xl border border-dashed border-stone-200 hover:border-stone-400 transition-colors text-center group"
            >
              <p className="text-sm text-stone-400 group-hover:text-stone-600 transition-colors">
                新しい宣言を書く
              </p>
            </button>
          ) : (
            <div className="animate-fadeIn">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="自分に宣言する..."
                className="w-full bg-white border border-stone-200 rounded-xl p-5 text-sm text-gray-700 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
                rows={3}
                autoFocus
              />
              <div className="flex items-center justify-end gap-3 mt-3">
                <button
                  onClick={() => {
                    setShowInput(false);
                    setInputText("");
                  }}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
                  disabled={!inputText.trim() || saving}
                >
                  {saving ? "保存中..." : "宣言する"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
