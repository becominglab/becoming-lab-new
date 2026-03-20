'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import type { UserType } from '@/lib/nobishiro/types';

const users = [
  {
    id: 'mitsuki' as UserType,
    name: 'みつき',
    grade: '新中3',
    goal: '都立高校合格に向けて',
    emoji: '📘',
    theme: 'junior' as const,
    bgFrom: 'from-indigo-50',
    bgTo: 'to-slate-50',
    border: 'border-indigo-200',
    accent: 'text-indigo-600',
    btnBg: 'bg-indigo-500',
    subjects: '数学・英語・国語・理科・社会',
  },
  {
    id: 'michiru' as UserType,
    name: 'みちる',
    grade: '新小6',
    goal: '大妻中学合格に向けて',
    emoji: '🌟',
    theme: 'elementary' as const,
    bgFrom: 'from-emerald-50',
    bgTo: 'to-amber-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
    btnBg: 'bg-emerald-500',
    subjects: '算数・国語・理科・社会',
  },
];

function UserSelectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<UserType | null>(null);
  const [confirming, setConfirming] = useState(false);

  // Auto-select from ?user= param (from family top page)
  useEffect(() => {
    const userParam = searchParams.get('user') as UserType | null;
    if (userParam && users.find((u) => u.id === userParam)) {
      setSelected(userParam);
      setConfirming(true);
    }
  }, [searchParams]);

  const handleSelect = (userId: UserType) => {
    setSelected(userId);
    setConfirming(true);
  };

  const handleConfirm = () => {
    if (!selected) return;
    const user = users.find((u) => u.id === selected)!;
    const state = {
      currentUser: selected,
      onboardingDone: true,
      unitProgress: {},
      earnedBadges: [],
      rewards: [
        { id: 'r1', name: '好きなおやつ', badgesRequired: 3, claimed: false },
        { id: 'r2', name: '本屋さんで1冊', badgesRequired: 5, claimed: false },
        { id: 'r3', name: '家族でカフェ', badgesRequired: 7, claimed: false },
        { id: 'r4', name: 'おでかけ', badgesRequired: 10, claimed: false },
        { id: 'r5', name: '特別体験', badgesRequired: 20, claimed: false },
      ],
      parentComments: [],
      dailyLogs: {},
      answerRecords: [],
      reviewSchedules: [],
      streak: 0,
      totalPoints: 0,
      settings: {
        theme: user.theme,
        soundOn: true,
        notificationOn: true,
        characterOn: true,
        parentNotificationOn: true,
      },
    };
    localStorage.setItem('nobishiro-quest', JSON.stringify(state));
    router.push('/nobishiro/home');
  };

  return (
    <div className="flex flex-col min-h-screen px-5 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">だれが使う？</h1>
        <p className="text-sm text-slate-500">自分のカードを選んでね</p>
      </div>

      <div className="flex-1 flex flex-col gap-5 justify-center">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleSelect(user.id)}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
              selected === user.id
                ? `${user.border} bg-gradient-to-br ${user.bgFrom} ${user.bgTo} scale-[1.02] shadow-lg`
                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{user.emoji}</div>
              <div className="flex-1">
                <h2 className={`text-xl font-bold ${selected === user.id ? user.accent : 'text-slate-700'}`}>
                  {user.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{user.grade}</p>
                <p className={`text-sm font-medium mt-1 ${selected === user.id ? user.accent : 'text-slate-600'}`}>
                  {user.goal}
                </p>
                <p className="text-xs text-slate-400 mt-2">{user.subjects}</p>
              </div>
            </div>
            {selected === user.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className={user.accent}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Confirm */}
      {confirming && selected && (
        <div className="mt-6 text-center animate-[fadeIn_0.3s_ease-out]">
          <button
            onClick={handleConfirm}
            className={`px-10 py-4 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ${
              users.find((u) => u.id === selected)!.btnBg
            }`}
          >
            この人ではじめる
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          もどる
        </button>
      </div>
    </div>
  );
}

export default function UserSelectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-2xl">🌀</div></div>}>
      <UserSelectInner />
    </Suspense>
  );
}
