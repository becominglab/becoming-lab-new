'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  CheckCircle, Flame, TrendingUp, TrendingDown, Heart,
  MessageCircle, CalendarDays, BookOpen, ArrowLeft,
} from 'lucide-react'
import { dummyUser, dummyExamLogs, dummyVocabLogs, dummyCardReviews, studyDays } from '@/lib/data/dummy-data'
import { grammarCards } from '@/lib/data/grammar-cards'

export default function ParentPage() {
  const child = dummyUser

  // 今日やったか
  const didStudyToday = studyDays.thisWeek.includes(new Date().toISOString().split('T')[0])

  // 語彙正答率の推移
  const vocabAccuracy = useMemo(() => {
    if (dummyVocabLogs.length === 0) return 0
    const correct = dummyVocabLogs.filter(l => l.is_correct).length
    return Math.round((correct / dummyVocabLogs.length) * 100)
  }, [])

  // 苦手分野
  const weakAreas = useMemo(() => {
    const missTagCount: Record<string, number> = {}
    dummyExamLogs.forEach(log => {
      if (!log.is_correct) {
        log.miss_tags.forEach(tag => {
          missTagCount[tag] = (missTagCount[tag] || 0) + 1
        })
      }
    })
    return Object.entries(missTagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag)
  }, [])

  // 伸びた分野
  const strongAreas = useMemo(() => {
    const easyCards = dummyCardReviews
      .filter(r => r.result_rating === 'easy')
      .map(r => {
        const card = grammarCards.find(c => c.id === r.card_id)
        return card?.category
      })
      .filter((c): c is string => !!c)
    return [...new Set(easyCards)].slice(0, 3)
  }, [])

  // 試験日まで
  const daysUntilExam = useMemo(() => {
    const examDate = new Date(child.exam_date)
    const today = new Date()
    return Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  }, [child.exam_date])

  // 褒めポイント
  const praisePoints = useMemo(() => {
    const points = []
    if (studyDays.consecutiveDays >= 3) {
      points.push(`${studyDays.consecutiveDays}日連続で学習しています！継続力がすごいです。`)
    }
    if (vocabAccuracy >= 70) {
      points.push(`語彙の正答率が${vocabAccuracy}%です。よく頑張っています。`)
    }
    if (strongAreas.length > 0) {
      points.push(`${strongAreas.join('、')}の分野はしっかり理解できています。`)
    }
    if (studyDays.thisWeek.length >= 4) {
      points.push(`今週${studyDays.thisWeek.length}日も学習しています。`)
    }
    if (points.length === 0) {
      points.push('アプリを使って学習に取り組んでいること自体が素晴らしいです。')
    }
    return points
  }, [vocabAccuracy, strongAreas])

  // 声かけヒント
  const voiceHints = useMemo(() => {
    const hints = []
    if (!didStudyToday) {
      hints.push('「今日はまだやってないみたいだけど、3分だけやってみない？」')
    }
    if (weakAreas.includes('語彙不足')) {
      hints.push('「語彙は毎日少しずつ覚えるのが一番だよ。今日の20問やってみよう！」')
    }
    if (studyDays.consecutiveDays >= 5) {
      hints.push(`「${studyDays.consecutiveDays}日連続ってすごいね！その調子！」`)
    }
    hints.push('「がんばってるのちゃんと見てるよ。応援してるからね。」')
    return hints
  }, [didStudyToday, weakAreas])

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 pt-6 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="p-1 rounded-lg hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold">親ダッシュボード</h1>
          </div>
          <p className="text-purple-200 text-sm">{child.name}さんの学習状況</p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <CalendarDays size={18} className="mx-auto mb-1 text-purple-200" />
              <p className="text-2xl font-bold">{daysUntilExam}</p>
              <p className="text-[10px] text-purple-200">試験まで</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <Flame size={18} className="mx-auto mb-1 text-orange-300" />
              <p className="text-2xl font-bold">{studyDays.consecutiveDays}</p>
              <p className="text-[10px] text-purple-200">連続日数</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <BookOpen size={18} className="mx-auto mb-1 text-green-300" />
              <p className="text-2xl font-bold">{studyDays.thisWeek.length}</p>
              <p className="text-[10px] text-purple-200">今週の学習</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* 今日の状態 */}
        <div className={`rounded-2xl p-4 border ${
          didStudyToday
            ? 'bg-success-50 border-success-100'
            : 'bg-warm-50 border-warm-200'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle
              size={24}
              className={didStudyToday ? 'text-success-600' : 'text-yellow-500'}
              fill={didStudyToday ? 'currentColor' : 'none'}
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {didStudyToday ? '今日の学習済み' : 'まだ今日の学習をしていません'}
              </p>
              <p className="text-xs text-gray-500">
                {didStudyToday
                  ? 'がんばっています！'
                  : '声をかけてみましょう'}
              </p>
            </div>
          </div>
        </div>

        {/* 伸びた分野 */}
        {strongAreas.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-success-600" />
              伸びた分野
            </h3>
            <div className="flex flex-wrap gap-2">
              {strongAreas.map(area => (
                <span
                  key={area}
                  className="px-3 py-1.5 bg-success-50 text-success-600 rounded-full text-xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 苦手分野 */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <TrendingDown size={16} className="text-red-400" />
            苦手分野
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakAreas.map(area => (
              <span
                key={area}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-medium"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            これらの分野を重点的に復習するとスコアが伸びやすいです。
          </p>
        </section>

        {/* 褒めポイント */}
        <section className="bg-gradient-to-r from-warm-50 to-accent-50 rounded-2xl border border-warm-200 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <Heart size={16} className="text-pink-500" fill="currentColor" />
            褒めポイント
          </h3>
          <div className="space-y-2">
            {praisePoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">★</span>
                <p className="text-sm text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 声かけヒント */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <MessageCircle size={16} className="text-primary-500" />
            声かけヒント
          </h3>
          <div className="space-y-3">
            {voiceHints.map((hint, i) => (
              <div key={i} className="bg-primary-50 rounded-xl p-3">
                <p className="text-sm text-gray-700 italic">{hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 学習データ概要 */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">学習データ</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">語彙正答率</p>
              <p className="text-xl font-bold text-primary-600">{vocabAccuracy}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">累計学習日</p>
              <p className="text-xl font-bold text-gray-700">{studyDays.totalStudyDays}日</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">過去問記録数</p>
              <p className="text-xl font-bold text-gray-700">{dummyExamLogs.length}問</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">カード復習数</p>
              <p className="text-xl font-bold text-gray-700">{dummyCardReviews.length}回</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
