import Link from "next/link";

export default function KataribePage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">KATARIBE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">語り部の会</h1>
        </div>
      </section>

      {/* メインコンテンツ（白背景でまとめる） */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          {/* 語り部の会とは */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">語り部の会とは</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>月に一度、一人の語り部が人生の途中を語ります。</p>
              <p>成功談ではありません。未完成のままの物語です。</p>
            </div>
          </div>

          {/* この場で起きていること */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">この場で起きていること</h2>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>評価されない</li>
              <li>教えられない</li>
              <li>比較されない</li>
            </ul>
            <p className="text-gray-500">ただ、語られ、聴かれる。</p>
          </div>

          {/* 語り部になるという体験 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">語り部になるという体験</h2>
            <p className="text-gray-600 mb-4">語る側にとって、</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>人生が整理される</li>
              <li>経験が意味に変わる</li>
              <li>自分の歩みが肯定される</li>
            </ul>
            <p className="text-gray-500">それ自体が、深い成功体験になります。</p>
          </div>

          {/* これまでの語り部 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">これまでの語り部</h2>
            <Link href="/kataribe/archive" className="text-[#1B6B7A] hover:opacity-70 transition-opacity">
              ▶ アーカイブを見る
            </Link>
          </div>
        </div>
      </section>

      {/* CTA（ティール背景は最後だけ） */}
      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8 space-y-4">
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ 語り部の会に参加する
          </Link>
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ 開催情報を受け取る
          </Link>
        </div>
      </section>
    </>
  );
}
