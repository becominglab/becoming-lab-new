'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Target, TrendingDown, TrendingUp, Zap, BookOpen, ChevronRight, BarChart3 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import type { UploadedExam, WeaknessAnalysis } from '@/lib/types'
import { sectionToCategoryMap, questionCategories } from '@/lib/data/quick-test-questions'

// パート→カテゴリのマッピングで弱点を推定
function analyzeWeakness(exam: UploadedExam): WeaknessAnalysis[] {
  // カテゴリ別に集計
  const categoryStats: Record<string, { total: number; correct: number }> = {}

  for (const cat of questionCategories) {
    categoryStats[cat.id] = { total: 0, correct: 0 }
  }

  for (const result of exam.results) {
    const categories = sectionToCategoryMap[result.part] || []
    for (const cat of categories) {
      if (categoryStats[cat]) {
        categoryStats[cat].total += 1
        if (result.is_correct) {
          categoryStats[cat].correct += 1
        }
      }
    }
  }

  // 分析結果を生成
  const analyses: WeaknessAnalysis[] = []
  for (const cat of questionCategories) {
    const stats = categoryStats[cat.id]
    if (stats.total === 0) continue
    const accuracy = Math.round((stats.correct / stats.total) * 100)
    const level: 'weak' | 'average' | 'strong' =
      accuracy < 50 ? 'weak' : accuracy < 70 ? 'average' : 'strong'

    const recommendations: Record<string, string> = {
      vocabulary: '単語帳で頻出語彙を毎日10語ずつ覚えましょう。文脈の中で覚えるのが効果的です。',
      idiom: '句動詞・熟語は前置詞のイメージと一緒に覚えると記憶に残ります。',
      'grammar-tense': '時制は時間軸を図に書いて理解しましょう。特に完了形と過去形の違いが重要。',
      'grammar-passive': '受動態は「〜される」の形。by以外の前置詞を使うパターンも確認。',
      'grammar-infinitive': 'to不定詞と動名詞の使い分けリストを作って暗記しましょう。',
      'grammar-relative': '関係代名詞は先行詞が「人」か「もの」かで使い分け。who/which/thatの違いを整理。',
      'grammar-comparison': '原級・比較級・最上級の3パターンと、as...as構文をセットで覚えましょう。',
      'grammar-subjunctive': '仮定法過去と仮定法過去完了の時制のズレに注意。If節の動詞の形がポイント。',
      'grammar-conjunction': '接続詞は「意味のグループ」で整理すると覚えやすい。逆接・条件・理由・目的。',
      'grammar-preposition': '前置詞はイメージで覚える。in=中、on=接触、at=点。動詞+前置詞のセットも重要。',
      'reading-comprehension': 'まず設問を読んでから本文を読む。段落ごとの要点をメモする練習を。',
      'listening-comprehension': '毎日10分のリスニング練習を。シャドーイングで聞き取り力UP。',
    }

    analyses.push({
      category: cat.id,
      label: cat.label,
      totalQuestions: stats.total,
      correctCount: stats.correct,
      accuracy,
      level,
      recommendation: recommendations[cat.id] || '継続的な学習を心がけましょう。',
    })
  }

  return analyses.sort((a, b) => a.accuracy - b.accuracy)
}

// 複数回の試験データを統合分析
function analyzeAllExams(exams: UploadedExam[]): WeaknessAnalysis[] {
  const categoryStats: Record<string, { total: number; correct: number }> = {}
  for (const cat of questionCategories) {
    categoryStats[cat.id] = { total: 0, correct: 0 }
  }

  for (const exam of exams) {
    for (const result of exam.results) {
      const categories = sectionToCategoryMap[result.part] || []
      for (const cat of categories) {
        if (categoryStats[cat]) {
          categoryStats[cat].total += 1
          if (result.is_correct) categoryStats[cat].correct += 1
        }
      }
    }
  }

  const recommendations: Record<string, string> = {
    vocabulary: '単語帳で頻出語彙を毎日10語ずつ覚えましょう。文脈の中で覚えるのが効果的です。',
    idiom: '句動詞・熟語は前置詞のイメージと一緒に覚えると記憶に残ります。',
    'grammar-tense': '時制は時間軸を図に書いて理解しましょう。特に完了形と過去形の違いが重要。',
    'grammar-passive': '受動態は「〜される」の形。by以外の前置詞を使うパターンも確認。',
    'grammar-infinitive': 'to不定詞と動名詞の使い分けリストを作って暗記しましょう。',
    'grammar-relative': '関係代名詞は先行詞が「人」か「もの」かで使い分け。who/which/thatの違いを整理。',
    'grammar-comparison': '原級・比較級・最上級の3パターンと、as...as構文をセットで覚えましょう。',
    'grammar-subjunctive': '仮定法過去と仮定法過去完了の時制のズレに注意。If節の動詞の形がポイント。',
    'grammar-conjunction': '接続詞は「意味のグループ」で整理すると覚えやすい。逆接・条件・理由・目的。',
    'grammar-preposition': '前置詞はイメージで覚える。in=中、on=接触、at=点。動詞+前置詞のセットも重要。',
    'reading-comprehension': 'まず設問を読んでから本文を読む。段落ごとの要点をメモする練習を。',
    'listening-comprehension': '毎日10分のリスニング練習を。シャドーイングで聞き取り力UP。',
  }

  const analyses: WeaknessAnalysis[] = []
  for (const cat of questionCategories) {
    const stats = categoryStats[cat.id]
    if (stats.total === 0) continue
    const accuracy = Math.round((stats.correct / stats.total) * 100)
    const level: 'weak' | 'average' | 'strong' =
      accuracy < 50 ? 'weak' : accuracy < 70 ? 'average' : 'strong'

    analyses.push({
      category: cat.id,
      label: cat.label,
      totalQuestions: stats.total,
      correctCount: stats.correct,
      accuracy,
      level,
      recommendation: recommendations[cat.id] || '継続的な学習を心がけましょう。',
    })
  }

  return analyses.sort((a, b) => a.accuracy - b.accuracy)
}

export default function WeaknessPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">読み込み中...</p></div>}>
      <WeaknessPage />
    </Suspense>
  )
}

function WeaknessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('examId')
  const [exams, setExams] = useState<UploadedExam[]>([])
  const [viewMode, setViewMode] = useState<'latest' | 'all'>('latest')

  useEffect(() => {
    const data = localStorage.getItem('uploadedExams')
    if (data) {
      setExams(JSON.parse(data))
    }
  }, [])

  const targetExam = examId ? exams.find(e => e.id === examId) : exams[exams.length - 1]

  const latestAnalysis = useMemo(
    () => targetExam ? analyzeWeakness(targetExam) : [],
    [targetExam]
  )

  const allAnalysis = useMemo(
    () => exams.length > 0 ? analyzeAllExams(exams) : [],
    [exams]
  )

  const analysis = viewMode === 'latest' ? latestAnalysis : allAnalysis
  const weakCategories = analysis.filter(a => a.level === 'weak')
  const averageCategories = analysis.filter(a => a.level === 'average')
  const strongCategories = analysis.filter(a => a.level === 'strong')

  if (exams.length === 0) {
    return (
      <div className="pb-20">
        <PageHeader title="弱点分析" showBack />
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
            <BarChart3 size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">まだデータがありません</h2>
          <p className="text-sm text-gray-500 mb-6">
            過去問の結果をアップロードすると
            <br />弱点を分析できます
          </p>
          <button
            onClick={() => router.push('/upload')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-xl transition-colors"
          >
            過去問をアップロード
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="pb-20">
      <PageHeader title="弱点分析" showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* 切替タブ */}
        {exams.length > 1 && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('latest')}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'latest' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              最新の結果
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              全回の統合分析
            </button>
          </div>
        )}

        {/* ヘッダー情報 */}
        {viewMode === 'latest' && targetExam && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-bold text-gray-700">{targetExam.session_name}</p>
            <p className="text-xs text-gray-400">
              {new Date(targetExam.uploaded_at).toLocaleDateString('ja-JP')} に登録
            </p>
          </div>
        )}

        {/* 弱点（要強化）*/}
        {weakCategories.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-500" />
              <h3 className="text-sm font-bold text-red-600">要強化（正答率50%未満）</h3>
            </div>
            <div className="space-y-2">
              {weakCategories.map(cat => (
                <div key={cat.category} className="bg-red-50 rounded-2xl border border-red-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-red-700">{cat.label}</span>
                    <span className="text-lg font-bold text-red-600">{cat.accuracy}%</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                  <p className="text-xs text-red-600">{cat.recommendation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 平均（まあまあ）*/}
        {averageCategories.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-orange-500" />
              <h3 className="text-sm font-bold text-orange-600">もう少し（正答率50-69%）</h3>
            </div>
            <div className="space-y-2">
              {averageCategories.map(cat => (
                <div key={cat.category} className="bg-orange-50 rounded-2xl border border-orange-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-orange-700">{cat.label}</span>
                    <span className="text-lg font-bold text-orange-600">{cat.accuracy}%</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                  <p className="text-xs text-orange-600">{cat.recommendation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 得意（OK）*/}
        {strongCategories.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-500" />
              <h3 className="text-sm font-bold text-green-600">得意分野（正答率70%以上）</h3>
            </div>
            <div className="space-y-2">
              {strongCategories.map(cat => (
                <div key={cat.category} className="bg-green-50 rounded-2xl border border-green-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">{cat.label}</span>
                    <span className="text-base font-bold text-green-600">{cat.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* アクションボタン */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              const weakCats = analysis
                .filter(a => a.level === 'weak' || a.level === 'average')
                .map(a => a.category)
              router.push(`/quick-test?categories=${weakCats.join(',')}`)
            }}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            弱点を3分クイックテストで強化
          </button>

          <button
            onClick={() => router.push('/quick-test')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            全カテゴリからテスト
          </button>

          <button
            onClick={() => router.push('/upload')}
            className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            別の過去問を追加する
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
