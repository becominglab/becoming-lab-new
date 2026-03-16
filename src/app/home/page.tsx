import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "ホーム | becoming lab",
  description: "挑戦フィード - becoming lab",
};

/**
 * 挑戦フィード（ログイン後のメイン画面）
 * 人物 → 挑戦 → 応援 の導線の起点
 */

const challengeStories = [
  {
    id: 1,
    name: "立川さん",
    role: "Challenger",
    path: "猟師として生きる道",
    date: "2026-03-14",
    content:
      "秩父の山で今朝もシカの足跡を追った。猟師になって1年、まだ迷うこともあるけれど、自分の手で生きることの意味を毎日噛み締めている。",
    slug: "tachikawa",
  },
  {
    id: 2,
    name: "山岸穂高",
    role: "Challenger",
    path: "アスリートとして世界を目指す道",
    date: "2026-03-12",
    content:
      "シーズン開幕まであと2ヶ月。今日のバイク練習で自己ベストを更新。長い冬のトレーニングが少しずつ実を結んでいる。",
    slug: "yamashiro",
  },
  {
    id: 3,
    name: "大塚さん",
    role: "Curator",
    path: "becoming lab を育てる道",
    date: "2026-03-10",
    content:
      "becoming lab の仲間がまた一人増えた。この場が「完成」じゃなくて「更新」を大切にするから、みんな自然体でいられるのかもしれない。",
    slug: null,
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {/* ヘッダー */}
      <section className="pt-28 pb-8">
        <div className="max-w-2xl mx-auto px-8">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs tracking-[0.3em] text-stone-400 mb-3">
                CHALLENGE FEED
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                挑戦フィード
              </h1>
            </div>
            {user && (
              <Link
                href="/mypage"
                className="text-xs text-[#1B6B7A] hover:opacity-70 transition-opacity border border-[#1B6B7A] px-4 py-2 rounded"
              >
                マイページ
              </Link>
            )}
          </div>
          <p className="text-sm text-stone-500 mt-3">
            挑戦の途中にいる人たちの、いまの物語。
          </p>
        </div>
      </section>

      {/* フィード */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-6">
            {challengeStories.map((story) => (
              <article
                key={story.id}
                className="border border-stone-200 p-6 md:p-8 hover:border-stone-300 transition-colors"
              >
                {/* 人物ヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {story.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 border border-stone-300 text-stone-500">
                        {story.role}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      自分で選んだ道：{story.path}
                    </p>
                  </div>
                  <time className="text-xs text-stone-400 whitespace-nowrap">
                    {new Date(story.date).toLocaleDateString("ja-JP", {
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                {/* 挑戦の内容 */}
                <p className="text-gray-600 leading-relaxed text-sm mb-5">
                  {story.content}
                </p>

                {/* アクション */}
                <div className="flex items-center gap-4">
                  <button className="text-xs text-stone-400 hover:text-[#1B6B7A] transition-colors flex items-center gap-1">
                    <span>👏</span> 応援する
                  </button>
                  {story.slug && (
                    <Link
                      href={`/members/${story.slug}`}
                      className="text-xs text-stone-400 hover:text-[#1B6B7A] transition-colors"
                    >
                      この人の物語を読む →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* 余白・ヒント */}
          <div className="mt-12 text-center">
            <p className="text-sm text-stone-400">
              まだ始まったばかりの場所です。
            </p>
            <p className="text-xs text-stone-300 mt-2">
              一人ひとりの挑戦が、ここに積み重なっていきます。
            </p>
          </div>

          {/* 導線 */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            <Link
              href="/members"
              className="p-6 border border-stone-200 hover:border-stone-400 transition-colors group"
            >
              <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">
                PEOPLE
              </p>
              <p className="font-bold text-gray-900 group-hover:text-[#1B6B7A] transition-colors">
                挑戦者たちを見る
              </p>
              <p className="text-xs text-stone-400 mt-1">
                それぞれの物語を読む
              </p>
            </Link>
            <Link
              href="/community"
              className="p-6 border border-stone-200 hover:border-stone-400 transition-colors group"
            >
              <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">
                COMMUNITY
              </p>
              <p className="font-bold text-gray-900 group-hover:text-[#1B6B7A] transition-colors">
                コミュニティを知る
              </p>
              <p className="text-xs text-stone-400 mt-1">
                一緒に歩む場について
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
