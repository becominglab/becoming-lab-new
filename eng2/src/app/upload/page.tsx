'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Camera, FileText, Check, X, ChevronRight, Trash2, AlertTriangle } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import type { UploadedExamResult } from '@/lib/types'

// 英検2級の構成
const eikenStructure = {
  reading: {
    label: 'リーディング',
    parts: [
      { name: '短文語句補充', questions: 20 },
      { name: '長文語句補充', questions: 6 },
      { name: '長文内容一致', questions: 12 },
    ],
  },
  listening: {
    label: 'リスニング',
    parts: [
      { name: '第1部 会話の応答', questions: 15 },
      { name: '第2部 会話の内容一致', questions: 15 },
    ],
  },
  writing: {
    label: 'ライティング',
    parts: [
      { name: '英作文', questions: 1 },
    ],
  },
} as const

type Section = keyof typeof eikenStructure

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'upload' | 'input' | 'confirm'>('upload')
  const [sessionName, setSessionName] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState<Section>('reading')
  const [results, setResults] = useState<UploadedExamResult[]>([])

  // 画像アップロード処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleStartInput = () => {
    if (!sessionName.trim()) return
    // 初期化：全問正解(○)で埋めておく
    const initialResults: UploadedExamResult[] = []
    for (const [section, data] of Object.entries(eikenStructure)) {
      for (const part of data.parts) {
        for (let q = 1; q <= part.questions; q++) {
          initialResults.push({
            section: section as Section,
            part: part.name,
            question_number: q,
            is_correct: true,
          })
        }
      }
    }
    setResults(initialResults)
    setStep('input')
  }

  // ○×切り替え
  const toggleResult = (section: string, part: string, qNum: number) => {
    setResults(prev =>
      prev.map(r =>
        r.section === section && r.part === part && r.question_number === qNum
          ? { ...r, is_correct: !r.is_correct }
          : r
      )
    )
  }

  // セクション別の結果取得
  const getPartResults = (section: string, part: string) =>
    results.filter(r => r.section === section && r.part === part)

  // セクション別の正答率
  const getSectionAccuracy = (section: string) => {
    const sectionResults = results.filter(r => r.section === section)
    if (sectionResults.length === 0) return 0
    return Math.round((sectionResults.filter(r => r.is_correct).length / sectionResults.length) * 100)
  }

  // 全体の正答率
  const getTotalAccuracy = () => {
    if (results.length === 0) return 0
    return Math.round((results.filter(r => r.is_correct).length / results.length) * 100)
  }

  // 保存して分析へ
  const handleSaveAndAnalyze = () => {
    // ローカルストレージに保存
    const existingData = localStorage.getItem('uploadedExams')
    const existing = existingData ? JSON.parse(existingData) : []
    const newExam = {
      id: `ue-${Date.now()}`,
      session_name: sessionName,
      uploaded_at: new Date().toISOString(),
      image_url: imagePreview,
      results,
    }
    existing.push(newExam)
    localStorage.setItem('uploadedExams', JSON.stringify(existing))

    // 分析ページへ遷移
    router.push(`/weakness?examId=${newExam.id}`)
  }

  // パート全体を一括で×にする
  const markAllIncorrect = (section: string, part: string) => {
    setResults(prev =>
      prev.map(r =>
        r.section === section && r.part === part
          ? { ...r, is_correct: false }
          : r
      )
    )
  }

  // パート全体を一括で○にする
  const markAllCorrect = (section: string, part: string) => {
    setResults(prev =>
      prev.map(r =>
        r.section === section && r.part === part
          ? { ...r, is_correct: true }
          : r
      )
    )
  }

  return (
    <div className="pb-20">
      <PageHeader title="過去問アップロード" showBack />

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* ステップ1: アップロード */}
        {step === 'upload' && (
          <div className="space-y-5">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-3">
                <Upload size={28} className="text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">過去問の結果を入力</h2>
              <p className="text-sm text-gray-500 mt-1">
                解答済みの過去問を写真で記録して、
                <br />⚪×を入力しましょう
              </p>
            </div>

            {/* 回次名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                試験回次
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={e => setSessionName(e.target.value)}
                placeholder="例: 2025年度第3回"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>

            {/* 写真アップロード（任意） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                解答用紙の写真（任意）
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="アップロード画像"
                    className="w-full rounded-xl border border-gray-200"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-300 transition-colors"
                  >
                    <Camera size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500">写真を撮る</span>
                  </button>
                  <button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.removeAttribute('capture')
                        fileInputRef.current.click()
                        fileInputRef.current.setAttribute('capture', 'environment')
                      }
                    }}
                    className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-300 transition-colors"
                  >
                    <FileText size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500">ファイルから選ぶ</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleStartInput}
              disabled={!sessionName.trim()}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3.5 rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              ⚪×入力を始める
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ステップ2: ○×入力 */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* セクション切替タブ */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(Object.entries(eikenStructure) as [Section, typeof eikenStructure[Section]][]).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setCurrentSection(key)}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                    currentSection === key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  {data.label}
                </button>
              ))}
            </div>

            {/* セクション別の正答率 */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3">
              <span className="text-sm text-gray-600">{eikenStructure[currentSection].label}の正答率</span>
              <span className={`text-lg font-bold ${
                getSectionAccuracy(currentSection) >= 70 ? 'text-green-500' :
                getSectionAccuracy(currentSection) >= 50 ? 'text-orange-500' : 'text-red-500'
              }`}>
                {getSectionAccuracy(currentSection)}%
              </span>
            </div>

            {/* パート別入力 */}
            {eikenStructure[currentSection].parts.map(part => {
              const partResults = getPartResults(currentSection, part.name)
              const correctCount = partResults.filter(r => r.is_correct).length

              return (
                <div key={part.name} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-700">{part.name}</h3>
                    <span className="text-xs text-gray-400">
                      {correctCount}/{part.questions} 正解
                    </span>
                  </div>

                  {/* 一括ボタン */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => markAllCorrect(currentSection, part.name)}
                      className="flex-1 text-xs py-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                    >
                      全部 ⚪
                    </button>
                    <button
                      onClick={() => markAllIncorrect(currentSection, part.name)}
                      className="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      全部 ×
                    </button>
                  </div>

                  {/* 問題番号グリッド */}
                  <div className="grid grid-cols-5 gap-2">
                    {partResults.map(r => (
                      <button
                        key={r.question_number}
                        onClick={() => toggleResult(currentSection, part.name, r.question_number)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                          r.is_correct
                            ? 'bg-green-50 border-2 border-green-300 text-green-600'
                            : 'bg-red-50 border-2 border-red-300 text-red-600'
                        }`}
                      >
                        <span className="text-[10px] text-gray-400">{r.question_number}</span>
                        {r.is_correct ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <X size={18} strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* 確認へ進むボタン */}
            <button
              onClick={() => setStep('confirm')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              入力内容を確認する
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setStep('upload')}
              className="w-full text-sm text-gray-400 py-2"
            >
              戻る
            </button>
          </div>
        )}

        {/* ステップ3: 確認 & 分析へ */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-1">{sessionName}</h3>
              <p className="text-xs text-gray-400 mb-4">入力結果の確認</p>

              {/* 全体スコア */}
              <div className="text-center py-4 mb-4 bg-gray-50 rounded-xl">
                <p className={`text-4xl font-bold ${
                  getTotalAccuracy() >= 70 ? 'text-green-500' :
                  getTotalAccuracy() >= 50 ? 'text-orange-500' : 'text-red-500'
                }`}>
                  {getTotalAccuracy()}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {results.filter(r => r.is_correct).length} / {results.length} 問正解
                </p>
              </div>

              {/* セクション別サマリー */}
              <div className="space-y-3">
                {(Object.entries(eikenStructure) as [Section, typeof eikenStructure[Section]][]).map(([key, data]) => {
                  const sectionResults = results.filter(r => r.section === key)
                  const correctCount = sectionResults.filter(r => r.is_correct).length
                  const accuracy = sectionResults.length > 0
                    ? Math.round((correctCount / sectionResults.length) * 100)
                    : 0

                  return (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{data.label}</p>
                        <p className="text-xs text-gray-400">{correctCount}/{sectionResults.length} 正解</p>
                      </div>
                      <span className={`text-lg font-bold ${
                        accuracy >= 70 ? 'text-green-500' :
                        accuracy >= 50 ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {accuracy}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 弱点プレビュー */}
            {(() => {
              const incorrectParts = new Map<string, number>()
              results.filter(r => !r.is_correct).forEach(r => {
                const key = r.part
                incorrectParts.set(key, (incorrectParts.get(key) || 0) + 1)
              })
              const weakParts = [...incorrectParts.entries()]
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)

              if (weakParts.length > 0) {
                return (
                  <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <h3 className="text-sm font-bold text-red-600">弱点エリア</h3>
                    </div>
                    {weakParts.map(([part, count]) => (
                      <p key={part} className="text-sm text-red-700 ml-6">
                        {part}: {count}問不正解
                      </p>
                    ))}
                  </div>
                )
              }
              return null
            })()}

            <button
              onClick={handleSaveAndAnalyze}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              弱点を分析する
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setStep('input')}
              className="w-full text-sm text-gray-400 py-2"
            >
              入力に戻る
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
