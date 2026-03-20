import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投資スクリーニング",
  robots: { index: false, follow: false },
};

export default function ScreeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800">
      {children}
    </div>
  );
}
