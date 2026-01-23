import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ファーストビュー */}
      <section className="min-h-[70vh] flex items-center">
        <div className="max-w-3xl mx-auto px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-[#1B6B7A] leading-tight mb-8">
            更新を重ねる<br className="md:hidden" />人生を。
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            未完成のまま、語り続ける。その言葉が、誰かの勇気になる。
          </p>
          <p className="text-gray-500 mb-8">
            becoming lab は、人生の途中にいる人が、自分の物語を語り、<br />
            次の一歩を見つけていくための対話の場です。
          </p>
          <p className="text-sm text-gray-400 tracking-widest">
            Layering renewal into life.
          </p>
        </div>
      </section>

      {/* becoming lab とは */}
      <section className="py-20 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold mb-8">becoming lab とは</h2>
          <div className="space-y-4 leading-relaxed opacity-90">
            <p>人生には、立ち止まりたくなる瞬間があります。このままでいいのか。何を大切にして生きたいのか。自分は何者なのか。</p>
            <p>becoming lab は、そうした問いに答えを与える場所ではありません。ここは、未完成なままの人生を、言葉にしてみる場所です。</p>
            <p>語ることで、自分の輪郭が見えてくる。聴くことで、誰かの人生が自分に重なる。その重なりの中で、人は静かに更新されていきます。</p>
          </div>
        </div>
      </section>

      {/* 教えない理由〜はじめの一歩 */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-8">
          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-8">教えない理由</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>becoming lab は、教える場ではありません。なぜなら、ここに集う人たちはすでにそれぞれの人生を生き、答えの「種」を持っているからです。</p>
              <p>必要なのは、正解ではなく、語る時間と、聴いてもらえる関係。私たちは、場・問い・伴走を提供します。</p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-10">何が起きるのか</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-4">参加前</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>経験が点のまま残っている</li>
                  <li>想いはあるが、言葉にならない</li>
                  <li>志はあるが、共有できない</li>
                </ul>
              </div>
              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-4">参加後</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>自分の物語を、自分の言葉で語れる</li>
                  <li>経験が意味としてつながる</li>
                  <li>その語りが、誰かの勇気になる</li>
                </ul>
              </div>
              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-4">継続すると</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>人生の軸が定まる</li>
                  <li>他者への関わり方が変わる</li>
                  <li>語ること自体が貢献になる</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-8">語り部（かたりべ）の循環という仕組み</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>語り部とは、完成した人ではありません。途中のまま、自分の物語を語る人のことです。</p>
              <p>becoming lab では、一人ひとりが語り部になります。</p>
              <p>語る人が、誰かの勇気になる。聴いた人が、次の語り部になる。語りが循環し、成長と貢献が続いていく。</p>
              <p>完成を目指すのではなく、更新を重ねる人生そのものが集まる場です。</p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-8">主な関わり方</h2>
            <div className="space-y-8">
              <div>
                <p className="font-medium text-gray-900 mb-1">1｜語り部の会（聴く）</p>
                <p className="text-sm text-gray-600">月に一度、人生・挑戦・家族・仕事などをテーマに、一人の語り部の話を聴きます。</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">2｜セッション（話す）</p>
                <p className="text-sm text-gray-600">自分の経験や想いを棚卸し、言葉にしていく対話の時間です。</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">3｜深める（継続）</p>
                <p className="text-sm text-gray-600">コーチングや講座を通じて、人生の軸や関係性を深めていきます。</p>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-8">なぜ、この場をつくったのか</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>私は、仕事・家庭・挑戦（トライアスロン）を同時に抱えながら、何度も立ち止まり、迷ってきました。</p>
              <p>転機は、「やり方」ではなく「在り方」を見つめ直したことでした。整え、向き合い、つむぎ直す。そのプロセスが、人生全体を変えていったのです。</p>
              <p>becoming lab は、その経験と学びを、同じように悩む人と分かち合うための場として生まれました。</p>
            </div>
            <p className="mt-8 pt-6 border-t border-gray-200 text-gray-500 text-sm">
              この場への関わりは、語りが次へと手渡されていく循環への参加です。
            </p>
          </div>

          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-8">こんな方へ</h2>
            <ul className="space-y-2 text-gray-600">
              <li>未完成だと感じているが、志がある</li>
              <li>人生を次のフェーズに進めたい</li>
              <li>自分の経験を、誰かの役に立てたい</li>
              <li>教えられるより、対話したい</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-8">はじめの一歩</h2>
            <div className="space-y-4">
              <Link href="/kataribe" className="block text-[#1B6B7A] hover:opacity-70 transition-opacity">
                ▶ 語り部の会に参加する
              </Link>
              <Link href="/contact" className="block text-[#1B6B7A] hover:opacity-70 transition-opacity">
                ▶ 話してみる
              </Link>
              <Link href="/contact" className="block text-[#1B6B7A] hover:opacity-70 transition-opacity">
                ▶ 開催情報を受け取る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
