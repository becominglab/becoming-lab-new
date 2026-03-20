'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // デモモード: 認証をスキップしてダッシュボードへ
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  }

  const handleDemoLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <BookOpen size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Asahi Eiken 2 Coach
          </h1>
          <p className="text-sm text-gray-500 mt-1">英検2級 合格サポート</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
              placeholder="パスワードを入力"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            デモモードで体験する
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          アカウントをお持ちでない場合は管理者にご連絡ください
        </p>
      </div>
    </div>
  )
}
