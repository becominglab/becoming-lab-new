import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "マイページ | becoming lab",
  description: "マイページ・外部サービス連携・挑戦ログ",
};

type Integration = {
  provider: string;
  connected_at: string;
} | null;

const providers = [
  {
    key: "strava",
    label: "Strava",
    icon: "🚴",
    connectedLabel: "Strava 連携済み",
    connectLabel: "Strava と連携する",
    authPath: "/api/strava/auth",
  },
  {
    key: "healthplanet",
    label: "HealthPlanet",
    icon: "🏥",
    connectedLabel: "HealthPlanet 連携済み",
    connectLabel: "HealthPlanet (TANITA) と連携する",
    authPath: "/api/healthplanet/auth",
  },
  {
    key: "garmin",
    label: "Garmin",
    icon: "⌚",
    connectedLabel: "Garmin 連携済み",
    connectLabel: "Garmin と連携する",
    authPath: "/api/garmin/auth",
  },
  {
    key: "coros",
    label: "COROS",
    icon: "🏃",
    connectedLabel: "COROS 連携済み",
    connectLabel: "COROS と連携する",
    authPath: "/api/coros/auth",
  },
] as const;

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 全連携状態を一括取得
  const { data: integrations } = user
    ? await supabase
        .from("device_integrations")
        .select("provider, connected_at")
        .eq("user_id", user.id)
    : { data: [] };

  const integrationMap = new Map<string, Integration>(
    (integrations ?? []).map((i) => [i.provider, i])
  );

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

          {/* デバイス連携 */}
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
              DEVICE INTEGRATIONS
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              デバイス連携
            </h2>
            <p className="text-sm text-stone-500 mb-8">
              フィットネスデバイスを連携して、挑戦の記録を自動で取り込みます。
            </p>

            <div className="space-y-3">
              {providers.map((p) => {
                const integration = integrationMap.get(p.key);
                const isConnected = !!integration;

                return isConnected ? (
                  <div
                    key={p.key}
                    className="flex items-center justify-between px-6 py-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-green-700 font-medium text-sm">
                        {p.connectedLabel}
                      </span>
                    </div>
                    <span className="text-xs text-green-600">
                      {new Date(integration.connected_at).toLocaleDateString(
                        "ja-JP"
                      )}
                    </span>
                  </div>
                ) : (
                  <Link
                    key={p.key}
                    href={p.authPath}
                    className="flex items-center gap-3 px-6 py-4 bg-white border border-stone-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-gray-700 font-medium text-sm">
                      {p.connectLabel}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 挑戦ログ */}
          <div className="mb-16">
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
