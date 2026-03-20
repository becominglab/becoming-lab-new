'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

const TEMPLATES = [
  '続けていてえらいね',
  '苦手を見つけられてよかったね',
  '昨日の自分より進んでるね',
  '塾のあとに振り返りできたのがすごいね',
];

const STAMP_OPTIONS = ['👏', '🎉', '💪', '❤️', '⭐', '🌸'];

export default function ParentCommentPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [text, setText] = useState('');
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      setState(JSON.parse(stored) as AppState);
    } catch { router.replace('/mm'); }
  }, [router]);

  const applyTemplate = (template: string) => {
    setText(template);
  };

  const toggleStamp = (stamp: string) => {
    setSelectedStamps((prev) =>
      prev.includes(stamp) ? prev.filter((s) => s !== stamp) : [...prev, stamp]
    );
  };

  const handleSend = () => {
    if (!state) return;
    const messageText =
      (text ? text : '') +
      (selectedStamps.length > 0 ? ' ' + selectedStamps.join('') : '');
    if (!messageText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      text: messageText.trim(),
      type: (text ? 'free' : 'stamp') as 'free' | 'template' | 'stamp',
      createdAt: new Date().toISOString(),
    };

    const todayKey = getToday();
    const updated: AppState = {
      ...state,
      parentComments: [...state.parentComments, newComment],
      dailyLogs: {
        ...state.dailyLogs,
        [todayKey]: {
          ...(state.dailyLogs[todayKey] || {
            date: todayKey,
            studied: false,
            juku: false,
            missionsCompleted: 0,
            badgesEarned: [],
            parentCommented: false,
          }),
          parentCommented: true,
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setState(updated);
    setSent(true);
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="text-6xl mb-4 animate-bounce">💌</div>
          <h2 className="text-xl font-bold text-rose-600 mb-2">
            コメントを送りました！
          </h2>
          <p className="text-sm text-slate-500 text-center">
            ホーム画面に表示されます
          </p>
          <button
            onClick={() => router.push('/nobishiro/parent')}
            className="mt-8 bg-rose-400 text-white px-8 py-3 rounded-xl font-medium hover:bg-rose-500 transition-colors"
          >
            親の画面に戻る
          </button>
        </div>
      </div>
    );
  }

  const previewText =
    (text ? text : '') +
    (selectedStamps.length > 0 ? ' ' + selectedStamps.join('') : '');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-400 px-5 pt-10 pb-6 rounded-b-3xl">
        <button
          onClick={() => router.push('/nobishiro/parent')}
          className="text-white/80 text-sm mb-2"
        >
          ← 親の画面に戻る
        </button>
        <h1 className="text-white text-xl font-bold">コメント送信</h1>
        <p className="text-white/70 text-sm mt-1">
          お子さんに応援メッセージを送りましょう
        </p>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* Template Suggestions */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-rose-500 mb-3">
            テンプレートから選ぶ
          </h2>
          <div className="space-y-2">
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => applyTemplate(t)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all active:scale-[0.98] ${
                  text === t
                    ? 'bg-rose-400 text-white'
                    : 'bg-rose-50 text-slate-600 hover:bg-rose-100'
                }`}
              >
                「{t}」
              </button>
            ))}
          </div>
        </div>

        {/* Free Text Input */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-rose-500 mb-3">
            自由にメッセージを書く
          </h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="がんばっている姿を見てうれしいよ..."
            rows={4}
            className="w-full bg-rose-50 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 border-none outline-none focus:ring-2 focus:ring-rose-300 resize-none"
          />
        </div>

        {/* Stamp Buttons */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-rose-500 mb-3">
            スタンプを追加
          </h2>
          <div className="flex gap-3 justify-center">
            {STAMP_OPTIONS.map((stamp) => (
              <button
                key={stamp}
                onClick={() => toggleStamp(stamp)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all active:scale-90 ${
                  selectedStamps.includes(stamp)
                    ? 'bg-rose-400 shadow-md scale-110'
                    : 'bg-rose-50 hover:bg-rose-100'
                }`}
              >
                {stamp}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {previewText.trim() && (
          <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-rose-500 mb-3">
              プレビュー（子どもに表示される内容）
            </h2>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💌</div>
                <div>
                  <p className="text-xs text-pink-500 font-medium mb-1">
                    親からのコメント
                  </p>
                  <p className="text-sm text-slate-700">{previewText}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!previewText.trim()}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all active:scale-[0.98] ${
            previewText.trim()
              ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          送信する
        </button>
      </div>
    </div>
  );
}
