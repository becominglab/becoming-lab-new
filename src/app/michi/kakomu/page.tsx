import Link from "next/link";

export const metadata = {
  title: "その道を、囲む",
  description: "8名で、一つのテーブルを囲みます。肩書きも名刺交換もない、月に一度の食事会。becoming lab 主催、2026年9月より。",
};

export default function KakomuPage() {
  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">MICHI</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">その道を、囲む</h1>
          <p className="text-lg text-gray-600">8名で、一つのテーブルを囲みます。</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>大人数では、話せないことがあります。</p>
            <p>場が温まる前に終わってしまう。隣の人としか、話せずに終わる。</p>
            <p className="text-gray-500">だから、一つのテーブルを全員で囲めるだけの人数で始めます。</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="p-6 bg-stone-50 border border-stone-200">
            <h2 className="font-bold text-gray-900 mb-3">この会について</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>becoming lab が主催する、月に一度の食事会です。2026年9月より始めます。</p>
              <p>定員は8名まで。9名を超えると、会話が二つに割れてしまうためです。感じがいいからではなく、物理的な必然です。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">ここでのお約束</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">肩書きを言いません</h3>
              <p className="text-gray-600 text-sm leading-relaxed">何をしている人か、ではなく、今、何を更新しているかを話します。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">名刺交換をしません</h3>
              <p className="text-gray-600 text-sm leading-relaxed">ここは営業の場ではありません。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">問いを一つ、全員で持ちます</h3>
              <p className="text-gray-600 text-sm leading-relaxed">乾杯のあと、その日の問いを置きます。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">当日の流れ</h2>
          <div className="space-y-3">
            {[
              ["19:00", "乾杯／お約束の確認"],
              ["19:05", "一人ずつ、今の一言"],
              ["19:15", "今日の問いを置く"],
              ["20:00", "席替え（一度だけ）"],
              ["20:50", "一人ずつ、今日の一言"],
              ["21:00", "終了"],
            ].map(([time, label]) => (
              <div key={time} className="flex items-start gap-6 text-sm">
                <span className="text-gray-400 w-14 flex-shrink-0">{time}</span>
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">はじめての方へ</h2>
          <ul className="space-y-3 text-gray-600">
            {[
              "立派なことを言う必要はありません",
              "話したくないことは、話さなくて構いません",
              "うまくまとまっていない話ほど、この場に向いています",
              "一人での参加が大半です",
              "席替えがあります。特定の人としか話せずに終わることはありません",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-stone-400 mt-1">・</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">参加方法</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            「参加したい」と、一言ご連絡ください。<br />
            申込フォームはありません。定員8名のため、先着とさせていただきます。日程・会場は、ご連絡いただいた方に個別にお伝えします。
          </p>
          <div className="space-y-3 text-sm text-gray-600 border-t border-stone-200 pt-6">
            <p><span className="text-gray-400 inline-block w-16">参加費</span>実費のみ</p>
            <p><span className="text-gray-400 inline-block w-16">場所</span>東京・神田／日本橋周辺</p>
          </div>
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              フォームから、ひとこと「行きます」とお送りください。それだけで十分です。
            </p>
            <Link href="/contact" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
              ▶ 連絡する
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8 space-y-4">
          <Link href="/michi/kiroku" className="block text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ あの日の記録を読む
          </Link>
          <Link href="/michi" className="block text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ ほかの道を見る
          </Link>
        </div>
      </section>
    </>
  );
}
