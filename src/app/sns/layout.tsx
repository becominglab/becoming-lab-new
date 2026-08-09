import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SnsNav from "@/components/sns/SnsNav";
import SnsSidebar from "@/components/sns/SnsSidebar";
import SnsHeader from "@/components/sns/SnsHeader";
import ComposeFAB from "@/components/sns/ComposeFAB";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "Becoming SNS — 更新をつなぐ",
  description: "変わろうとしている仲間とつながる、更新のためのSNS",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Becoming",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function SnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50">
        {/* モバイル: 1カラム / PC: 2カラム (メイン + サイドバー) */}
        <div className="mx-auto max-w-5xl px-0 lg:px-6 min-h-screen pb-24 lg:pb-8">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6 lg:pt-6">
            {/* メインコンテンツ */}
            <main className="min-w-0">
              <SnsHeader />
              {children}
            </main>

            {/* サイドバー（PCのみ） */}
            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <SnsSidebar />
              </div>
            </aside>
          </div>
        </div>
        <SnsNav currentUserId={currentUserId} />
        <ComposeFAB />
      </div>
    </ToastProvider>
  );
}
