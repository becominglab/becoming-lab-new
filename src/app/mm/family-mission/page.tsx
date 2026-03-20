'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FamilyMission {
  id: string;
  icon: string;
  title: string;
  condition: string;
  type: 'streak' | 'badges' | 'days' | 'custom';
  threshold: number;
  familyMessage: string;
}

const DEFAULT_MISSIONS: FamilyMission[] = [
  {
    id: 'fm-streak-3',
    icon: '\uD83D\uDC4F',
    title: '3日続けたら家族で拍手',
    condition: '3日連続で学習する',
    type: 'streak',
    threshold: 3,
    familyMessage: '',
  },
  {
    id: 'fm-badges-5',
    icon: '\u2615',
    title: '5バッジたまったら一緒にカフェ',
    condition: 'バッジを5個集める',
    type: 'badges',
    threshold: 5,
    familyMessage: '',
  },
  {
    id: 'fm-days-10',
    icon: '\uD83D\uDCDA',
    title: '春休み前半を乗り切ったら好きな本を選ぶ',
    condition: '10日間学習する',
    type: 'days',
    threshold: 10,
    familyMessage: '',
  },
  {
    id: 'fm-days-20',
    icon: '\uD83C\uDFA1',
    title: '春休み完走で特別なおでかけ',
    condition: '20日間学習する',
    type: 'days',
    threshold: 20,
    familyMessage: '',
  },
];

const STORAGE_KEY = 'nobishiro-quest';
const MISSIONS_KEY = 'nobishiro-quest-family-missions';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadState(): AppState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

function loadMissions(): FamilyMission[] {
  if (typeof window === 'undefined') return DEFAULT_MISSIONS;
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return DEFAULT_MISSIONS;
    return JSON.parse(raw) as FamilyMission[];
  } catch {
    return DEFAULT_MISSIONS;
  }
}

function saveMissions(missions: FamilyMission[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

function getStreak(state: AppState): number {
  let count = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().split('T')[0];
    if (state.dailyLogs[key]?.studied) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

function getTotalStudyDays(state: AppState): number {
  return Object.values(state.dailyLogs).filter((l) => l.studied).length;
}

function getBadgeCount(state: AppState): number {
  return state.earnedBadges?.length ?? 0;
}

function getProgress(mission: FamilyMission, state: AppState): number {
  switch (mission.type) {
    case 'streak':
      return getStreak(state);
    case 'badges':
      return getBadgeCount(state);
    case 'days':
      return getTotalStudyDays(state);
    case 'custom':
      return 0;
    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FamilyMissionPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [missions, setMissions] = useState<FamilyMission[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  useEffect(() => {
    const s = loadState();
    if (!s || !s.currentUser) {
      router.replace('/mm');
      return;
    }
    setState(s);
    setMissions(loadMissions());
  }, [router]);

  const handleSaveMessage = useCallback(
    (missionId: string) => {
      const updated = missions.map((m) =>
        m.id === missionId ? { ...m, familyMessage: editMessage } : m,
      );
      setMissions(updated);
      saveMissions(updated);
      setEditingId(null);
      setEditMessage('');
    },
    [missions, editMessage],
  );

  const handleAddMission = useCallback(() => {
    if (!newTitle.trim()) return;
    const mission: FamilyMission = {
      id: `fm-custom-${Date.now()}`,
      icon: '\u2B50',
      title: newTitle.trim(),
      condition: newCondition.trim() || newTitle.trim(),
      type: 'custom',
      threshold: 1,
      familyMessage: '',
    };
    const updated = [...missions, mission];
    setMissions(updated);
    saveMissions(updated);
    setNewTitle('');
    setNewCondition('');
    setShowAddForm(false);
  }, [missions, newTitle, newCondition]);

  const handleDeleteMission = useCallback(
    (id: string) => {
      const updated = missions.filter((m) => m.id !== id);
      setMissions(updated);
      saveMissions(updated);
    },
    [missions],
  );

  const triggerCelebration = useCallback((id: string) => {
    setCelebratingId(id);
    setTimeout(() => setCelebratingId(null), 2000);
  }, []);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-amber-50">
        <div className="animate-spin text-2xl">{'\uD83C\uDF00'}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-amber-400 px-5 pt-10 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push('/mm/home')}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
            aria-label="Back"
          >
            {'\u2190'}
          </button>
          <h1 className="text-white text-xl font-bold flex-1">
            {'\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67'} 親子ミッション
          </h1>
        </div>
        <p className="text-white/80 text-sm ml-12">
          勉強を孤独なものにせず、家族の応援イベントにしよう
        </p>
      </div>

      {/* Mission List */}
      <div className="px-5 py-6 space-y-4 flex-1">
        {missions.map((mission) => {
          const current = getProgress(mission, state);
          const achieved = current >= mission.threshold;
          const progressPct = Math.min(100, (current / mission.threshold) * 100);

          return (
            <div
              key={mission.id}
              className={`relative rounded-2xl border p-5 transition-all duration-500 ${
                achieved
                  ? 'bg-gradient-to-r from-amber-50 to-pink-50 border-amber-200 shadow-lg'
                  : 'bg-white border-pink-100 shadow-sm'
              } ${celebratingId === mission.id ? 'animate-bounce' : ''}`}
            >
              {/* Achieved glow */}
              {achieved && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-200/30 to-pink-200/30 animate-pulse pointer-events-none" />
              )}

              <div className="relative z-10">
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div
                    className={`text-3xl ${achieved ? 'animate-pulse' : ''}`}
                    role="img"
                    aria-label={mission.title}
                  >
                    {mission.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-700 leading-snug">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mission.condition}</p>
                  </div>
                  {/* Status badge */}
                  <div
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                      achieved
                        ? 'bg-amber-400 text-white'
                        : 'bg-pink-100 text-pink-400'
                    }`}
                  >
                    {achieved ? 'たっせい！' : 'チャレンジ中'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>
                      {current} / {mission.threshold}
                    </span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <div className="h-2.5 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        achieved
                          ? 'bg-gradient-to-r from-amber-400 to-pink-400'
                          : 'bg-gradient-to-r from-pink-300 to-amber-300'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Achieved: celebration + family message */}
                {achieved && (
                  <div className="mt-3 space-y-2">
                    {/* Sparkle line */}
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-sm animate-pulse">{'\u2728'}</span>
                      <span className="text-xs font-bold">すごい！ミッションたっせい！</span>
                      <span className="text-sm animate-pulse">{'\u2728'}</span>
                      <button
                        onClick={() => triggerCelebration(mission.id)}
                        className="ml-auto text-xs bg-amber-100 px-2 py-0.5 rounded-full text-amber-600 hover:bg-amber-200 transition-colors"
                      >
                        {'\uD83C\uDF89'} もう一度
                      </button>
                    </div>

                    {/* Family message area */}
                    <div className="bg-white/70 rounded-xl p-3 border border-amber-100">
                      <p className="text-xs text-pink-400 font-medium mb-1">
                        {'\uD83D\uDC95'} 家族の温かい言葉
                      </p>
                      {editingId === mission.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className="w-full text-sm border border-pink-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                            rows={2}
                            placeholder="おめでとう！よくがんばったね..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveMessage(mission.id)}
                              className="flex-1 text-xs bg-pink-400 text-white py-1.5 rounded-lg font-medium hover:bg-pink-500 transition-colors"
                            >
                              保存する
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditMessage('');
                              }}
                              className="text-xs text-slate-400 py-1.5 px-3"
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {mission.familyMessage ? (
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mission.familyMessage}
                            </p>
                          ) : (
                            <p className="text-xs text-slate-300 italic">
                              まだメッセージがありません
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(mission.id);
                              setEditMessage(mission.familyMessage);
                            }}
                            className="mt-1 text-xs text-pink-400 hover:text-pink-500"
                          >
                            {mission.familyMessage ? 'メッセージを編集' : 'メッセージを書く'}{' '}
                            {'\u270F\uFE0F'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delete custom mission */}
                {mission.type === 'custom' && (
                  <button
                    onClick={() => handleDeleteMission(mission.id)}
                    className="mt-2 text-xs text-slate-300 hover:text-red-400 transition-colors"
                  >
                    このミッションを削除
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Mission Form */}
        {showAddForm ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-700">
              {'\u2795'} 新しいミッションを追加
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">ミッション名</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-sm border border-pink-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="例: テストで80点とったらゲーム30分"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">条件（任意）</label>
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="w-full text-sm border border-pink-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="例: テストで80点以上"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMission}
                className="flex-1 bg-gradient-to-r from-pink-400 to-amber-400 text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                追加する
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTitle('');
                  setNewCondition('');
                }}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-slate-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-pink-200 rounded-2xl text-sm text-pink-400 font-medium hover:border-pink-300 hover:text-pink-500 transition-colors"
          >
            {'\u2795'} ミッションを追加する
          </button>
        )}

        {/* Encouragement */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            家族でいっしょに目標を決めて、
            <br />
            がんばりを応援しよう {'\uD83C\uDF38'}
          </p>
        </div>
      </div>
    </div>
  );
}
