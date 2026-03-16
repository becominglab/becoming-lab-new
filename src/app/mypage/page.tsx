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
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                ログインすると、デバイス連携や挑戦ログが利用できます。
              </p>
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-[#1B6B7A] text-white rounded-lg text-xs font-medium hover:bg-[#155a67] transition-colors"
              >
                ログインする
              </Link>
            </div>
          )}

          {/* デバイス連携ダッシュボード */}
          <IntegrationDashboard />

          {/* わたしの挑戦ログ */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/mypage/activities"
                className="flex items-center gap-4 p-5 border border-stone-200 rounded-xl hover:border-[#1B6B7A] hover:bg-[#1B6B7A]/5 transition-colors group"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#1B6B7A] transition-colors">
                    アクティビティ履歴
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Strava連携 & 手動記録
                  </p>
                </div>
              </Link>
              <Link
                href="/mypage/health"
                className="flex items-center gap-4 p-5 border border-stone-200 rounded-xl hover:border-[#1B6B7A] hover:bg-[#1B6B7A]/5 transition-colors group"
              >
                <span className="text-2xl">🏥</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#1B6B7A] transition-colors">
                    体組成データ
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    TANITA連携 & 手動記録
                  </p>
                </div>
              </Link>
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
