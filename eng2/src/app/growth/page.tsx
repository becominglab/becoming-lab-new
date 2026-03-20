'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Trophy, Star, Flame, Clock, BookOpen, Target,
  ChevronRight, Lock, TrendingUp, Zap, CheckCircle2, Calendar,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import {
  allAchievements, dummyStudySessions, dummyMasteredTopics,
  dummyTotalXp, calculateLevel, xpRules,
} from '@/lib/data/achievements'
import { studyDays } from '@/lib/data/dummy-data'

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'mastered'>('overview')

  const levelInfo = useMemo(() => calculateLevel(dummyTotalXp), [])

  const unlockedBadges = allAchievements.filter(a => a.unlockedAt)
  const lockedBadges = allAchievements.filter(a => !a.unlockedAt)

  // 学習時間の集計
  const totalMinutes = useMemo(
    () => dummyStudySessions.reduce((sum, s) => sum + s.minutes, 0),
    []
  )
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  // 今週の学習時間
  const thisWeekMinutes = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().split('T')[0]
    return dummyStudySessions
      .filter(s => s.date >= weekStr)
      .reduce((sum, s) => sum + s.minutes, 0)
  }, [])

  // 累計問題数
  const totalQuestions = useMemo(
    () => dummyStudySessions.reduce((sum, s) =>
      sum + s.activities.reduce((a, act) => a + act.count, 0), 0),
    []
  )

  // 学習カレンダー（過去14日）
  const calendarDays = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const session = dummyStudySessions.find(s => s.date === dateStr)
      days.push({
        date: dateStr,
        dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][d.getDay()],
        dayNum: d.getDate(),
        minutes: session?.minutes || 0,
        hasActivity: (session?.minutes || 0) > 0,
      })
    }
    return days
  }, [])

  // XP進捗率
  const xpProgress = levelInfo.nextLevelXp > 0
    ? Math.round((levelInfo.xp / levelInfo.nextLevelXp) * 100)
    : 100

  // 最近獲得したバッジ（直近3つ）
  const recentBadges = useMemo(() =>
    [...unlockedBadges]
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 3),
    [unlockedBadges]
  )

  return (
    <div className="pb-20">
      <PageHeader title="成長きろく" showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* レベル & XP カード */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-black">{levelInfo.level}</span>
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-xs">現在のレベル</p>
              <p className="text-lg font-bold">{levelInfo.title}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                  <span>{levelInfo.xp} XP</span>
                  <span>あと {levelInfo.nextLevelXp - levelInfo.xp} XP</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2.5">
                  <div
                    className="bg-white h-2.5 rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20">
            <div className="text-center">
              <p className="text-xl font-bold">{dummyTotalXp}</p>
              <p className="text-[10px] text-white/70">総XP</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{unlockedBadges.length}</p>
              <p className="text-[10px] text-white/70">バッジ</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{studyDays.totalStudyDays}</p>
              <p className="text-[10px] text-white/70">学習日数</p>
            </div>
          </div>
        </div>

        {/* XPの貯め方 */}
        <details className="bg-white rounded-2xl border border-gray-100">
          <summary className="p-4 text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            XPの貯め方
          </summary>
          <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-primary-600">+{xpRules.vocabCorrect}</span> 語彙1問正解
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-primary-600">+{xpRules.vocabComplete}</span> 語彙20問完了
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-primary-600">+{xpRules.grammarReview}</span> カード1枚復習
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-primary-600">+{xpRules.quickTestComplete}</span> テスト完了
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-primary-600">+{xpRules.quickTestPerfect}</span> テスト満点
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="font-bold text-primary-600">+{xpRules.dailyLogin}</span> デイリーログイン
            </div>
          </div>
        </details>

        {/* タブ切替 */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'overview' as const, label: '学習記録' },
            { key: 'badges' as const, label: 'バッジ' },
            { key: 'mastered' as const, label: 'できたこと' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 学習記録タブ */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* 学習サマリー */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <Clock size={20} className="mx-auto text-primary-500 mb-1" />
                <p className="text-2xl font-bold text-gray-800">
                  {totalHours > 0 ? `${totalHours}h` : ''}{remainingMinutes}m
                </p>
                <p className="text-[10px] text-gray-400">累計学習時間</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <BookOpen size={20} className="mx-auto text-green-500 mb-1" />
                <p className="text-2xl font-bold text-gray-800">{totalQuestions}</p>
                <p className="text-[10px] text-gray-400">累計問題数</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <Flame size={20} className="mx-auto text-orange-500 mb-1" />
                <p className="text-2xl font-bold text-gray-800">{studyDays.consecutiveDays}</p>
                <p className="text-[10px] text-gray-400">連続日数</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <Zap size={20} className="mx-auto text-yellow-500 mb-1" />
                <p className="text-2xl font-bold text-gray-800">{thisWeekMinutes}m</p>
                <p className="text-[10px] text-gray-400">今週の学習時間</p>
              </div>
            </div>

            {/* 学習カレンダー */}
            <section className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                <Calendar size={16} className="text-gray-400" />
                学習カレンダー（過去14日）
              </h3>
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map(day => (
                  <div key={day.date} className="text-center">
                    <p className="text-[9px] text-gray-400 mb-0.5">{day.dayOfWeek}</p>
                    <div className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                      day.hasActivity
                        ? day.minutes >= 20
                          ? 'bg-green-500 text-white'
                          : day.minutes >= 10
                            ? 'bg-green-300 text-white'
                            : 'bg-green-100 text-green-700'
                        : 'bg-gray-50 text-gray-300'
                    }`}>
                      <span className="text-xs font-medium">{day.dayNum}</span>
                      {day.hasActivity && (
                        <span className="text-[8px]">{day.minutes}m</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-2 text-[9px] text-gray-400">
                <span className="flex items-center gap-0.5"><span className="w-2.5 h-2.5 rounded bg-gray-50" /> 0m</span>
                <span className="flex items-center gap-0.5"><span className="w-2.5 h-2.5 rounded bg-green-100" /> ~10m</span>
                <span className="flex items-center gap-0.5"><span className="w-2.5 h-2.5 rounded bg-green-300" /> ~20m</span>
                <span className="flex items-center gap-0.5"><span className="w-2.5 h-2.5 rounded bg-green-500" /> 20m+</span>
              </div>
            </section>

            {/* 最近獲得したバッジ */}
            {recentBadges.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <Trophy size={16} className="text-yellow-500" />
                    最近のバッジ
                  </h3>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-xs text-primary-500 flex items-center gap-0.5"
                  >
                    全て見る <ChevronRight size={12} />
                  </button>
                </div>
                <div className="flex gap-3">
                  {recentBadges.map(badge => (
                    <div key={badge.id} className="flex-1 text-center bg-yellow-50 rounded-xl p-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <p className="text-[10px] font-medium text-gray-700 mt-1 line-clamp-1">{badge.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* バッジタブ */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              {unlockedBadges.length} / {allAchievements.length} 達成
            </p>

            {/* 獲得済み */}
            <section>
              <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-500" />
                獲得済み
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {unlockedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="bg-white rounded-xl border border-yellow-200 p-3 text-center"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <p className="text-[10px] font-bold text-gray-700 mt-1 line-clamp-2">{badge.title}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">
                      {new Date(badge.unlockedAt!).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 未獲得 */}
            <section>
              <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Lock size={16} className="text-gray-400" />
                チャレンジ中
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {lockedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center opacity-60"
                  >
                    <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <Lock size={14} className="text-gray-400" />
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 mt-1 line-clamp-2">{badge.title}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">{badge.condition}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* できたことタブ */}
        {activeTab === 'mastered' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <TrendingUp size={24} className="mx-auto text-green-500 mb-1" />
              <p className="text-sm font-bold text-gray-700">
                {dummyMasteredTopics.length}つの分野をマスター！
              </p>
              <p className="text-xs text-gray-400">正答率70%以上が続くとマスター認定</p>
            </div>

            {/* マスター済みリスト */}
            <section className="space-y-2">
              {dummyMasteredTopics.map(topic => (
                <div
                  key={topic.category}
                  className="bg-green-50 rounded-2xl border border-green-100 p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-700">{topic.label}</p>
                    <p className="text-xs text-green-600">
                      正答率 {topic.accuracy}% で達成
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(topic.masteredAt).toLocaleDateString('ja-JP')} にマスター
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* 次に狙えるトピック */}
            <section className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                <Target size={16} className="text-accent-500" />
                次に狙えるトピック
              </h3>
              <div className="space-y-2">
                {[
                  { label: '時制（現在完了・過去完了）', accuracy: 62, remaining: '正答率あと8%!' },
                  { label: '関係代名詞', accuracy: 55, remaining: '正答率あと15%' },
                  { label: '仮定法', accuracy: 45, remaining: 'がんばろう！あと25%' },
                ].map(topic => (
                  <div key={topic.label} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-700">{topic.label}</p>
                        <p className="text-xs text-gray-400">{topic.accuracy}%</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            topic.accuracy >= 60 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${topic.accuracy}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{topic.remaining}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 強化アクション */}
            <Link
              href="/quick-test"
              className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3.5 rounded-xl transition-colors text-center text-sm"
            >
              弱点を克服！クイックテストへ
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
