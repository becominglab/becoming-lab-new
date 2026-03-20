'use client'

import { useState } from 'react'
import { Plus, Check, X, ChevronDown } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import { dummyExamLogs, missTagOptions } from '@/lib/data/dummy-data'
import type { ExamLog } from '@/lib/types'

const sections = ['reading', 'listening', 'writing', 'speaking'] as const
const parts: Record<string, string[]> = {
  reading: ['短文語句補充', '長文語句補充', '長文内容一致'],
  listening: ['第1部', '第2部'],
  writing: ['ライティング'],
  speaking: ['スピーキング'],
}

export default function ExamLogPage() {
  const [logs, setLogs] = useState<ExamLog[]>(dummyExamLogs)
  const [showForm, setShowForm] = useState(false)
  const [examSession, setExamSession] = useState('')
  const [section, setSection] = useState<typeof sections[number]>('reading')
  const [part, setPart] = useState('')
  const [questionNum, setQuestionNum] = useState(1)
  const [isCorrect, setIsCorrect] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [memo, setMemo] = useState('')

  const handleSubmit = () => {
    const newLog: ExamLog = {
      id: `el-new-${crypto.randomUUID()}`,
      user_id: 'user-1',
      exam_session_name: examSession || '新規記録',
      section,
      part: part || parts[section][0],
      question_number: questionNum,
      is_correct: isCorrect,
      miss_tags: selectedTags,
      memo,
      created_at: new Date().toISOString(),
    }
    setLogs([newLog, ...logs])
    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    setExamSession('')
    setSection('reading')
    setPart('')
    setQuestionNum(1)
    setIsCorrect(true)
    setSelectedTags([])
    setMemo('')
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // セッション別にグループ化
  const grouped = logs.reduce<Record<string, ExamLog[]>>((acc, log) => {
    if (!acc[log.exam_session_name]) acc[log.exam_session_name] = []
    acc[log.exam_session_name].push(log)
    return acc
  }, {})

  return (
    <div className="pb-20">
      <PageHeader
        title="過去問記録"
        showBack
        rightElement={
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Plus size={18} className="text-primary-600" />
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* 新規入力フォーム */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
            <h3 className="font-bold text-sm text-gray-700">新しい記録を追加</h3>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">試験回</label>
              <input
                type="text"
                value={examSession}
                onChange={e => setExamSession(e.target.value)}
                placeholder="例: 2025年度第3回"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">セクション</label>
                <div className="relative">
                  <select
                    value={section}
                    onChange={e => { setSection(e.target.value as typeof sections[number]); setPart('') }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm appearance-none bg-white focus:border-primary-400 outline-none"
                  >
                    {sections.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">パート</label>
                <div className="relative">
                  <select
                    value={part || parts[section][0]}
                    onChange={e => setPart(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm appearance-none bg-white focus:border-primary-400 outline-none"
                  >
                    {parts[section].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">問題番号</label>
                <input
                  type="number"
                  value={questionNum}
                  onChange={e => setQuestionNum(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">正解/不正解</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCorrect(true)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isCorrect
                        ? 'bg-success-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    ○
                  </button>
                  <button
                    onClick={() => setIsCorrect(false)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {!isCorrect && (
              <div>
                <label className="text-xs text-gray-500 mb-2 block">ミス理由タグ（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {missTagOptions.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 mb-1 block">メモ</label>
              <textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="自由にメモ"
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setShowForm(false); resetForm() }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
              >
                保存
              </button>
            </div>
          </div>
        )}

        {/* ログ一覧 */}
        {Object.entries(grouped).map(([session, sessionLogs]) => {
          const correct = sessionLogs.filter(l => l.is_correct).length
          const total = sessionLogs.length
          return (
            <div key={session} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-700">{session}</h3>
                <span className="text-xs text-gray-500">
                  {correct}/{total} 正解 ({Math.round(correct / total * 100)}%)
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {sessionLogs.map(log => (
                  <div key={log.id} className="px-4 py-3 flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      log.is_correct ? 'bg-success-50' : 'bg-red-50'
                    }`}>
                      {log.is_correct
                        ? <Check size={14} className="text-success-600" />
                        : <X size={14} className="text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{log.section}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{log.part}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-500">Q{log.question_number}</span>
                      </div>
                      {log.miss_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {log.miss_tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {log.memo && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{log.memo}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
