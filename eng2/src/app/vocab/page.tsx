'use client'

import { useState, useMemo, useCallback } from 'react'
import { Check, X, RotateCcw, Filter } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import CelebrationModal from '@/components/CelebrationModal'
import { vocabItems } from '@/lib/data/vocab-items'
import { dummyVocabLogs } from '@/lib/data/dummy-data'
import type { VocabLog } from '@/lib/types'

type FilterType = 'daily' | 'mistakes' | 'weak' | 'idioms'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function VocabPage() {
  const [logs, setLogs] = useState<VocabLog[]>(dummyVocabLogs)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [filterType, setFilterType] = useState<FilterType>('daily')
  const [showFilter, setShowFilter] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // フィルタリングされた語彙
  const filteredVocab = useMemo(() => {
    let items = vocabItems
    if (filterType === 'mistakes') {
      const wrongIds = logs.filter(l => !l.is_correct).map(l => l.vocab_id)
      items = items.filter(v => wrongIds.includes(v.id))
    } else if (filterType === 'idioms') {
      items = items.filter(v => v.type === 'idiom' || v.type === 'phrase')
    } else if (filterType === 'daily') {
      // 今日の20問: シードで固定
      const seed = new Date().getDate()
      const shuffled = [...items].sort((a, b) => {
        const ha = a.id.charCodeAt(1) * seed
        const hb = b.id.charCodeAt(1) * seed
        return ha - hb
      })
      items = shuffled.slice(0, 20)
    }
    return items
  }, [filterType, logs])

  const currentVocab = filteredVocab[currentIndex]

  // 選択肢を生成
  const choices = useMemo(() => {
    if (!currentVocab) return []
    const correct = currentVocab.meaning
    const distractors = currentVocab.distractors.slice(0, 3)
    return shuffleArray([correct, ...distractors])
  }, [currentVocab])

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentVocab) return
    setSelectedAnswer(answer)
    setShowResult(true)

    const isCorrect = answer === currentVocab.meaning
    setSessionTotal(prev => prev + 1)
    if (isCorrect) setSessionCorrect(prev => prev + 1)

    setLogs(prev => [...prev, {
      id: `vl-new-${Date.now()}`,
      user_id: 'user-1',
      vocab_id: currentVocab.id,
      is_correct: isCorrect,
      reviewed_at: new Date().toISOString(),
    }])
  }, [showResult, currentVocab])

  const handleNext = useCallback(() => {
    setSelectedAnswer(null)
    setShowResult(false)
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // 全問完了
      setShowCelebration(true)
    }
  }, [currentIndex, filteredVocab.length])

  const resetSession = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setSessionCorrect(0)
    setSessionTotal(0)
  }

  // 全体正答率
  const overallAccuracy = useMemo(() => {
    if (logs.length === 0) return 0
    return Math.round((logs.filter(l => l.is_correct).length / logs.length) * 100)
  }, [logs])

  return (
    <div className="pb-20">
      <PageHeader
        title="英検2級 語彙"
        showBack
        rightElement={
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter size={18} className="text-gray-600" />
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* フィルター */}
        {showFilter && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500 mb-2">学習モード</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: 'daily' as FilterType, label: '今日の20問' },
                { key: 'mistakes' as FilterType, label: '間違えた問題' },
                { key: 'weak' as FilterType, label: '苦手語彙' },
                { key: 'idioms' as FilterType, label: '熟語だけ' },
              ]).map(f => (
                <button
                  key={f.key}
                  onClick={() => { setFilterType(f.key); resetSession() }}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    filterType === f.key
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* スコア */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">進捗</p>
            <p className="text-lg font-bold text-gray-700">
              {currentIndex + (showResult && currentIndex === filteredVocab.length - 1 ? 1 : 0)}/{filteredVocab.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">今回の正答</p>
            <p className="text-lg font-bold text-success-600">{sessionCorrect}/{sessionTotal}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">累計正答率</p>
            <p className="text-lg font-bold text-primary-600">{overallAccuracy}%</p>
          </div>
          <button
            onClick={resetSession}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw size={16} className="text-gray-500" />
          </button>
        </div>

        {/* 問題 */}
        {filteredVocab.length > 0 && currentVocab ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">
                  {currentVocab.type === 'word' ? '単語' : currentVocab.type === 'phrase' ? '句動詞' : '熟語'}
                </span>
                <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-[10px]">
                  {currentVocab.level}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentVocab.word}</h2>
              {showResult && (
                <p className="text-xs text-gray-400 italic">{currentVocab.example_sentence}</p>
              )}
            </div>

            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-500 mb-2">意味を選んでください</p>
              {choices.map((choice, i) => {
                let btnClass = 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-100'
                if (showResult) {
                  if (choice === currentVocab.meaning) {
                    btnClass = 'bg-success-50 text-success-600 border-success-500'
                  } else if (choice === selectedAnswer && choice !== currentVocab.meaning) {
                    btnClass = 'bg-red-50 text-red-600 border-red-400'
                  } else {
                    btnClass = 'bg-gray-50 text-gray-400 border-gray-100'
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(choice)}
                    disabled={showResult}
                    className={`w-full py-3.5 px-4 rounded-xl border text-sm font-medium transition-all text-left ${btnClass}`}
                  >
                    <span className="flex items-center gap-2">
                      {showResult && choice === currentVocab.meaning && <Check size={16} className="text-success-600 shrink-0" />}
                      {showResult && choice === selectedAnswer && choice !== currentVocab.meaning && <X size={16} className="text-red-500 shrink-0" />}
                      {choice}
                    </span>
                  </button>
                )
              })}
            </div>

            {showResult && (
              <div className="p-4 border-t border-gray-50">
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
                >
                  {currentIndex < filteredVocab.length - 1 ? '次の問題へ' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-500 text-sm">
              {filterType === 'mistakes' ? '間違えた問題はありません！すごい！' : '語彙データがありません'}
            </p>
          </div>
        )}
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={`語彙${filteredVocab.length}問完了！`}
        message={`正答率 ${sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0}%！${sessionCorrect >= sessionTotal * 0.8 ? 'すばらしい結果だよ！' : 'くり返し復習して覚えていこう！'}`}
        type="vocab"
      />

      <BottomNav />
    </div>
  )
}
