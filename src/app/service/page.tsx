import Link from "next/link";

export default function ServicePage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">SERVICE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Service</h1>
          <p className="text-lg text-gray-600">必要なタイミングで、必要な深さへ。</p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          {/* 導入文 */}
          <div className="mb-16">
            <p className="text-gray-600 leading-relaxed">
              自分で選んだ道だけでなく、1on1 セッション・講座をご希望の方はこちら。
            </p>
          </div>

          {/* 1on1 セッション */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">1on1 セッション</h2>
            <ul className="space-y-2 text-gray-600">
              <li>人生の軸を言葉にする</li>
              <li>判断に確信を持つ</li>
              <li>在り方を整える</li>
            </ul>
          </div>

          {/* 神夫養成講座 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">神夫養成講座</h2>
            <p className="text-sm text-gray-400 mb-6">by 大塚昌代 / 神夫養成研究所</p>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>家族という最も近い関係性から、人生を整える。<br />12週間の伴走型プログラム。ノウハウではなく、在り方を。</p>
              <p className="py-4 border-l-2 border-gray-200 pl-6 text-gray-500 italic">
                神夫とは、完璧な夫のことではありません。<br />
                夫婦が互いを高め合い、<br />
                「この人と出会えてよかった」と心から言える関係のこと。<br />
                その始まりは、いつも"あなた"から。
              </p>
              <div>
                <p className="font-medium text-gray-700 mb-3">大切にしていること</p>
                <ul className="space-y-2">
                  {['感情を敵にしない', '正しさより愛を選ぶ', '変えようとせず、在り方を変える', '比較を手放し、自分に還る', 'ALL WIN の循環を創る'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-3">こんな方へ</p>
                <ul className="space-y-2">
                  {['夫婦関係をもっと穏やかにしたい', '自分を大切にできるようになりたい', '子どもに誇れる夫婦でありたい', '我慢ではなく愛でつながりたい', '本当は、もっと幸せになりたい'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
              <div>
                <p className="font-medium text-gray-700 mb-3">こんな方へ</p>
                <ul className="space-y-2">
                  {['夫婦関係をもっと穏やかにしたい', '自分を大切にできるようになりたい', '子どもに誇れる夫婦でありたい', '我慢ではなく愛でつながりたい', '本当は、もっと幸せになりたい'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8">
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            ▶ 相談する
          </Link>
        </div>
      </section>
    </>
  );
}
