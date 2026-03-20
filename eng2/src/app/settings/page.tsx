'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Calendar, Bell, ImageIcon, MessageSquare, Save, Check, LogOut } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import BottomNav from '@/components/BottomNav'
import { createClient } from '@/lib/supabase/client'
import { dummyUser, dummyEncouragementSettings } from '@/lib/data/dummy-data'

type Mode = 'original' | 'uploaded' | 'hidden'
type Tone = 'gentle' | 'bright' | 'push' | 'serious'

export default function SettingsPage() {
  const router = useRouter()
  const [name, setName] = useState(dummyUser.name)
  const [examDate, setExamDate] = useState(dummyUser.exam_date)
  const [mode, setMode] = useState<Mode>(dummyEncouragementSettings.mode)
  const [tone, setTone] = useState<Tone>(dummyEncouragementSettings.tone)
  const [saved, setSaved] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const modeOptions: { value: Mode; label: string; description: string }[] = [
    { value: 'original', label: 'オリジナル応援イラスト', description: 'アプリ内の応援イラストを表示' },
    { value: 'uploaded', label: 'アップロード画像', description: '好きな画像をアップロードして表示' },
    { value: 'hidden', label: '表示しない', description: 'エールカードを非表示にする' },
  ]

  const toneOptions: { value: Tone; label: string; description: string; emoji: string }[] = [
    { value: 'gentle', label: 'やさしい', description: '「ちょっとずつでいいんだよ」', emoji: '🌸' },
    { value: 'bright', label: '明るい', description: '「一緒にがんばろう！」', emoji: '☀️' },
    { value: 'push', label: '背中を押す', description: '「今日サボったらもったいないよ」', emoji: '💪' },
    { value: 'serious', label: '本番モード', description: '「集中しよう。準備がすべてを決める」', emoji: '🎯' },
  ]

  return (
    <div className="pb-20">
      <PageHeader title="設定" showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* プロフィール */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            <User size={16} className="text-gray-400" />
            プロフィール
          </h3>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">名前</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">目標試験日</label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
          </div>
        </section>

        {/* 推しエール設定 */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            <Bell size={16} className="text-gray-400" />
            推しエール設定
          </h3>

          {/* モード選択 */}
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <ImageIcon size={12} />
              画像モード
            </p>
            <div className="space-y-2">
              {modeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setMode(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    mode === option.value
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    mode === option.value ? 'border-primary-500' : 'border-gray-300'
                  }`}>
                    {mode === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{option.label}</p>
                    <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* アップロード */}
          {mode === 'uploaded' && (
            <div>
              <p className="text-xs text-gray-500 mb-2">画像をアップロード</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                <ImageIcon size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">タップして画像を選択</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {/* Supabase Storageアップロード処理 */}}
                />
              </div>
            </div>
          )}

          {/* トーン選択 */}
          {mode !== 'hidden' && (
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <MessageSquare size={12} />
                メッセージトーン
              </p>
              <div className="grid grid-cols-2 gap-2">
                {toneOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setTone(option.value)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      tone === option.value
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <p className="text-sm font-medium text-gray-700 mt-1">{option.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-success-500 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          {saved ? (
            <>
              <Check size={16} />
              保存しました
            </>
          ) : (
            <>
              <Save size={16} />
              設定を保存
            </>
          )}
        </button>

        {/* ログアウト */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full py-3.5 rounded-xl font-medium text-sm border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut size={16} />
          {loggingOut ? 'ログアウト中...' : 'ログアウト'}
        </button>

        {/* アプリ情報 */}
        <section className="text-center pt-4">
          <p className="text-xs text-gray-400">Asahi Eiken 2 Coach v1.0.0</p>
          <p className="text-[10px] text-gray-300 mt-1">Powered by Becoming Lab</p>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
