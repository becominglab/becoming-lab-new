import Link from "next/link";

export const metadata = {
  title: "becoming lab | 挑戦の途中を、生きる人へ",
  description:
    "becoming labは、挑戦の途中にいる人の物語を可視化し、応援が集まる場所です。成功を見せ合う場所ではなく、まだ途中の人生に光を当てます。",
};

const featuredChallengers = [
  {
    slug: "tachikawa",
    name: "立川さん",
    path: "猟師として生きる道",
    quote:
      "期待に応えて生きてきた。それが間違いだとは思わない。ただ自分の声を、後回しにしてきた。",
    role: "Challenger",
  },
  {
    slug: "yamashiro",
    name: "山岸穂高",
    path: "アスリートとして世界を目指す道",
    quote:
      "自分が挑戦を続ける限り、誰かの背中を押せるかもしれない。それがチームをつくる理由です。",
    role: "Challenger",
  },
];

export default function TopPage() {
  return (
    <>
      {/* ヒーロー：3秒で伝わる「挑戦する人のための場所」 */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-8">
            becoming lab
          </p>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight text-gray-900">
            挑戦の途中を、
            <br />
            生きる人へ。
          </h1>
          <div className="space-y-3 text-stone-600 leading-relaxed text-base md:text-lg max-w-xl mx-auto mb-6">
            <p>成功を見せ合う場所ではありません。</p>
            <p>
              まだ途中の物語に、光を当てる。
              <br />
              迷いながらも歩く人に、応援が届く。
            </p>
          </div>
          <p className="text-stone-400 text-sm mb-12">
            ここは、そういう場所です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B6B7A] text-white hover:bg-[#155a67] transition-colors duration-300 text-sm"
            >
              挑戦フィードを見る
            </Link>
            <Link
              href="/concept"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-sm"
            >
              becoming labとは
            </Link>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* 挑戦者たち：人物が主役 */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            CHALLENGERS
          </p>
          <h2 className="text-2xl font-light mb-4 tracking-tight text-gray-900">
            自分で選んだ道を歩く人たち
          </h2>
          <p className="text-stone-500 text-sm mb-10">
            完成された成功談ではなく、迷いや葛藤も含めたリアルな人生の物語。
          </p>

          <div className="space-y-6">
            {featuredChallengers.map((person) => (
              <Link
                key={person.slug}
                href={`/members/${person.slug}`}
                className="block group"
              >
                <div className="border border-stone-200 p-8 hover:border-stone-400 transition-colors duration-300 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1B6B7A] transition-colors">
                      {person.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 border border-stone-300 text-stone-500">
                      {person.role}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mb-4">
                    自分で選んだ道：{person.path}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-stone-300 pl-4 italic">
                    &ldquo;{person.quote}&rdquo;
                  </p>
                  <p className="text-sm text-[#1B6B7A] mt-4">
                    この人の物語を読む →
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/members"
              className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
            >
              すべての挑戦者を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* 思想：静かな情熱 */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            PHILOSOPHY
          </p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">
            人生に、完成はない
          </h2>
          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              「Being」は「在る」こと。
              <br />
              「Becoming」は「なりつつある」こと。
            </p>
            <p>
              完成した状態を目指すのではなく、
              <br />
              常に「なりつつある」自分を肯定する。
            </p>
            <p>
              becoming lab は、その思想を共有し、
              <br />
              実践するための場所です。
            </p>
          </div>
          <Link
            href="/concept"
            className="inline-block mt-8 text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
          >
            思想を読む →
          </Link>
        </div>
      </section>

      {/* コミュニティ：一緒に歩む */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            COMMUNITY
          </p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">
            人生の途中を、一緒に歩む
          </h2>
          <div className="space-y-4 text-stone-600 leading-relaxed mb-8">
            <p>
              語り、聴き、一緒に過ごす場。
              <br />
              月1回のトークイベント「自分で選んだ道」を起点に、
              <br />
              食事会・ランニング・勉強会など、さまざまな形でつながります。
            </p>
          </div>
          <Link
            href="/community"
            className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
          >
            コミュニティについて →
          </Link>
        </div>
      </section>

      {/* セッション */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">SESSION</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">becoming session</h2>
          <p className="text-stone-600 leading-relaxed mb-8">自分自身の人生を見つめ直し、次の一歩を踏み出すためのセッション。</p>
          <Link href="/session" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
            ▶ セッションについて
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-stone-500 mb-4">
            JOIN US
          </p>
          <h2 className="text-2xl font-light mb-4 tracking-tight">
            まず、話してみる
          </h2>
          <p className="text-stone-400 text-sm mb-8">
            挑戦の途中にいるあなたへ。
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300"
          >
            お問い合わせ
          </Link>
        </div>
      </section>
    </>
  );
}
