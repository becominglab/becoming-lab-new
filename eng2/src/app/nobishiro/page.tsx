'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Check if already onboarded
    try {
      const stored = localStorage.getItem('nobishiro-quest');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.onboardingDone && state.currentUser) {
          router.replace('/nobishiro/home');
          return;
        }
      }
    } catch {}

    const t1 = setTimeout(() => setShow(true), 200);
    const t2 = setTimeout(() => setShowText(true), 800);
    const t3 = setTimeout(() => setShowButton(true), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [router]);

  const handleStart = () => {
    router.push('/nobishiro/select');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      {/* Island / Map Animation */}
      <div
        className={`mb-8 transition-all duration-1000 ease-out ${
          show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'
        }`}
      >
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-sky-200 rounded-full animate-pulse opacity-30" />
          <div className="absolute inset-4 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-1">🏝️</div>
              <div className="text-xs text-emerald-800 font-medium">学びの島</div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute -bottom-1 -left-3 text-xl animate-bounce" style={{ animationDelay: '1s' }}>🌱</div>
          <div className="absolute top-1/4 -right-4 text-lg animate-bounce" style={{ animationDelay: '1.5s' }}>🎯</div>
        </div>
      </div>

      {/* Title */}
      <div
        className={`transition-all duration-700 ease-out ${
          showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
          のびしろクエスト
        </h1>
        <p className="text-lg text-amber-600 font-medium mb-4">
          まちがいは、のびしろ。
        </p>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          春休みに、これまでの勉強を楽しく振り返りながら、
          <br />
          受験学年の自信をつくるアプリです。
        </p>
      </div>

      {/* CTA Button */}
      <div
        className={`mt-10 transition-all duration-500 ease-out ${
          showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button
          onClick={handleStart}
          className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold rounded-full shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          はじめる
        </button>
      </div>

      {/* Bottom decorative dots */}
      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>
    </div>
  );
}
