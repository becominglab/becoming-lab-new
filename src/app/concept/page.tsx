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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">becoming lab を訪れてくださった皆さまへ</h2>
          <div className="space-y-6 text-gray-600 leading-loose">
            <p>人生は、何歳からでも変えられる。私たちはそう思っています。</p>
            <p>といっても、大きなことを成し遂げるとか、特別な人になるという話ではありません。自分にとって本当に大切なものは何か。誰と、どんな時間を過ごしたいのか。立ち止まってそれを考え、「本当はこうしたい」と気づいたことを、自分で選んでみる。その積み重ねが、人生を少しずつ更新していくのだと思います。</p>
            <p>私たち自身、最初からそう考えていたわけではありません。</p>
            <p>片方は会社の経営に追われ、片方は人の話を聴く仕事をしながら、子供たちを育てています。目の前の成果を追いかけているうちに、家に帰るのが日付をまたぐ日が続いた時期がありました。もっと頑張らなければ、もっと成果を出さなければ。そう思って走っていました。</p>
            <p>変わるきっかけは、立派な答えではありませんでした。夫婦で交わした「本当はどうしたい？」という、それだけの問いです。</p>
            <p>そこから、意識して時間をつくるようになりました。夫婦で話す。家族について考える。会ったことのない人に会いに行く。知らなかった価値観に触れる。そして、やってみたかったことに一歩だけ踏み出してみる。そんなことを重ねるうちに、私たち自身の人生も少しずつ動いていきました。</p>
            <p>そのなかで気づいたことがあります。</p>
            <p>人は、一人で考えているだけでは、なかなか変われません。誰かに会って、知らない世界を知る。誰かの生き方に触れて、自分を振り返る。話しているうちに、自分の中にもう答えがあったと気づく。そして、ほんの少し勇気を出してみる。人生が動き始めるのは、だいたいその順番でした。</p>
            <p>だから becoming lab を、こういう場所にしたいと思っています。</p>
          </div>

          <div className="mt-12 space-y-10">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">会う。</h3>
              <p className="text-gray-600 leading-loose">いろいろな人生を歩いてきた人に会う。新しい仲間に会う。知らなかった価値観に会う。そして、まだ知らなかった自分自身に会う。</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">整う。</h3>
              <p className="text-gray-600 leading-loose">誰かの正解ではなく、自分にとっての幸せとは何かを考える。仕事、家族、健康、仲間。忙しさの中で少しずつ見えなくなっていた、自分の大切なものをもう一度確かめる。</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">更新する。</h3>
              <p className="text-gray-600 leading-loose">考えて終わりにせず、自分で選んだ方向へ、小さく一歩を踏み出してみる。</p>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-gray-600 leading-loose">
            <p>転職や起業のような大きな挑戦でなくて構いません。大切な人に、言えていなかった一言を伝える。昔やりたかったことを、もう一度始めてみる。健康のために走ってみる。連絡できていなかった人に、連絡してみる。自分で選んだ一歩なら、それは立派な更新です。</p>
            <p>そして、更新した自分でまた新しい人に会う。また整う。また一歩進む。人生は、その繰り返しなのだと思います。</p>
            <p>この場所を「LAB＝研究所」と名づけたのも、そのためです。人生に完成形はありません。会って、整えて、やってみる。うまくいかなければ、また考える。そして、また更新する。そんな実験を、みんなで楽しめる場所にしたいと思いました。</p>
            <p>だから、完成した人だけが集まる場所にするつもりはありません。むしろ、迷っている人、挑戦している途中の人、失敗した人、もう一度やり直そうとしている人。そういう人たちの人生が交わる場所でありたいと思っています。</p>
            <p>私たち自身も、まだ途中です。仕事も、家族も、健康も、新しい挑戦も、うまくいくことばかりではありません。それでも「これからどうしたい？」と何度でも問い直して、選び直していきたい。</p>
            <p>becoming lab に来て、「すごい話を聞けた」で終わるのではなく、「自分も何かやってみようかな」と思ってもらえたら嬉しいです。その小さな一歩で誰かの人生が少し変わり、今度はその人の姿が、また別の誰かの背中を押していく。そんな循環が広がっていったら、これ以上のことはありません。</p>
            <p>人生は、誰かの正解を生きるためにあるのではなく、自分自身の幸せを見つけ、選び続けるためにある。私たちはそう信じています。</p>
            <p>会う。整う。更新する。そしてまた、新しい自分に出会う。</p>
            <p>その道を、皆さんと一緒に歩いていけたらと思っています。</p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 text-gray-900">
            <p className="mb-1 text-sm text-gray-500">becoming lab</p>
            <p className="font-medium">大塚 貴生・大塚 昌代</p>
          </div>
        </div>
      </section>

      {/* becoming lab 憲章 */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">CHARTER</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">becoming lab 憲章</h2>
          <p className="text-gray-600 leading-relaxed mb-10">
            becoming labは、人生を更新し続ける人が集まり、自分で選んだ道を尊重し合うコミュニティです。<br />
            ここでは、次のことを大切にします。
          </p>
          <div className="space-y-10">
            {[
              { num: "1", title: "自分で選んだ道を尊重する", body: "人それぞれに、選ぶ道があります。その選択を正しい・間違いで判断せず、尊重します。" },
              { num: "2", title: "人生の途中を語る", body: "ここで語られるのは、完成された成功談ではありません。まだ続いている、人生の途中の物語です。" },
              { num: "3", title: "評価しない", body: "この場では、人を評価しません。誰かを上や下に置くことなく、一人の人生として受け取ります。" },
              { num: "4", title: "比較しない", body: "他人の人生と自分の人生を比べる必要はありません。それぞれの道を、そのまま大切にします。" },
              { num: "5", title: "挑戦を応援する", body: "自分で選んだ道を歩む人の挑戦を、コミュニティとして応援します。" },
              { num: "6", title: "安心して語れる場を守る", body: "この場で聞いた誰かの話は、持ち出しません。自分の話だけは、自分の意思で持ち出せます。写真や言葉をサイト等に掲載する場合も、ご本人の許可をいただいたものだけを掲載します。" },
              { num: "7", title: "更新し続ける", body: "人は完成する存在ではなく、更新し続ける存在です。becoming labは、人生を更新し続ける人を応援する場です。" },
            ].map((item) => (
              <div key={item.num} className="flex gap-6">
                <span className="text-2xl font-light text-stone-300 flex-shrink-0 w-6">{item.num}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-10 border-t border-stone-200 text-center text-stone-500 text-sm leading-relaxed">
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
