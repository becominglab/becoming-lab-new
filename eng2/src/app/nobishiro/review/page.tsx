'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

const MOOD_OPTIONS = [
  { label: 'たのしかった', emoji: '😊' },
  { label: 'がんばった', emoji: '💪' },
  { label: 'むずかしかった', emoji: '🤔' },
  { label: 'ちょっとつかれた', emoji: '😴' },
  { label: 'またやれそう', emoji: '✨' },
];

export default function ReviewPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [done, setDone] = useState('');
  const [growth, setGrowth] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);

      // Pre-fill if already reflected today
      const todayLog = s.dailyLogs[getToday()];
      if (todayLog?.reflection) {
        setDone(todayLog.reflection.done);
        setGrowth(todayLog.reflection.growth);
        setTomorrow(todayLog.reflection.tomorrow);
      }
      if (todayLog?.mood) setSelectedMood(todayLog.mood);
    } catch { router.replace('/mm'); }
  }, [router]);

  const handleSubmit = () => {
    if (!state) return;
    const todayKey = getToday();
    const moodText = selectedMood || '';

    const updated: AppState = {
      ...state,
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
          studied: true,
          reflection: { done, growth, tomorrow },
          mood: moodText,
          missionsCompleted: Math.max(
            state.dailyLogs[todayKey]?.missionsCompleted || 0,
            3
          ),
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setState(updated);
    setSaved(true);
    setTimeout(() => router.push('/nobishiro/home'), 2500);
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="text-6xl mb-4 animate-bounce">🌟</div>
          <h2 className="text-xl font-bold text-amber-600 mb-2">
            ふりかえり完了！
          </h2>
          <p className="text-sm text-slate-500 text-center">
            今日もおつかれさま！
          </p>
          <p className="text-xs text-slate-400 mt-2">
            ホームに戻ります...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-5 pt-10 pb-6 rounded-b-3xl">
        <button
          onClick={() => router.push('/nobishiro/home')}
          className="text-white/80 text-sm mb-2"
        >
          ← ホームに戻る
        </button>
        <h1 className="text-white text-xl font-bold">1分ふりかえり</h1>
        <p className="text-white/70 text-sm mt-1">
          今日の学習をかんたんに振り返ろう
        </p>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* できたこと */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2">
            <span>🌸</span> 今日できたこと
          </h2>
          <textarea
            value={done}
            onChange={(e) => setDone(e.target.value)}
            placeholder="算数の分数ができた"
            rows={2}
            className="w-full bg-amber-50 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 border-none outline-none focus:ring-2 focus:ring-amber-300 resize-none"
          />
        </div>

        {/* のびしろ */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2">
            <span>🌱</span> 今日見つけたのびしろ
          </h2>
          <textarea
            value={growth}
            onChange={(e) => setGrowth(e.target.value)}
            placeholder="漢字がまだ覚えきれてない"
            rows={2}
            className="w-full bg-amber-50 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 border-none outline-none focus:ring-2 focus:ring-amber-300 resize-none"
          />
        </div>

        {/* あしたやりたいこと */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2">
            <span>🎯</span> 明日やりたいこと
          </h2>
          <textarea
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder="漢字の練習をする"
            rows={2}
            className="w-full bg-amber-50 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 border-none outline-none focus:ring-2 focus:ring-amber-300 resize-none"
          />
        </div>

        {/* Mood Stamps */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-amber-600 mb-3 flex items-center gap-2">
            <span>💭</span> 今日の気持ち
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(`${mood.emoji} ${mood.label}`)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all active:scale-95 ${
                  selectedMood === `${mood.emoji} ${mood.label}`
                    ? 'bg-amber-400 text-white shadow-md'
                    : 'bg-amber-50 text-slate-600 hover:bg-amber-100'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl py-4 text-lg font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
        >
          きろくする
        </button>
      </div>
    </div>
  );
}
