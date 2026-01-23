import Link from "next/link";

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

          {/* 語り部という在り方 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">語り部という在り方</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>語り部は、完成した人ではありません。途中のまま語る人です。</p>
              <p>語ることで輪郭が生まれ、聴くことで重なり、次の語りが生まれます。</p>
            </div>
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
