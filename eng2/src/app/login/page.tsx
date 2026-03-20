'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!isSupabaseConfigured) {
      // Supabase未設定時はデモモードへ
      router.push('/dashboard')
      return
    }

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('メールアドレスまたはパスワードが正しくありません')
        } else {
          setError(authError.message)
        }
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('ログイン中にエラーが発生しました')
      setIsLoading(false)
    }
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
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
