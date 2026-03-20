'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState, Mission } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function buildMissions(isMitsuki: boolean): Mission[] {
  const mathSubject = isMitsuki ? '数学' : '算数';
  return [
    {
      id: `mission-quiz-math-${getToday()}`,
      type: 'quiz',
      title: `${mathSubject}クイズ 3問`,
      subject: mathSubject,
      questionCount: 3,
      completed: false,
    },
    {
      id: `mission-quiz-kokugo-${getToday()}`,
      type: 'quiz',
      title: '国語クイズ 3問',
      subject: '国語',
      questionCount: 3,
      completed: false,
    },
    {
      id: `mission-reflection-${getToday()}`,
      type: 'reflection',
      title: '今日の気づき1つ',
      completed: false,
    },
  ];
}

function getMissionIcon(type: Mission['type']) {
  if (type === 'reflection') return '💭';
  return '✏️';
}

export default function MissionPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);

      const isMitsuki = s.currentUser === 'mitsuki';
      const todayStr = getToday();
      const todayLog = s.dailyLogs[todayStr];

      const baseMissions = buildMissions(isMitsuki);

      // Check localStorage for per-mission completion tracking
      const completedKey = `nobishiro-missions-${todayStr}`;
      const completedRaw = localStorage.getItem(completedKey);
      const completedIds: string[] = completedRaw ? JSON.parse(completedRaw) : [];

      const hydratedMissions = baseMissions.map((m) => ({
        ...m,
        completed: completedIds.includes(m.id),
      }));

      setMissions(hydratedMissions);

      if (hydratedMissions.every((m) => m.completed)) {
        setShowCelebration(true);
      }
    } catch {
      router.replace('/mm');
    }
  }, [router]);

  const handleMissionTap = useCallback(
    (mission: Mission) => {
      if (mission.completed) return;
      if (mission.type === 'quiz' && mission.subject) {
        router.push(
          `/mm/quiz?subject=${encodeURIComponent(mission.subject)}&count=${mission.questionCount ?? 3}&missionId=${encodeURIComponent(mission.id)}`
        );
      } else if (mission.type === 'reflection') {
        router.push(`/mm/review?missionId=${encodeURIComponent(mission.id)}`);
      }
    },
    [router]
  );

  const handleExtraPractice = useCallback(() => {
    if (!state) return;
    const isMitsuki = state.currentUser === 'mitsuki';
    const subject = isMitsuki ? '数学' : '算数';
    router.push(`/mm/quiz?subject=${encodeURIComponent(subject)}&count=3`);
  }, [router, state]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const isMitsuki = state.currentUser === 'mitsuki';
  const accentBg = isMitsuki ? 'bg-indigo-500' : 'bg-emerald-500';
  const accentText = isMitsuki ? 'text-indigo-600' : 'text-emerald-600';
  const accentBorder = isMitsuki ? 'border-indigo-200' : 'border-emerald-200';
  const accentLight = isMitsuki ? 'bg-indigo-50' : 'bg-emerald-50';
  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';

  const allDone = missions.length > 0 && missions.every((m) => m.completed);
  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-6 rounded-b-3xl`}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push('/mm/home')}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
          >
            ←
          </button>
          <h1 className="text-white text-lg font-bold flex-1">今日のミッション</h1>
        </div>
        <p className="text-white/80 text-sm ml-12">
          これだけやればOK！3つクリアしよう
        </p>
        {/* Progress */}
        <div className="mt-4 flex items-center gap-3 ml-12">
          <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${missions.length > 0 ? (completedCount / missions.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-white text-sm font-bold">{completedCount}/{missions.length}</span>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-3">
        {/* Mission Cards */}
        {missions.map((mission, idx) => (
          <button
            key={mission.id}
            onClick={() => handleMissionTap(mission)}
            disabled={mission.completed}
            className={`w-full rounded-2xl p-5 text-left shadow-sm transition-all duration-200 ${
              mission.completed
                ? 'bg-green-50 border-2 border-green-200'
                : `bg-white border-2 ${accentBorder} hover:shadow-md active:scale-[0.98]`
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  mission.completed ? 'bg-green-100' : accentLight
                }`}
              >
                {mission.completed ? '✅' : getMissionIcon(mission.type)}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-medium mb-0.5">
                  ミッション {idx + 1}
                </p>
                <p
                  className={`text-base font-bold ${
                    mission.completed ? 'text-green-700' : 'text-slate-700'
                  }`}
                >
                  {mission.title}
                </p>
                {mission.completed && (
                  <p className="text-xs text-green-500 mt-1 font-medium">クリア済み！</p>
                )}
              </div>
              {!mission.completed && (
                <div className={`${accentText} text-xl`}>→</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Celebration */}
      {showCelebration && allDone && (
        <div className="px-5 mt-6 space-y-4">
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-center overflow-hidden">
            {/* Confetti-like decoration */}
            <div className="absolute inset-0 pointer-events-none">
              {['🎉', '⭐', '✨', '🎊', '💫', '🌟'].map((emoji, i) => (
                <span
                  key={i}
                  className="absolute animate-bounce text-xl"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${5 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <div className="relative z-10">
              <p className="text-4xl mb-3">🏆</p>
              <h2 className="text-xl font-bold text-amber-700 mb-2">
                今日のミッション完了！
              </h2>
              <p className="text-sm text-amber-600">
                すごい！今日もしっかり取り組んだね！
              </p>
            </div>
          </div>

          <button
            onClick={handleExtraPractice}
            className={`w-full bg-gradient-to-r ${gradFrom} ${gradTo} text-white rounded-2xl py-4 text-base font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
          >
            もう1回やる 💪
          </button>

          <button
            onClick={() => router.push('/mm/home')}
            className="w-full bg-white border-2 border-slate-200 text-slate-600 rounded-2xl py-4 text-base font-bold hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            ホームにもどる 🏠
          </button>
        </div>
      )}

      {/* Bottom hint when not all done */}
      {!allDone && (
        <div className="px-5 mt-auto pt-6">
          <p className="text-center text-sm text-slate-400">
            タップしてミッションを始めよう！
          </p>
        </div>
      )}
    </div>
  );
}
