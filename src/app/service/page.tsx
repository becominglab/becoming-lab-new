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
              語り部の会だけでなく、1on1 コーチング・講座をご希望の方はこちら。
            </p>
          </div>

          {/* 1on1 コーチング */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">1on1 コーチング</h2>
            <ul className="space-y-2 text-gray-600">
              <li>人生の軸を言葉にする</li>
              <li>判断に確信を持つ</li>
              <li>在り方を整える</li>
            </ul>
          </div>

          {/* 神夫養成講座 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">神夫養成講座</h2>
            <ul className="space-y-2 text-gray-600">
              <li>家族という最も近い関係性から人生を整える</li>
              <li>12週間の伴走型</li>
              <li>ノウハウではなく在り方</li>
            </ul>
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
