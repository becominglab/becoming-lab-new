"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function JoinContent() {
  const searchParams = useSearchParams();
  const vol = searchParams.get("vol") ?? "2";

  const migrateUrl = `/jibun-de-eranda-michi/migrate?vol=${vol}`;
  const loginUrl = `/login?redirect=/jibun-de-eranda-michi/migrate%3Fvol%3D${vol}`;

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="bg-[#1B6B7A] text-white py-12 px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest opacity-70 mb-3">自分で選んだ道</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            vol.{vol}で出会った仲間が<br />ここにいます
          </h1>
          <p className="text-sm opacity-80 leading-relaxed">
            イベントで語り合った仲間と、日々の歩みを続けましょう。
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12 space-y-10">
        {/* SNSの3つの価値 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-800">SNSでできること</h2>
          <div className="grid gap-4">
            <div className="p-5 border border-stone-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-teal-700 text-lg">📝</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-1">習慣記録</p>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    毎日の小さな一歩を記録する。宣言した「道」を着実に歩んでいる自分を確かめよう。
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border border-stone-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-teal-700 text-lg">🤝</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-1">応援</p>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    仲間の更新にリアクションを送る。小さな応援が、継続の力になる。
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border border-stone-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-teal-700 text-lg">👥</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-1">仲間</p>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    vol.{vol}の参加者専用サークルに参加。同じ夜に語り合った仲間と、ここで繋がり続ける。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href={loginUrl}
            className="block w-full py-4 bg-teal-600 text-white text-center font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            仲間と続ける（無料）
          </Link>
          <Link
            href={migrateUrl}
            className="block w-full py-3 text-teal-600 text-center text-sm font-medium border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors"
          >
            すでにアカウントがある方
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <JoinContent />
    </Suspense>
  );
}
