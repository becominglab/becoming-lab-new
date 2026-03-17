"use client";

import { useState } from "react";

interface Declaration {
  id: string;
  content: string;
  createdAt: string;
  pinned: boolean;
}

const MOCK_DECLARATIONS: Declaration[] = [
  {
    id: "d1",
    content:
      "完成を目指さない。更新を重ねる。自分の人生を、自分で編集し続ける。",
    createdAt: "2026-01-15",
    pinned: true,
  },
  {
    id: "d2",
    content: "走ることで、自分の輪郭を確かめる。今年中にフルマラソンを完走する。",
    createdAt: "2026-02-01",
    pinned: false,
  },
  {
    id: "d3",
    content:
      "「わからない」を恐れない。不確実な時間を、丁寧に過ごす力を身につける。",
    createdAt: "2026-03-01",
    pinned: false,
  },
];

export default function DeclarationSection() {
  const [declarations] = useState<Declaration[]>(MOCK_DECLARATIONS);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");

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

      {/* Pinned Declaration */}
      {pinned && (
        <div className="relative mb-8">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-10">
            <p className="text-[10px] tracking-[0.3em] text-stone-500 mb-4">
              MY DECLARATION
            </p>
            <blockquote className="text-lg md:text-xl text-white font-light leading-relaxed">
              {pinned.content}
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-px h-3 bg-stone-600" />
              <time className="text-[10px] text-stone-500">
                {new Date(pinned.createdAt + "T00:00:00").toLocaleDateString(
                  "ja-JP",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </time>
            </div>
          </div>
        </div>
      )}

      {/* Other Declarations */}
      <div className="space-y-3 mb-8">
        {others.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors"
          >
            <p className="text-sm text-gray-700 font-light leading-relaxed">
              {d.content}
            </p>
            <time className="block text-[10px] text-stone-300 mt-3">
              {new Date(d.createdAt + "T00:00:00").toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
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
              className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
              disabled={!inputText.trim()}
            >
              宣言する
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
