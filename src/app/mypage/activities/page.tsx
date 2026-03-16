import Link from "next/link";
import ActivityTimeline from "@/components/ActivityTimeline";

export const metadata = {
  title: "アクティビティ履歴 | becoming lab",
  description: "アクティビティの記録と履歴",
};

export default function ActivitiesPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            ACTIVITY HISTORY
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            アクティビティ履歴
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Stravaの同期データや、手動で記録したアクティビティを一覧で確認できます。
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8 pt-8">
          <ActivityTimeline />

          <div className="mt-12 pt-8 border-t border-stone-200">
            <Link
              href="/mypage"
              className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
