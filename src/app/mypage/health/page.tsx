"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import HealthLatestCards from "@/components/HealthLatestCards";
import HealthTrendChart from "@/components/HealthTrendChart";
import ManualHealthForm from "@/components/ManualHealthForm";

type LatestEntry = {
  tag: string;
  label: string;
  value: string;
  unit: string;
  date: string;
  change: number | null;
};

type HistoryRow = Record<string, string | number | null>;

export default function HealthPage() {
  const [latest, setLatest] = useState<LatestEntry[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [days, setDays] = useState(30);
  const [connected, setConnected] = useState<boolean | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // HealthPlanet APIから取得
      const res = await fetch(`/api/healthplanet/data?days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setLatest(data.latest ?? []);
        setHistory(data.history ?? []);
        setConnected(true);
      } else if (res.status === 404) {
        setConnected(false);
        // DB履歴から取得
        const histRes = await fetch(`/api/health/history?days=${days}`);
        if (histRes.ok) {
          const histData = await histRes.json();
          if (histData.measurements?.length > 0) {
            // health_measurements → HistoryRow 変換
            setHistory(
              histData.measurements.map(
                (m: Record<string, string | number | null>) => ({
                  date: (m.measured_at as string).split("T")[0],
                  weight_kg: m.weight_kg,
                  body_fat_pct: m.body_fat_pct,
                  muscle_mass_kg: m.muscle_mass_kg,
                  muscle_score: m.muscle_score,
                  visceral_fat_level: m.visceral_fat_level,
                  basal_metabolic_rate: m.basal_metabolic_rate,
                  body_age: m.body_age,
                  bone_mass_kg: m.bone_mass_kg,
                })
              )
            );
          }
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch(`/api/healthplanet/data?days=${days}&sync=true`);
      await fetchData();
    } catch {
      // silent
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <section className="pt-32 pb-8 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            BODY COMPOSITION
          </p>
          <h1 className="text-3xl font-bold text-gray-900">体組成データ</h1>
          <p className="text-sm text-stone-500 mt-2">
            TANITAの体組成計データや手動記録を可視化します。
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8 pt-8 space-y-8">
          {/* アクションバー */}
          <div className="flex flex-wrap items-center gap-3">
            {connected && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 bg-[#1B6B7A] text-white rounded-lg text-xs font-medium hover:bg-[#155a67] transition-colors disabled:opacity-50"
              >
                {syncing ? "同期中..." : "🔄 TANITAから同期"}
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 border border-[#1B6B7A] text-[#1B6B7A] rounded-lg text-xs font-medium hover:bg-[#1B6B7A]/5 transition-colors"
            >
              ✏️ 手動で記録
            </button>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="ml-auto px-3 py-2 border border-stone-300 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-[#1B6B7A]"
            >
              <option value={7}>過去7日</option>
              <option value={30}>過去30日</option>
              <option value={90}>過去90日</option>
              <option value={180}>過去180日</option>
              <option value={365}>過去1年</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm text-stone-400">読み込み中...</p>
            </div>
          ) : (
            <>
              {/* HealthPlanet未連携の案内 */}
              {connected === false && history.length === 0 && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <p className="text-sm text-amber-800 mb-3">
                    HealthPlanet（TANITA）と連携すると、体組成データが自動で取り込まれます。
                  </p>
                  <Link
                    href="/api/healthplanet/auth"
                    className="inline-block px-4 py-2 bg-[#1B6B7A] text-white rounded-lg text-xs font-medium hover:bg-[#155a67] transition-colors"
                  >
                    🏥 HealthPlanet と連携する
                  </Link>
                  <p className="text-xs text-amber-600 mt-3">
                    または下の「手動で記録」ボタンから直接入力できます。
                  </p>
                </div>
              )}

              {/* 最新値カード */}
              {latest.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-4">
                    最新の測定値
                  </h2>
                  <HealthLatestCards data={latest} />
                </div>
              )}

              {/* トレンドチャート */}
              {history.length > 1 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-4">
                    トレンド
                  </h2>
                  <HealthTrendChart history={history} />
                </div>
              )}

              {/* 履歴テーブル */}
              {history.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-4">
                    測定履歴
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-stone-200">
                          <th className="text-left py-2 pr-3 text-stone-400 font-medium">
                            日付
                          </th>
                          <th className="text-right py-2 px-2 text-stone-400 font-medium">
                            体重
                          </th>
                          <th className="text-right py-2 px-2 text-stone-400 font-medium">
                            体脂肪
                          </th>
                          <th className="text-right py-2 px-2 text-stone-400 font-medium">
                            筋肉量
                          </th>
                          <th className="text-right py-2 pl-2 text-stone-400 font-medium">
                            基礎代謝
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...history].reverse().map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-stone-100 hover:bg-stone-50"
                          >
                            <td className="py-2.5 pr-3 text-stone-600">
                              {formatDateJa(row.date as string)}
                            </td>
                            <td className="py-2.5 px-2 text-right font-medium text-gray-900">
                              {row.weight_kg != null
                                ? `${Number(row.weight_kg).toFixed(1)}`
                                : "-"}
                            </td>
                            <td className="py-2.5 px-2 text-right font-medium text-gray-900">
                              {row.body_fat_pct != null
                                ? `${Number(row.body_fat_pct).toFixed(1)}%`
                                : "-"}
                            </td>
                            <td className="py-2.5 px-2 text-right font-medium text-gray-900">
                              {row.muscle_mass_kg != null
                                ? `${Number(row.muscle_mass_kg).toFixed(1)}`
                                : "-"}
                            </td>
                            <td className="py-2.5 pl-2 text-right font-medium text-gray-900">
                              {row.basal_metabolic_rate != null
                                ? `${row.basal_metabolic_rate}`
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* データなし */}
              {latest.length === 0 && history.length === 0 && connected !== false && (
                <div className="text-center py-12 border border-dashed border-stone-300 rounded-lg">
                  <p className="text-stone-500 text-sm mb-2">
                    体組成データがまだありません
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-xs text-[#1B6B7A] hover:opacity-70"
                  >
                    ✏️ 最初のデータを記録する
                  </button>
                </div>
              )}
            </>
          )}

          {/* 手動入力フォーム */}
          {showForm && (
            <ManualHealthForm
              onClose={() => setShowForm(false)}
              onSaved={() => {
                setShowForm(false);
                fetchData();
              }}
            />
          )}

          {/* 戻るリンク */}
          <div className="pt-8 border-t border-stone-200">
            <Link
              href="/mypage"
              className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function formatDateJa(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });
}
