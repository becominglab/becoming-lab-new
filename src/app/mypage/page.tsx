import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import IntegrationDashboard from "@/components/IntegrationDashboard";

export const metadata = {
  title: "マイページ | becoming lab",
  description: "マイページ・外部サービス連携・挑戦ログ",
};

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-8 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            MY PAGE
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            マイページ
          </h1>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8 pt-12">
          {!user && (
            <div className="mb-12 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm leading-relaxed">
                ログインすると、デバイス連携や挑戦ログが利用できます。
              </p>
            </div>
          )}

          {/* デバイス連携ダッシュボード */}
          <IntegrationDashboard />

          {/* 挑戦ログ */}
          <div className="mt-16 mb-16">
            <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
              MY CHALLENGE LOG
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              わたしの挑戦ログ
            </h2>
            <p className="text-sm text-stone-500 mb-8">
              あなたの挑戦の記録がここに表示されます。
            </p>

            <div className="border border-dashed border-stone-300 rounded-lg p-8 text-center">
              <p className="text-stone-400 text-sm mb-4">
                まだ挑戦ログがありません
              </p>
              <p className="text-stone-400 text-xs">
                デバイスを連携するか、手動で挑戦を記録してみましょう。
              </p>
            </div>
          </div>

          {/* 戻るリンク */}
          <div className="pt-8 border-t border-stone-200">
            <Link
              href="/home"
              className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
