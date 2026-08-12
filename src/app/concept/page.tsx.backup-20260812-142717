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
                <h3 className="text-lg font-bold text-gray-900 mb-2">整える（Align）</h3>
                <p className="text-gray-600">状態・関係・時間・身体を、今の自分に合う形に揃える。</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">向き合う（Face）</h3>
                <p className="text-gray-600">避けずに見る。自分・他者・現実に誠実である。</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">つむぐ（Weave）</h3>
                <p className="text-gray-600">点の経験を線にし、人生を物語として編み直す。</p>
              </div>
            </div>
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
              { num: "6", title: "安心して語れる場を守る", body: "この場で語られたことは、互いの信頼のもとに共有されています。ここでの対話を大切にし、安心して語れる場を守ります。" },
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
