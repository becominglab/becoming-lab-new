'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState, Theme } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

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

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded — silently ignore
  }
}

const USERS: Record<string, { name: string; grade: string }> = {
  mitsuki: { name: 'みつき', grade: '中1' },
  michiru: { name: 'みちる', grade: '小4' },
};

// ---------------------------------------------------------------------------
// Toggle Switch Component
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
  color = 'bg-pink-400',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
        checked ? color : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (!s || !s.currentUser) {
      router.replace('/mm');
      return;
    }
    setState(s);
  }, [router]);

  const updateSetting = useCallback(
    <K extends keyof AppState['settings']>(key: K, value: AppState['settings'][K]) => {
      setState((prev) => {
        if (!prev) return prev;
        const next: AppState = {
          ...prev,
          settings: { ...prev.settings, [key]: value },
        };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const handleThemeToggle = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const newTheme: Theme = prev.settings.theme === 'junior' ? 'elementary' : 'junior';
      const next: AppState = {
        ...prev,
        settings: { ...prev.settings, theme: newTheme },
      };
      saveState(next);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('nobishiro-quest-family-missions');
    router.replace('/mm');
  }, [router]);

  const handleSwitchUser = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next: AppState = { ...prev, currentUser: null };
      saveState(next);
      return next;
    });
    router.replace('/mm/select');
  }, [router]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin text-2xl">{'\uD83C\uDF00'}</div>
      </div>
    );
  }

  const user = state.currentUser ? USERS[state.currentUser] : null;
  const isJunior = state.settings.theme === 'junior';
  const themeColor = isJunior ? 'bg-indigo-400' : 'bg-emerald-400';
  const themeLabel = isJunior ? '中学生（インディゴ）' : '小学生（エメラルド）';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/mm/home')}
            className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-lg"
            aria-label="Back"
          >
            {'\u2190'}
          </button>
          <h1 className="text-lg font-bold text-slate-700 flex-1">
            {'\u2699\uFE0F'} せってい
          </h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-4 flex-1">
        {/* User Info */}
        {user && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-amber-200 flex items-center justify-center text-xl">
                {state.currentUser === 'mitsuki' ? '\uD83E\uDD89' : '\uD83D\uDC31'}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-400">{user.grade}</p>
              </div>
              <button
                onClick={handleSwitchUser}
                className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium hover:bg-slate-200 transition-colors"
              >
                ユーザー切り替え
              </button>
            </div>
          </div>
        )}

        {/* Settings List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{'\uD83C\uDFA8'}</span>
              <div>
                <p className="text-sm font-medium text-slate-700">テーマ切り替え</p>
                <p className="text-xs text-slate-400 mt-0.5">{themeLabel}</p>
              </div>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`px-3 py-1.5 rounded-full text-xs font-bold text-white transition-colors duration-300 ${themeColor}`}
            >
              {isJunior ? '中学生' : '小学生'}
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{'\uD83D\uDD0A'}</span>
              <p className="text-sm font-medium text-slate-700">音 ON/OFF</p>
            </div>
            <Toggle
              checked={state.settings.soundOn}
              onChange={(v) => updateSetting('soundOn', v)}
            />
          </div>

          {/* Notification */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{'\uD83D\uDD14'}</span>
              <p className="text-sm font-medium text-slate-700">通知 ON/OFF</p>
            </div>
            <Toggle
              checked={state.settings.notificationOn}
              onChange={(v) => updateSetting('notificationOn', v)}
            />
          </div>

          {/* Character */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{'\uD83D\uDCAC'}</span>
              <p className="text-sm font-medium text-slate-700">キャラクター表示 ON/OFF</p>
            </div>
            <Toggle
              checked={state.settings.characterOn}
              onChange={(v) => updateSetting('characterOn', v)}
            />
          </div>

          {/* Parent Notification */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{'\uD83D\uDC8C'}</span>
              <p className="text-sm font-medium text-slate-700">親コメント通知 ON/OFF</p>
            </div>
            <Toggle
              checked={state.settings.parentNotificationOn}
              onChange={(v) => updateSetting('parentNotificationOn', v)}
            />
          </div>
        </div>

        {/* Data Reset */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setShowResetDialog(true)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left"
          >
            <span className="text-lg">{'\uD83D\uDDD1\uFE0F'}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-500">データ初期化</p>
              <p className="text-xs text-slate-400 mt-0.5">
                すべての学習データを削除します
              </p>
            </div>
            <span className="text-slate-300">{'\u203A'}</span>
          </button>
        </div>

        {/* App info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-slate-300">のびしろクエスト v1.0</p>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{'\u26A0\uFE0F'}</div>
              <h2 className="text-base font-bold text-slate-700">本当にリセットしますか？</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                すべてのデータが消えます。
                <br />
                この操作は元に戻せません。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetDialog(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
              >
                リセットする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
