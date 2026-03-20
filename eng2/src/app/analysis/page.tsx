'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, TrendingDown } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import { dummyExamLogs } from '@/lib/data/dummy-data'

const COLORS = ['#0c93f0', '#f97316', '#22c55e', '#a855f7', '#ef4444', '#eab308']

export default function AnalysisPage() {
  // パート別正答率
  const partAccuracy = useMemo(() => {
    const partData: Record<string, { correct: number; total: number }> = {}
    dummyExamLogs.forEach(log => {
      const key = `${log.section} / ${log.part}`
      if (!partData[key]) partData[key] = { correct: 0, total: 0 }
      partData[key].total++
      if (log.is_correct) partData[key].correct++
    })
    return Object.entries(partData).map(([name, data]) => ({
      name: name.length > 12 ? name.slice(0, 12) + '…' : name,
      fullName: name,
      正答率: Math.round((data.correct / data.total) * 100),
      correct: data.correct,
      total: data.total,
    }))
  }, [])

  // ミス理由ランキング
  const missReasons = useMemo(() => {
    const counts: Record<string, number> = {}
    dummyExamLogs.forEach(log => {
      if (!log.is_correct) {
        log.miss_tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1
        })
      }
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
  }, [])

  // セクション別正答率
  const sectionAccuracy = useMemo(() => {
    const sectionData: Record<string, { correct: number; total: number }> = {}
    dummyExamLogs.forEach(log => {
      if (!sectionData[log.section]) sectionData[log.section] = { correct: 0, total: 0 }
      sectionData[log.section].total++
      if (log.is_correct) sectionData[log.section].correct++
    })
    return Object.entries(sectionData).map(([name, data]) => ({
      name,
      正答率: Math.round((data.correct / data.total) * 100),
    }))
  }, [])

  // 全体正答率
  const overallAccuracy = useMemo(() => {
    const correct = dummyExamLogs.filter(l => l.is_correct).length
    return Math.round((correct / dummyExamLogs.length) * 100)
  }, [])

  // 最近のつまずき
  const recentMisses = useMemo(() => {
    return dummyExamLogs
      .filter(l => !l.is_correct)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  }, [])

  return (
    <div className="pb-20">
      <PageHeader title="苦手分析" showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* 全体正答率 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">全体正答率</p>
          <p className={`text-4xl font-bold ${overallAccuracy >= 70 ? 'text-success-600' : overallAccuracy >= 50 ? 'text-accent-500' : 'text-red-500'}`}>
            {overallAccuracy}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {dummyExamLogs.filter(l => l.is_correct).length} / {dummyExamLogs.length} 問正解
          </p>
        </div>

        {/* セクション別正答率 */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">セクション別正答率</h3>
          <div className="grid grid-cols-2 gap-2">
            {sectionAccuracy.map(sec => (
              <div key={sec.name} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 capitalize mb-1">{sec.name}</p>
                <p className={`text-xl font-bold ${sec.正答率 >= 70 ? 'text-success-600' : sec.正答率 >= 50 ? 'text-accent-500' : 'text-red-500'}`}>
                  {sec.正答率}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* パート別正答率グラフ */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">パート別正答率</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partAccuracy} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, '正答率']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="正答率" radius={[0, 4, 4, 0]}>
                  {partAccuracy.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.正答率 >= 70 ? '#22c55e' : entry.正答率 >= 50 ? '#f97316' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ミス理由ランキング */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">ミス理由ランキング</h3>
          {missReasons.length > 0 ? (
            <div className="flex gap-4">
              <div className="w-32 h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={missReasons}
                      cx="50%"
                      cy="50%"
                      outerRadius={55}
                      innerRadius={30}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {missReasons.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {missReasons.map((reason, i) => (
                  <div key={reason.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-xs text-gray-600 flex-1">{reason.name}</span>
                    <span className="text-xs font-medium text-gray-800">{reason.value}回</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">データがありません</p>
          )}
        </section>

        {/* 苦手傾向 */}
        <section className="bg-red-50 rounded-2xl border border-red-100 p-4">
          <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-1.5">
            <AlertTriangle size={14} />
            苦手傾向
          </h3>
          <div className="space-y-2">
            {missReasons.slice(0, 3).map((reason) => (
              <div key={reason.name} className="flex items-center gap-2">
                <TrendingDown size={14} className="text-red-400" />
                <span className="text-sm text-gray-700">{reason.name}</span>
                <span className="text-xs text-red-500 ml-auto">{reason.value}回ミス</span>
              </div>
            ))}
          </div>
        </section>

        {/* 最近のつまずき */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">最近のつまずき</h3>
          <div className="space-y-3">
            {recentMisses.map(miss => (
              <div key={miss.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-b-0 last:pb-0">
                <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-500 text-xs font-bold">×</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    {miss.exam_session_name} - {miss.part} Q{miss.question_number}
                  </p>
                  {miss.miss_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {miss.miss_tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {miss.memo && (
                    <p className="text-xs text-gray-400 mt-1">{miss.memo}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
