import Link from "next/link";

export const metadata = {
  title: "コンセプト",
  description: "becoming labは、更新し続ける人が集まり、自分で選んだ道を尊重し、互いの挑戦と自己実現を応援し合うコミュニティです。",
};

export default function ConceptPage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">CONCEPT</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">becoming lab の思想</h1>
        </div>
      </section>

      {/* コミュニティとは */}
      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
            <p>becoming labは、更新し続ける人が集まり、</p>
            <p>自分で選んだ道を尊重し、</p>
            <p>互いの挑戦と自己実現を応援し合うコミュニティです。</p>
            <p className="pt-4 text-gray-500">becoming labは、その人生の挑戦をアシストします。</p>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          {/* Mission */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">MISSION</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">自分らしく、更新し続ける</h2>
            <p className="text-gray-600 leading-relaxed">
              自分を変えることが目的ではありません。自分に嘘をつかず、今の自分にふさわしい選択を重ねること。
            </p>
          </div>

          {/* Vision */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">VISION</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">成長・貢献・継続が、循環する人生</h2>
            <p className="text-gray-600 leading-relaxed">
              経験は、自分の中だけに留めるものではありません。語られ、重なり、次へ渡されることで人生は循環していきます。
            </p>
          </div>

          {/* Values */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-6">VALUES</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">会う（Meet）</h3>
                <p className="text-gray-600">挑戦の途中にいる人と出会う。答えではなく、途中を聞く。</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">整う（Align）</h3>
                <p className="text-gray-600">仲間の言葉をきっかけに、自分に還る。答えが出なくても構わない。</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">更新する（Update）</h3>
                <p className="text-gray-600">選び直しを、一度きりにしない。何度でも重ねていく。</p>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-500 leading-relaxed">
              ロゴの「i」の上に置いた円環は、この3つが回り続けることを表しています。
              到達点ではなく、回り続けるプロセスそのものが becoming lab です。
            </p>
          </div>

          {/* Cultures */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-6">CULTURES</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ここで大切にしていること</h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              三つだけです。守ってもらうルールではなく、ここにいる人たちが自然とそうしていることです。
            </p>
            <div className="space-y-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">会う。</h3>
                <p className="text-gray-600 leading-relaxed">
                  完成したふりをしなくていい。誰もが途中。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">整う。</h3>
                <p className="text-gray-600 leading-relaxed">
                  答えより、問いを。比べるなら、昨日の自分と。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">更新する。</h3>
                <p className="text-gray-600 leading-relaxed">
                  一点だけ、決める。動いた自分で、また会いにいく。
                </p>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-500 leading-relaxed">
              三つ目が「また会いにいく」で終わるのは、一つ目に戻るからです。
              一周したら、また始まります。何周しても構いません。
            </p>
          </div>

          {/* スピーカーという在り方 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">スピーカーという在り方</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>スピーカーは、完成した人ではありません。途中のまま語る人です。</p>
              <p>語ることで輪郭が生まれ、聴くことで重なり、次の語りが生まれます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 二人からの手紙 */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-6">LETTER</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">なぜ、夫婦で becoming lab を始めたのか</h2>
          <div className="space-y-6 text-gray-600 leading-loose">
            <p>誰かの人生の途中を聴いて、そこに集まった人たちと話し、自分自身の人生について少し考えてみる。東京・神田で、月に一度、そんな会を開いています。</p>
            <p>なぜ、私たち夫婦がこんな場所をつくろうと思ったのか。ここに書いておきたいと思います。</p>
            <p>私たちは、人生は、決めたら何にでも変えられると信じています。といっても、大きなことを成し遂げるとか、特別な人になるという話ではありません。</p>
            <p>自分にとって、本当に大切なものは何なのか。誰と、どんな時間を過ごしたいのか。忙しい毎日の中で一度立ち止まり、「本当はどうしたい？」と自分に問いかけてみる。そして、気づいたことを、自分で選んでみる。その小さな選択の積み重ねが、人生を少しずつ更新していくのだと思っています。</p>
            <p>私たち自身、最初からそんな生き方ができていたわけではありません。</p>
            <p>夫は、家族を置き去りにして、自分の自己実現や会社の経営に夢中になっていました。妻は、人の話を聴く仕事をしながら、寂しさを抱えながら子どもたちを育てていました。目の前の成果を追いかけているうちに、夫婦にも、家族にも、たくさんのすれ違いが生まれました。</p>
            <p>それでも当時は、もっと頑張れば幸せになれる、そのためにはもっと成果を出さなければ。そう思って走り続けていました。</p>
            <p>私たちが変わり始めたきっかけは、何か立派な教えに出会ったことではありません。夫婦で交わした「本当はどうしたい？」という問いでした。</p>
            <p>そこから、意識して二人の時間をつくるようになりました。夫婦で話す。家族について考える。旅行に行く。会ったことのない人に会いに行く。知らなかった価値観に触れる。一緒に学ぶ。そして、やってみたかったことに、一緒に一歩だけ踏み出してみる。</p>
            <p>そんなことを繰り返しているうちに、私たち自身の人生も少しずつ動き始めました。</p>
            <p>その中で気づいたことがあります。人は、一人で考えているだけでは、なかなか変われない。</p>
            <p>誰かに会って、知らなかった世界を知る。誰かの生き方に触れて、自分自身を振り返る。誰かと話しているうちに、「自分の中に、もう答えがあったんだ」と気づく。そして、ほんの少し勇気を出してみる。振り返ると、私たちの人生が動き始めたときは、いつもそんな順番でした。</p>
            <p>だから、becoming lab を、そんなことが自然に起こる場所にしたいと思っています。</p>
          </div>

          <div className="mt-12 space-y-10">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">会う。</h3>
              <p className="text-gray-600 leading-loose">いろいろな人生を歩いてきた人に会う。新しい仲間に会う。知らなかった価値観に会う。そして、まだ知らなかった自分自身に会う。</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">整う。</h3>
              <p className="text-gray-600 leading-loose">誰かの正解ではなく、「自分にとっての幸せとは何だろう」と考えてみる。仕事。家族。健康。仲間。自分の時間。忙しさの中で少しずつ見えなくなっていた、自分が本当に大切にしたかったものを、もう一度確かめる。</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">更新する。</h3>
              <p className="text-gray-600 leading-loose">考えて終わりにせず、自分で選んだ方向へ、小さく一歩を踏み出してみる。</p>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-gray-600 leading-loose">
            <p>転職や起業のような、大きな挑戦でなくて構いません。大切な人に、言えていなかった一言を伝える。昔やりたかったことを、もう一度始めてみる。健康のために走ってみる。しばらく連絡できていなかった人に、連絡してみる。自分で選んだ一歩なら、それは立派な「更新」だと思うのです。</p>
            <p>そして、更新した自分で、また新しい人に会う。また整う。また一歩進む。人生は、その繰り返しなのかもしれません。</p>
            <p>この場所を「LAB＝研究所」と名づけたのも、そのためです。人生に、完成形はありません。会って、整えて、やってみる。うまくいかなければ、また考える。そして、また更新する。そんな人生の実験を、みんなで安心して楽しめる場所にしたい。</p>
            <p>だから、becoming lab を「完成した人」だけが集まる場所にするつもりはありません。むしろ、迷っている人。挑戦している途中の人。何かを変えたいと思っている人。もう一度やり直そうとしている人。そんな人たちの人生が交わる場所でありたいと思っています。</p>
            <p>もちろん、私たち自身もまだ途中です。仕事も、家族も、健康も、新しい挑戦も、うまくいくことばかりではありません。それでも「本当はどうしたい？」と何度でも問い直し、そのたびに自分たちで選び直していきたいと思っています。</p>
            <p>becoming lab に来た人が、「すごい話を聞いた」だけではなく、「自分も、何かやってみようかな」と思って帰ってくれたら、私たちはとても嬉しいです。</p>
            <p>その小さな一歩で誰かの人生が少し変わる。そして今度は、その人が歩いている姿が、別の誰かの背中を押していく。そんな循環が少しずつ広がっていったら、これ以上のことはありません。</p>
            <p>
              人生は、誰かの正解や、他人の期待に応えるためだけにあるのではなく、自分自身の幸せを見つけ、自分で選び続けるためにある。私たちは、そう信じています。
            </p>
            <p>会う。整う。更新する。そしてまた、新しい自分に出会う。</p>
            <p>その道を、皆さんと一緒に歩いていけたらと思っています。</p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 text-gray-900">
            <p className="mb-1 text-sm text-gray-500">becoming lab</p>
            <p className="font-medium">大塚貴生・昌代</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">PROMISE</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">ひとつだけ、お約束</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              ここで聞いた他の人の話は、外では話しません。自分の話だけは、自分で決めていい。
            </p>
            <p>
              その日の様子を note に書いたり、写真や言葉をサイトに載せたりすることがあります。
              載せたくないときは、そう言ってくれれば載せません。あとからでも構いません。
            </p>
          </div>
          <div className="mt-14 pt-10 border-t border-stone-200 text-center text-stone-500 text-sm leading-relaxed">
            <p className="font-medium text-gray-900 mb-2">becoming lab</p>
            <p>更新し続ける人が集まり、自分で選んだ道を尊重し、<br />互いの挑戦と自己実現を応援するコミュニティ。</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8">
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            ▶ 話してみる
          </Link>
        </div>
      </section>
    </>
  );
}
