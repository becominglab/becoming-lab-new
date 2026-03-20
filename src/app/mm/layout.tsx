import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'のびしろクエスト',
  description: '春休みの総復習で、受験学年の一歩目をつくる学習アプリ',
};

export default function NobishiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-md min-h-screen">
        {children}
      </div>
    </div>
  );
}
