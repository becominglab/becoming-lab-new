"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RecommendedUsers from "./RecommendedUsers";

export default function NewUserWelcome() {
  const [show, setShow] = useState(false);
  const [followingCount, setFollowingCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/sns/follows?type=following&limit=1")
      .then(r => r.json())
      .then(d => {
        const count = d.following?.length ?? d.count ?? 0;
        setFollowingCount(count);
        setShow(count === 0);
      })
      .catch(() => {});
  }, []);

  if (!show || followingCount === null) return null;

  return (
    <div className="space-y-3">
      {/* ウェルカムバナー */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-4 text-white">
        <p className="text-base font-bold mb-0.5">🌱 ようこそ！まず仲間を見つけよう</p>
        <p className="text-xs opacity-90">同じ習慣を持つ人をフォローすると、フィードに更新が流れてきます</p>
        <div className="flex gap-2 mt-3">
          <Link
            href="/sns/search"
            className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-xl text-center transition-colors"
          >
            🔍 タグで探す
          </Link>
          <Link
            href="/sns/profile"
            className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-xl text-center transition-colors"
          >
            ✏️ プロフィール設定
          </Link>
        </div>
      </div>

      {/* 同タグのおすすめユーザー */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2 px-0.5">同じ習慣の人たち 👇</p>
        <RecommendedUsers />
      </div>
    </div>
  );
}
