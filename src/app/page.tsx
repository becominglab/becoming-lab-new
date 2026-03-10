import Link from "next/link";

export const metadata = {
  title: "becoming lab | 更新を重ねる人生を",
  description: "becoming labは、更新し続ける人が集まり、自分で選んだ道を尊重し、互いの挑戦と自己実現を応援し合うコミュニティです。",
};

export default function HomePage() {
  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-8">becoming lab</p>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-12 tracking-tight text-gray-900">
            更新を重ねる、<br />人生を。
          </h1>
          <div className="space-y-4 text-stone-600 leading-relaxed text-base md:text-lg max-w-xl mx-auto mb-12">
            <p>becoming labは、更新し続ける人が集まり、</p>
            <p>自分で選んだ道を尊重し、</p>
            <p>互いの挑戦と自己実現を応援し合うコミュニティです。</p>
            <p className="pt-4 text-stone-500">becoming labは、その人生の挑戦をアシストします。</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/concept" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-sm">
              <span>▶</span> becoming labとは
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B6B7A] text-white hover:bg-[#155a67] transition-colors duration-300 text-sm">
              <span>▶</span> 話してみる
            </Link>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* コミュニティ紹介 */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">COMMUNITY</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">人生の途中を、一緒に歩む</h2>
          <div className="space-y-4 text-stone-600 leading-relaxed mb-8">
            <p>語り、聴き、一緒に過ごす場。月1回のトークイベント「自分で選んだ道」を起点に、食事会・ランニング・勉強会など、さまざまな形でつながります。</p>
          </div>
          <Link href="/community" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
            ▶ コミュニティについて
          </Link>
        </div>
      </section>

      {/* 自分で選んだ道 */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">EVENT</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">自分で選んだ道</h2>
          <p className="text-stone-600 leading-relaxed mb-8">誰かの選択が、あなたの問いになる。月1回開催のトークイベントシリーズ。</p>
          <Link href="/jibun-de-eranda-michi" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
            ▶ イベント一覧を見る
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
          <p className="text-xs tracking-[0.3em] text-stone-500 mb-4">JOIN US</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight">まず、話してみる</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300">
            <span className="text-sm">▶</span>
            <span>お問い合わせ</span>
          </Link>
        </div>
      </section>
    </>
  );
}
