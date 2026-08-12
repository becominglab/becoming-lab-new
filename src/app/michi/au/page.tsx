import Link from "next/link";

export const metadata = {
  title: "その道で、会う",
  description: "毎月一度、皇居に集まります。走っても、歩いても、懇親会だけでも。錦町ランニングクラブへの参加を、becoming lab では「その道で、会う」として案内しています。",
};

export default function AuPage() {
  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">MICHI</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">その道で、会う</h1>
          <p className="text-lg text-gray-600">毎月一度、皇居に集まります。</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>走るために集まって、会うために続いている会です。</p>
            <p>参加しているのは、走る人だけではありません。神田で事業を始めた人。歩くだけの人。懇親会からしか来ない人。</p>
            <p className="text-gray-500">速さの違いは、ここでは意味を持ちません。</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="p-6 bg-stone-50 border border-stone-200">
            <h2 className="font-bold text-gray-900 mb-3">この会について</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>これは、becoming lab のイベントではありません。</p>
              <p>錦町ランニングクラブは、地元の方と当ラボ主宰が、個人として続けている月1の会です。神田スタートアップコモンズの方々も参加されています。</p>
              <p>becoming lab では、この会への参加を「その道で、会う」として案内しています。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">当日の流れ</h2>
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">17:00 – 18:15</p>
              <h3 className="font-bold text-gray-900 mb-2">勉強会</h3>
              <p className="text-gray-600 text-sm leading-relaxed">問いを一つ持って、話す時間です。参加費はかかりません。</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">18:30 – 19:45</p>
              <h3 className="font-bold text-gray-900 mb-2">走る／歩く</h3>
              <p className="text-gray-600 text-sm leading-relaxed">皇居一周 約5km。ペース別に分かれて、ゆっくり動きます。歩いても構いません。話しながら進みます。</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">20:00 –</p>
              <h3 className="font-bold text-gray-900 mb-2">懇親会</h3>
              <p className="text-gray-600 text-sm leading-relaxed">肩書きを外して、同じテーブルを囲みます。実費をいただきます。</p>
            </div>
          </div>
          <p className="mt-8 text-gray-500 leading-relaxed">
            どれか一つだけでも構いません。勉強会だけでも。走るだけでも。懇親会だけでも。<br />
            途中参加も、途中退出も歓迎です。
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">はじめての方へ</h2>
          <ul className="space-y-3 text-gray-600">
            {[
              "初回は、主宰が一緒に行きます。現地で合流してから入りましょう",
              "走力は問いません。歩く方もいます",
              "一人での参加が大半です。知り合いがいなくて当然の場所です",
              "話さなくて大丈夫です。ただ動いて、ただ聞いていてください",
              "ゴールは完走ではありません。「来たこと」がゴールです",
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
            「行きます」と、一言ご連絡ください。<br />
            申込フォームはありません。集合場所は、ご連絡いただいた方に個別にお伝えします。
          </p>
          <div className="space-y-3 text-sm text-gray-600 border-t border-stone-200 pt-6">
            <p><span className="text-gray-400 inline-block w-16">参加費</span>勉強会は無料。懇親会は実費。</p>
            <p><span className="text-gray-400 inline-block w-16">雨天時</span>原則、雨天決行です。</p>
            <p><span className="text-gray-400 inline-block w-16">持ち物</span>動きやすい服装・靴、着替え、タオル、水分（多めに）</p>
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
