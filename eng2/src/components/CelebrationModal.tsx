'use client'

import { X, Star, Sparkles } from 'lucide-react'

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'vocab' | 'card' | 'streak'
}

export default function CelebrationModal({ isOpen, onClose, title, message, type = 'vocab' }: CelebrationModalProps) {
  if (!isOpen) return null

  const bgGradient = {
    vocab: 'from-primary-100 to-primary-50',
    card: 'from-accent-100 to-accent-50',
    streak: 'from-warm-100 to-warm-50',
  }[type]

  const iconColor = {
    vocab: 'text-primary-500',
    card: 'text-accent-500',
    streak: 'text-yellow-500',
  }[type]

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-b ${bgGradient} rounded-2xl p-8 max-w-sm w-full celebrate-in relative`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/50"
        >
          <X size={18} className="text-gray-500" />
        </button>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {type === 'streak' ? (
              <Star size={48} className={iconColor} fill="currentColor" />
            ) : (
              <Sparkles size={48} className={iconColor} />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-white/80 hover:bg-white text-gray-700 font-medium px-6 py-2 rounded-full text-sm transition-colors"
          >
            OK！
          </button>
        </div>
      </div>
    </div>
  )
}
