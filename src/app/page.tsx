import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ファーストビュー */}
      <section className="min-h-[70vh] flex items-center">
        <div className="max-w-3xl mx-auto px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-[#1B6B7A] leading-tight mb-8">
            更新を重ねる<br className="md:hidden" />人生へ。
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            人生は、何度でも選び直せる。
          </p>
          <p className="text-gray-500 mb-8">
            becoming lab は、ストーリーと対話を通じて<br />
            自分の生き方を見つめ直すコミュニティです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/kataribe"
              className="inline-block px-6 py-3 border border-[#1B6B7A] text-[#1B6B7A] text-sm tracking-wide hover:bg-[#1B6B7A] hover:text-white transition-colors"
            >
              次回イベントを見る
            </Link>
            <Link
              href="/community"
              className="inline-block px-6 py-3 bg-[#1B6B7A] text-white text-sm tracking-wide hover:opacity-80 transition-opacity"
            >
              becoming lab に参加する
            </Link>
          </div>
        </div>
      </section>

      {/* becoming lab とは */}
      <section className="py-20 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold mb-8">becoming lab とは</h2>
          <div className="space-y-4 leading-relaxed opacity-90">
            <p className="font-medium text-lg">
              becoming lab は<br />
              「どう生きるか」を問い続ける人のための場です。
            </p>
            <p>人生の中で私たちは</p>
            <p className="pl-4 opacity-80">
              キャリア・家族・成功・社会の期待
            </p>
            <p>さまざまな価値観の中で生きています。</p>
            <p>しかし、ある瞬間にこう問い始めます。</p>
            <p className="italic opacity-90">
              「この道は、本当に自分で選んだ道だろうか？」
            </p>
            <p>
              becoming lab は そんな問いを持つ人たちが集まり、
              誰かのストーリーを聞き、対話をし、自分の人生を見つめ直す——
            </p>
            <p className="font-medium">人生を更新する実験場です。</p>
          </div>
        </div>
      </section>

      {/* becoming lab が大切にしていること */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-10">
            becoming lab が大切にしていること
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">STORY</p>
              <p className="font-medium text-gray-900 mb-1">人生のリアルなストーリー</p>
              <p className="text-sm text-gray-600">成功談ではなく、迷い、葛藤、決断を語ります。</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">DIALOGUE</p>
              <p className="font-medium text-gray-900 mb-1">対話</p>
              <p className="text-sm text-gray-600">正解を教える場ではなく、問いを持ち帰る場です。</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">COURAGE</p>
              <p className="font-medium text-gray-900 mb-1">勇気ある選択</p>
              <p className="text-sm text-gray-600">挑戦する人を応援します。</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">COMMUNITY</p>
              <p className="font-medium text-gray-900 mb-1">志でつながる仲間</p>
              <p className="text-sm text-gray-600">利害ではなく、価値観でつながるコミュニティです。</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">PROGRAM</h2>
          <p className="text-gray-600 mb-10">
            becoming lab では、主に3つのプログラムを行っています。
          </p>
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">TALK SESSION</p>
              <p className="font-medium text-gray-900">人生の選択をした人のストーリー</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">DIALOGUE</p>
              <p className="font-medium text-gray-900">参加者同士の対話</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-[#1B6B7A] mb-2">COMMUNITY</p>
              <p className="font-medium text-gray-900">継続的なつながり</p>
            </div>
          </div>
        </div>
      </section>

      {/* 次回イベント */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-10">次回イベント</h2>
          <div className="border border-gray-200 p-8">
            <p className="text-xs tracking-widest text-[#1B6B7A] mb-4">NEXT EVENT</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              「自分で選んだ道 vol.2」
            </h3>
            <p className="text-gray-600 mb-6">
              テーマ：「トライアスリートのロールモデルを目指して」
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-8">
              <p>📅 2026年4月22日（水）19:30〜</p>
              <p>📍 神田SDGsコネクション 3階</p>
              <p>🎤 スピーカー：プロトライアスロン選手 山岸穂高さん</p>
            </div>
            <Link
              href="/kataribe"
              className="inline-block px-6 py-3 bg-[#1B6B7A] text-white text-sm tracking-wide hover:opacity-80 transition-opacity"
            >
              参加する
            </Link>
          </div>
        </div>
      </section>

      {/* こんな人に来てほしい */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">こんな人に来てほしい</h2>
          <ul className="space-y-3 text-gray-600">
            <li>・自分の人生を自分で選びたい人</li>
            <li>・キャリアや生き方を見つめ直している人</li>
            <li>・志を持って生きたい人</li>
            <li>・挑戦する人を応援したい人</li>
            <li>・本音で話せる仲間に出会いたい人</li>
          </ul>
        </div>
      </section>

      {/* JOIN US */}
      <section className="py-20 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-xl font-bold mb-4">JOIN US</h2>
          <p className="opacity-90 mb-2">人生を更新する時間を</p>
          <p className="opacity-90 mb-8">一緒に作りませんか。</p>
          <p className="opacity-80 mb-8 text-sm">次回イベントにぜひご参加ください。</p>
          <Link
            href="/kataribe"
            className="inline-block px-8 py-3 border border-white text-white text-sm tracking-wide hover:bg-white hover:text-[#1B6B7A] transition-colors"
          >
            参加する
          </Link>
        </div>
      </section>
    </>
  );
}
