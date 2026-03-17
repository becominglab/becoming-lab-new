import Link from "next/link";
import ActivityTimeline from "@/components/ActivityTimeline";

export const metadata = {
  title: "アクティビティ履歴 | becoming lab",
  description: "アクティビティの記録と履歴",
};

export default function ActivitiesPage() {
  return (
    <>
      <section className="pt-32 pb-6">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            href="/mypage"
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#1B6B7A] transition-colors mb-4"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            マイページ
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            アクティビティ
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            トレーニングの記録を確認・管理
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <ActivityTimeline />
        </div>
      </section>
    </>
  );
}
