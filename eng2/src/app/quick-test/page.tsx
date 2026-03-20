'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Timer, Check, X, ChevronRight, RotateCcw, Trophy, Zap, Home } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { quickTestQuestions, questionCategories, type QuickTestQuestion } from '@/lib/data/quick-test-questions'

const QUESTION_COUNT = 8
const TIME_LIMIT = 180 // 3分 = 180秒

// シャッフル関数（Fisher-Yates）
function shuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array]
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function QuickTestPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">読み込み中...</p></div>}>
      <QuickTestPage />
    </Suspense>
  )
}

function QuickTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoriesParam = searchParams.get('categories')

  // フィルタリングされたカテゴリ
  const targetCategories = useMemo(() => {
    if (!categoriesParam) return null
    return categoriesParam.split(',')
  }, [categoriesParam])

  // 問題の選択
  const questions = useMemo(() => {
    let pool = quickTestQuestions
    if (targetCategories && targetCategories.length > 0) {
      pool = quickTestQuestions.filter(q => targetCategories.includes(q.category))
    }
    // 問題が足りなければ全体から補充
    if (pool.length < QUESTION_COUNT) {
      const remaining = quickTestQuestions.filter(q => !pool.includes(q))
      pool = [...pool, ...remaining]
    }
    const seed = new Date().getDate() + new Date().getHours()
    return shuffle(pool, seed).slice(0, QUESTION_COUNT)
  }, [targetCategories])

  const [phase, setPhase] = useState<'ready' | 'quiz' | 'result'>('ready')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([])
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [isTimerActive, setIsTimerActive] = useState(false)

  // タイマー
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerActive(false)
          setPhase('result')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerActive, timeLeft])

  const currentQuestion: QuickTestQuestion | undefined = questions[currentIndex]

  const handleStart = () => {
    setPhase('quiz')
    setCurrentIndex(0)
    setAnswers([])
    setTimeLeft(TIME_LIMIT)
    setIsTimerActive(true)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleSelectAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)

    const isCorrect = index === currentQuestion!.correctIndex
    setAnswers(prev => [
      ...prev,
      { questionId: currentQuestion!.id, selected: index, correct: isCorrect },
    ])
  }, [selectedAnswer, currentQuestion])

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsTimerActive(false)
      setPhase('result')
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRetry = () => {
    setPhase('ready')
    setCurrentIndex(0)
    setAnswers([])
    setTimeLeft(TIME_LIMIT)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  // 結果集計
  const correctCount = answers.filter(a => a.correct).length
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0

  // カテゴリ別結果
  const categoryResults = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {}
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId)
      if (!question) continue
      if (!map[question.category]) {
        map[question.category] = { total: 0, correct: 0 }
      }
      map[question.category].total += 1
      if (answer.correct) map[question.category].correct += 1
    }
    return map
  }, [answers, questions])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getCategoryLabel = (catId: string) => {
    return questionCategories.find(c => c.id === catId)?.label || catId
  }

  const getCategoryIcon = (catId: string) => {
    return questionCategories.find(c => c.id === catId)?.icon || '?'
  }

  return (
    <div className="pb-6 min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <PageHeader
        title="3分クイックテスト"
        showBack
        rightElement={
          phase === 'quiz' ? (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
              timeLeft <= 30 ? 'bg-red-100 text-red-600 animate-pulse' :
              timeLeft <= 60 ? 'bg-orange-100 text-orange-600' :
              'bg-primary-100 text-primary-600'
            }`}>
              <Timer size={14} />
              {formatTime(timeLeft)}
            </div>
          ) : undefined
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* 準備画面 */}
        {phase === 'ready' && (
          <div className="text-center py-8 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 rounded-full">
              <Zap size={36} className="text-accent-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">3分クイックテスト</h2>
              <p className="text-sm text-gray-500">
                {targetCategories
                  ? `弱点カテゴリ ${targetCategories.length}分野から出題`
                  : '全カテゴリからランダム出題'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                  {QUESTION_COUNT}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">問題数</p>
                  <p className="text-xs text-gray-400">{QUESTION_COUNT}問の4択問題</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center text-sm font-bold text-accent-600">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">制限時間</p>
                  <p className="text-xs text-gray-400">3分以内に解き切ろう</p>
                </div>
              </div>
              {targetCategories && (
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-xs text-gray-500 mb-1">出題カテゴリ:</p>
                  <div className="flex flex-wrap gap-1">
                    {targetCategories.map(cat => (
                      <span key={cat} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        {getCategoryIcon(cat)} {getCategoryLabel(cat)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              テスト開始！
            </button>
          </div>
        )}

        {/* クイズ画面 */}
        {phase === 'quiz' && currentQuestion && (
          <div className="space-y-4">
            {/* プログレスバー */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {currentIndex + 1}/{questions.length}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* カテゴリバッジ */}
            <span className="inline-flex items-center gap-1 text-xs bg-primary-100 text-primary-600 px-2.5 py-1 rounded-full">
              {getCategoryIcon(currentQuestion.category)}
              {getCategoryLabel(currentQuestion.category)}
            </span>

            {/* 問題文 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                {currentQuestion.question}
              </p>
            </div>

            {/* 選択肢 */}
            <div className="space-y-2">
              {currentQuestion.choices.map((choice, i) => {
                let style = 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                if (selectedAnswer !== null) {
                  if (i === currentQuestion.correctIndex) {
                    style = 'bg-green-50 border-green-400 ring-2 ring-green-200'
                  } else if (i === selectedAnswer && !answers[answers.length - 1]?.correct) {
                    style = 'bg-red-50 border-red-400 ring-2 ring-red-200'
                  } else {
                    style = 'bg-gray-50 border-gray-100 opacity-50'
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${style}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      selectedAnswer !== null && i === currentQuestion.correctIndex
                        ? 'bg-green-500 text-white'
                        : selectedAnswer === i && !answers[answers.length - 1]?.correct
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedAnswer !== null && i === currentQuestion.correctIndex ? (
                        <Check size={14} />
                      ) : selectedAnswer === i && !answers[answers.length - 1]?.correct ? (
                        <X size={14} />
                      ) : (
                        String.fromCharCode(65 + i) // A, B, C, D
                      )}
                    </span>
                    <span className="text-sm text-gray-700">{choice}</span>
                  </button>
                )
              })}
            </div>

            {/* 解説 */}
            {showExplanation && (
              <div className={`rounded-2xl p-4 ${
                answers[answers.length - 1]?.correct
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-bold mb-1 ${
                  answers[answers.length - 1]?.correct ? 'text-green-600' : 'text-red-600'
                }`}>
                  {answers[answers.length - 1]?.correct ? '正解！' : '不正解...'}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* 次へボタン */}
            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {currentIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ'}
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* 結果画面 */}
        {phase === 'result' && (
          <div className="space-y-5 py-4">
            {/* スコアヘッダー */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-3"
                style={{
                  background: accuracy >= 80 ? '#dcfce7' : accuracy >= 60 ? '#fef9c3' : '#fee2e2',
                }}
              >
                <Trophy size={36} className={
                  accuracy >= 80 ? 'text-green-500' :
                  accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'
                } />
              </div>
              <p className={`text-5xl font-bold ${
                accuracy >= 80 ? 'text-green-500' :
                accuracy >= 60 ? 'text-orange-500' : 'text-red-500'
              }`}>
                {accuracy}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {correctCount} / {answers.length} 問正解
              </p>
              <p className="text-xs text-gray-400 mt-1">
                残り時間: {formatTime(timeLeft)}
              </p>
              {accuracy >= 80 && <p className="text-sm text-green-600 font-medium mt-2">すばらしい！</p>}
              {accuracy >= 60 && accuracy < 80 && <p className="text-sm text-orange-600 font-medium mt-2">あと少し！がんばろう</p>}
              {accuracy < 60 && <p className="text-sm text-red-600 font-medium mt-2">弱点を集中的に復習しよう</p>}
            </div>

            {/* カテゴリ別結果 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-700">カテゴリ別の結果</h3>
              {Object.entries(categoryResults).map(([catId, stats]) => {
                const catAccuracy = Math.round((stats.correct / stats.total) * 100)
                return (
                  <div key={catId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(catId)}</span>
                      <span className="text-sm text-gray-700">{getCategoryLabel(catId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{stats.correct}/{stats.total}</span>
                      <span className={`text-sm font-bold ${
                        catAccuracy >= 70 ? 'text-green-500' :
                        catAccuracy >= 50 ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {catAccuracy}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 間違えた問題の復習 */}
            {answers.filter(a => !a.correct).length > 0 && (
              <div className="bg-red-50 rounded-2xl border border-red-100 p-4 space-y-3">
                <h3 className="text-sm font-bold text-red-600">間違えた問題</h3>
                {answers.filter(a => !a.correct).map(a => {
                  const q = questions.find(q => q.id === a.questionId)
                  if (!q) return null
                  return (
                    <div key={a.questionId} className="bg-white rounded-xl p-3 border border-red-100">
                      <p className="text-xs text-gray-600 mb-1 line-clamp-2">{q.question}</p>
                      <p className="text-xs text-red-500">
                        あなたの答え: {q.choices[a.selected]}
                      </p>
                      <p className="text-xs text-green-600">
                        正解: {q.choices[q.correctIndex]}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">{q.explanation}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                もう一度チャレンジ
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                ダッシュボードに戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
