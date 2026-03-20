import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asahi Eiken 2 Coach',
  description: '英検2級合格を目指す学習アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
