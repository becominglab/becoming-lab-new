'use client'

import { useState, useMemo, useCallback } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import CelebrationModal from '@/components/CelebrationModal'
import { grammarCards } from '@/lib/data/grammar-cards'
import { dummyCardReviews } from '@/lib/data/dummy-data'
import type { CardReview } from '@/lib/types'

type Rating = 'easy' | 'ok' | 'hard'

export default function GrammarCardsPage() {
  const [reviews, setReviews] = useState<CardReview[]>(dummyCardReviews)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filterMode, setFilterMode] = useState<'all' | 'weak'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  const categories = useMemo(() => {
    const cats = [...new Set(grammarCards.map(c => c.category))]
    return ['all', ...cats]
  }, [])

  const filteredCards = useMemo(() => {
    let cards = grammarCards
    if (selectedCategory !== 'all') {
      cards = cards.filter(c => c.category === selectedCategory)
    }
    if (filterMode === 'weak') {
      const weakCardIds = reviews
        .filter(r => r.result_rating === 'hard')
        .map(r => r.card_id)
      cards = cards.filter(c => weakCardIds.includes(c.id))
    }
    return cards
  }, [selectedCategory, filterMode, reviews])

  const currentCard = filteredCards[currentIndex]

  const handleRate = useCallback((rating: Rating) => {
    if (!currentCard) return

    const existingReview = reviews.find(r => r.card_id === currentCard.id)
    const now = new Date()
    const nextReview = new Date()

    if (rating === 'easy') nextReview.setDate(now.getDate() + 7)
    else if (rating === 'ok') nextReview.setDate(now.getDate() + 3)
    else nextReview.setDate(now.getDate() + 1)

    if (existingReview) {
      setReviews(prev => prev.map(r =>
        r.card_id === currentCard.id
          ? { ...r, result_rating: rating, next_review_at: nextReview.toISOString(), review_count: r.review_count + 1, last_reviewed_at: now.toISOString() }
          : r
      ))
    } else {
      setReviews(prev => [...prev, {
        id: `cr-new-${Date.now()}`,
        user_id: 'user-1',
        card_id: currentCard.id,
        result_rating: rating,
        next_review_at: nextReview.toISOString(),
        review_count: 1,
        last_reviewed_at: now.toISOString(),
      }])
    }

    const newCount = completedCount + 1
    setCompletedCount(newCount)

    if (newCount > 0 && newCount % 5 === 0) {
      setShowCelebration(true)
    }

    setIsFlipped(false)
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentCard, reviews, currentIndex, filteredCards.length, completedCount])

  const goTo = (direction: 'prev' | 'next') => {
    setIsFlipped(false)
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    } else if (direction === 'next' && currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  return (
    <div className="pb-20">
      <PageHeader
        title="中学英語カード"
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
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">カテゴリ</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); setIsFlipped(false) }}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'すべて' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">モード</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setFilterMode('all'); setCurrentIndex(0); setIsFlipped(false) }}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    filterMode === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  全カード
                </button>
                <button
                  onClick={() => { setFilterMode('weak'); setCurrentIndex(0); setIsFlipped(false) }}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    filterMode === 'weak' ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  苦手だけ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* カード表示 */}
        {filteredCards.length > 0 && currentCard ? (
          <>
            {/* 進捗 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{currentIndex + 1} / {filteredCards.length}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded-full">{currentCard.category}</span>
            </div>

            {/* カード */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer"
            >
              <div className={`bg-white rounded-2xl border-2 ${
                isFlipped ? 'border-primary-200' : 'border-gray-100'
              } min-h-[280px] flex flex-col items-center justify-center p-6 transition-all`}>
                {!isFlipped ? (
                  <>
                    <span className="text-[10px] text-gray-400 mb-4 uppercase tracking-wider">表 - タップして裏を見る</span>
                    <p className="text-lg text-gray-800 text-center leading-relaxed font-medium">
                      {currentCard.front_text}
                    </p>
                    <div className="mt-4 flex items-center gap-1">
                      {currentCard.difficulty === 'easy' && <span className="px-2 py-0.5 bg-success-50 text-success-600 rounded-full text-[10px]">かんたん</span>}
                      {currentCard.difficulty === 'medium' && <span className="px-2 py-0.5 bg-warm-100 text-yellow-700 rounded-full text-[10px]">ふつう</span>}
                      {currentCard.difficulty === 'hard' && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px]">むずかしい</span>}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-primary-400 mb-3 uppercase tracking-wider">裏 - 答え</span>
                    <p className="text-xl font-bold text-primary-600 text-center mb-3">
                      {currentCard.back_text}
                    </p>
                    <p className="text-sm text-gray-600 text-center leading-relaxed mb-3">
                      {currentCard.explanation}
                    </p>
                    {currentCard.related_points.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {currentCard.related_points.map(point => (
                          <span key={point} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-[10px]">
                            {point}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ナビゲーション */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => goTo('prev')}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => { setIsFlipped(false) }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={18} className="text-gray-600" />
              </button>
              <button
                onClick={() => goTo('next')}
                disabled={currentIndex === filteredCards.length - 1}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* 自己評価ボタン */}
            {isFlipped && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">自己評価</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRate('easy')}
                    className="py-3 rounded-xl bg-success-50 hover:bg-success-100 text-success-600 text-sm font-medium transition-colors"
                  >
                    余裕
                  </button>
                  <button
                    onClick={() => handleRate('ok')}
                    className="py-3 rounded-xl bg-warm-100 hover:bg-warm-200 text-yellow-700 text-sm font-medium transition-colors"
                  >
                    ぎりぎり
                  </button>
                  <button
                    onClick={() => handleRate('hard')}
                    className="py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors"
                  >
                    分からない
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-500 text-sm">
              {filterMode === 'weak' ? '苦手カードがありません！素晴らしい！' : 'カードがありません'}
            </p>
          </div>
        )}
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="カード5枚完了！"
        message="いい調子！文法の理解が深まっているよ。この調子で続けよう！"
        type="card"
      />

      <BottomNav />
    </div>
  )
}
