'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  rightElement?: React.ReactNode
}

export default function PageHeader({ title, showBack = false, rightElement }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  )
}
