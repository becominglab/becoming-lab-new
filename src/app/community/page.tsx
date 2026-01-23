import Link from "next/link";

export default function CommunityPage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">COMMUNITY</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Community</h1>
          <p className="text-lg text-gray-600">語りが、日常へと続いていく場所。</p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          {/* コミュニティとは */}
          <div className="mb-16">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>becoming lab のコミュニティは、語り部の会で生まれた言葉や気づきが、日常の時間へとゆっくり溶け込んでいく場です。</p>
              <p>語る／聴く、だけで終わらず、一緒に過ごし、動き、対話する中で、人生が少しずつ更新されていきます。</p>
            </div>
          </div>

          {/* 大切にしている空気感 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">大切にしている空気感</h2>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>無理に話さなくていい</li>
              <li>立派なことを言わなくていい</li>
              <li>未完成のままでいていい</li>
            </ul>
            <p className="text-gray-500">ここは、自分を整えながら、他者と重なっていく場です。</p>
          </div>

          {/* 主な活動 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-8">主な活動</h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">語り部の会（月1回）</h3>
                <p className="text-gray-600 text-sm">人生の途中を語り、聴き合う時間。すべての活動の起点です。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">食事会</h3>
                <p className="text-gray-600 text-sm">肩書きや役割を外し、同じテーブルを囲んで言葉を交わします。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">ランニング・トライアスロン</h3>
                <p className="text-gray-600 text-sm">皇居ランや練習体験会など、身体を動かしながら、自分と向き合う時間。初心者の方も歓迎しています。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">勉強会・対話会</h3>
                <p className="text-gray-600 text-sm">仕事・家族・人生について、正解を探すのではなく、問いを深める場。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">合宿・リトリート（不定期）</h3>
                <p className="text-gray-600 text-sm">日常を離れ、人生全体を見渡すための時間。</p>
              </div>
            </div>
          </div>

          {/* コミュニティとの関わり方 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">コミュニティとの関わり方</h2>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>参加は自由</li>
              <li>継続は義務ではありません</li>
              <li>参加と距離の取り方は、自分で決められます</li>
            </ul>
            <p className="text-gray-500">必要なタイミングで、必要な関わり方を。</p>
          </div>

          {/* ここから、次へ */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ここから、次へ</h2>
            <p className="text-gray-600 mb-4">コミュニティでの時間を通して、</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>もっと言葉にしてみたい</li>
              <li>自分の人生を棚卸ししたい</li>
              <li>関係性や在り方を深めたい</li>
            </ul>
            <p className="text-gray-500">そう感じたときは、語り部の会や、1on1 コーチング、講座へと自然につながっていきます。</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8 space-y-4">
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ 開催情報を受け取る
          </Link>
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ コミュニティについて相談する
          </Link>
        </div>
      </section>
    </>
  );
}
