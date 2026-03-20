'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CalendarDays, Flame, TrendingUp, Clock, BookOpen,
  PenLine, BarChart3, Users, ChevronRight, Sparkles, Zap,
} from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import CelebrationModal from '@/components/CelebrationModal'
import { dummyUser, dummyExamLogs, dummyCardReviews, dummyVocabLogs, studyDays, dummyEncouragementSettings } from '@/lib/data/dummy-data'
import { encouragementMessages } from '@/lib/data/encouragement-messages'
import { grammarCards } from '@/lib/data/grammar-cards'

export default function DashboardPage() {
  const [showCelebration, setShowCelebration] = useState(false)
  const user = dummyUser
  const settings = dummyEncouragementSettings

  // 試験日までの日数
  const daysUntilExam = useMemo(() => {
    const examDate = new Date(user.exam_date)
    const today = new Date()
    const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }, [user.exam_date])

  // 苦手トップ3
  const weakPoints = useMemo(() => {
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
      .map(([tag, count]) => ({ tag, count }))
  }, [])

  // 今日の復習が必要なカード数
  const dueCards = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return dummyCardReviews.filter(r =>
      r.next_review_at.split('T')[0] <= today && r.result_rating === 'hard'
    ).length
  }, [])

  // 語彙正答率
  const vocabAccuracy = useMemo(() => {
    if (dummyVocabLogs.length === 0) return 0
    const correct = dummyVocabLogs.filter(l => l.is_correct).length
    return Math.round((correct / dummyVocabLogs.length) * 100)
  }, [])

  // 今日のエール
  const todayMessage = useMemo(() => {
    const msgs = encouragementMessages.filter(m => m.tone === settings.tone)
    const idx = new Date().getDate() % msgs.length
    return msgs[idx]
  }, [settings.tone])

  // 今日やるべき3つ
  const dailyTasks = useMemo(() => {
    const tasks = []
    // 苦手カード復習
    if (dueCards > 0) {
      tasks.push({
        id: 't1',
        title: `苦手カード ${dueCards}枚を復習`,
        description: '間隔反復で定着させよう',
        icon: BookOpen,
        link: '/grammar-cards',
        color: 'bg-accent-50 text-accent-600',
      })
    }
    // 今日の語彙20問
    tasks.push({
      id: 't2',
      title: '今日の語彙20問',
      description: `現在の正答率: ${vocabAccuracy}%`,
      icon: PenLine,
      link: '/vocab',
      color: 'bg-primary-50 text-primary-600',
    })
    // 過去問分析
    if (weakPoints.length > 0) {
      tasks.push({
        id: 't3',
        title: '苦手分析を確認',
        description: `${weakPoints[0].tag}が弱点です`,
        icon: BarChart3,
        link: '/analysis',
        color: 'bg-success-50 text-success-600',
      })
    }
    return tasks.slice(0, 3)
  }, [dueCards, vocabAccuracy, weakPoints])

  return (
    <div className="pb-20">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 pt-6 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-100 text-sm">こんにちは</p>
              <h1 className="text-xl font-bold">{user.name}さん</h1>
            </div>
            <Link
              href="/parent"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-3 py-1.5 text-xs transition-colors"
            >
              <Users size={14} />
              親ダッシュボード
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <CalendarDays size={18} className="mx-auto mb-1 text-primary-200" />
              <p className="text-2xl font-bold">{daysUntilExam}</p>
              <p className="text-[10px] text-primary-200">試験まで</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <Flame size={18} className="mx-auto mb-1 text-orange-300" />
              <p className="text-2xl font-bold">{studyDays.consecutiveDays}</p>
              <p className="text-[10px] text-primary-200">連続日数</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <TrendingUp size={18} className="mx-auto mb-1 text-green-300" />
              <p className="text-2xl font-bold">{studyDays.thisWeek.length}</p>
              <p className="text-[10px] text-primary-200">今週の学習日</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* 推しエールカード */}
        {settings.mode !== 'hidden' && todayMessage && (
          <div className="bg-gradient-to-r from-warm-50 to-accent-50 rounded-2xl p-5 border border-warm-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-warm-200 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={24} className="text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  今日のエール
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {todayMessage.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {todayMessage.suggestion}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                href="/vocab"
                className="flex-1 bg-white/80 hover:bg-white text-center text-xs font-medium text-gray-700 py-2.5 rounded-xl transition-colors"
              >
                今日の20問へ
              </Link>
              <Link
                href="/grammar-cards"
                className="flex-1 bg-white/80 hover:bg-white text-center text-xs font-medium text-gray-700 py-2.5 rounded-xl transition-colors"
              >
                苦手カードへ
              </Link>
            </div>
          </div>
        )}

        {/* 3分モード */}
        <Link
          href="/vocab"
          className="block bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-4 hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">3分だけやる</p>
              <p className="text-xs text-primary-200">
                サクッと語彙5問チャレンジ
              </p>
            </div>
            <ChevronRight size={20} className="text-primary-200" />
          </div>
        </Link>

        {/* 今日やるべき3つ */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <Clock size={16} className="text-gray-400" />
            今日やること
          </h2>
          <div className="space-y-2">
            {dailyTasks.map((task) => {
              const Icon = task.icon
              return (
                <Link
                  key={task.id}
                  href={task.link}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* 苦手トップ3 */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3">苦手トップ3</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {weakPoints.map((wp, i) => (
              <div key={wp.tag} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                <span className="text-sm text-gray-700 flex-1">{wp.tag}</span>
                <span className="text-xs text-gray-400">{wp.count}回</span>
              </div>
            ))}
          </div>
        </section>

        {/* 昨日より伸びた項目 */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3">最近の成長</h2>
          <div className="bg-success-50 rounded-2xl p-4 border border-success-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-success-600" />
              <p className="text-sm font-medium text-success-600">語彙力がアップ！</p>
            </div>
            <p className="text-xs text-gray-600">
              今週の語彙正答率が先週より8%上がりました。
              {grammarCards.filter(c => c.category === '時制').length > 0 && '時制の理解も着実に進んでいます。'}
            </p>
          </div>
        </section>

        {/* クイックアクセス */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3">メニュー</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/exam-log"
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <PenLine size={20} className="text-primary-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">過去問記録</p>
              <p className="text-[10px] text-gray-400">ミスを記録しよう</p>
            </Link>
            <Link
              href="/analysis"
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <BarChart3 size={20} className="text-accent-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">苦手分析</p>
              <p className="text-[10px] text-gray-400">弱点を確認</p>
            </Link>
            <Link
              href="/grammar-cards"
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <BookOpen size={20} className="text-green-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">文法カード</p>
              <p className="text-[10px] text-gray-400">中学英語の復習</p>
            </Link>
            <Link
              href="/vocab"
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <Sparkles size={20} className="text-purple-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">語彙20問</p>
              <p className="text-[10px] text-gray-400">デイリーチャレンジ</p>
            </Link>
          </div>
        </section>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="連続5日達成！"
        message="すごい！5日連続で学習してるよ。この調子で続けよう！"
        type="streak"
      />

      <BottomNav />
    </div>
  )
}
