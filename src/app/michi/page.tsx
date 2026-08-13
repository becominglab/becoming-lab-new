import Link from "next/link";
import { upcoming, jpDate } from "@/content/michi";

export const metadata = {
  title: "道 ｜ 東京・神田のコミュニティ活動",
  description:
    "東京・神田を拠点とするコミュニティ becoming lab の活動一覧。月1回のトークイベント「自分で選んだ道」、皇居ランと勉強会、8名の食事会。申込フォームはありません。一言のご連絡で参加できます。",
  alternates: { canonical: "https://becominglab.life/michi" },
  openGraph: {
    title: "道 ｜ becoming lab",
    description: "会う、整う、更新する。東京・神田で続いているコミュニティ活動です。",
    url: "https://becominglab.life/michi",
    type: "website",
  },
};

const branches = [
  {
    href: "/michi/au",
    title: "その道で、会う",
    body: "毎月一度、皇居に集まります。走っても、歩いても、懇親会だけでも。",
  },
  {
    href: "/michi/kakomu",
    title: "その道を、囲む",
    body: "8名で、一つのテーブルを囲みます。大人数では話せないことを、話すために。",
  },
];

export default function MichiPage() {
  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">MICHI</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">道</h1>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>自分で選んだ道は、一人で歩くものだと思っていました。</p>
            <p>でも、同じ道を歩いている人が、います。</p>
            <p className="pt-2 text-gray-500">会う。囲む。becoming lab の、いくつかの道です。</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="rounded-2xl border border-[#1B6B7A]/20 p-6 md:p-8" style={{ backgroundColor: "rgba(27,107,122,0.03)" }}>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-5" style={{ color: "#1B6B7A" }}>次に会える日</p>
            <div className="space-y-6">
              {upcoming.map((e) => (
                <div key={e.slug}>
                  <p className="text-sm text-gray-500 mb-1">
                    {e.date ? jpDate(e.date) : "日程調整中"}
                  </p>
                  <h2 className="font-bold text-gray-900 mb-1">{e.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{e.summary}</p>
                  <Link href={`/michi/${e.slug}`} className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
                    詳しく見る →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">自分で選んだ道</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed mb-6">
            <p>月に一度、一人のスピーカーが人生の途中を語ります。</p>
            <p>成功談ではなく、未完成のままの物語を。ここから、すべての道が始まりました。</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/jibun-de-eranda-michi" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
              詳しく見る →
            </Link>
            <Link href="/jibun-de-eranda-michi/archive" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
              過去の物語を読む →
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-8">
            {branches.map((b) => (
              <Link key={b.href} href={b.href} className="block border-l-2 border-stone-200 pl-6 hover:border-[#1B6B7A] transition-colors">
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">参加のしかた</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>申込フォームは、ありません。「行きたい」と、一言ご連絡ください。それだけで十分です。</p>
            <p>集合場所や詳細は、個別にお伝えします。初めての方には、こちらから一緒に行きます。</p>
            <p className="text-gray-500">予定が変わったら、当日でも構いません。来られなくなったことを、気に病まないでください。</p>
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
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あの日の記録</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed mb-6">
            <p>会が終わった翌日、その日いた人たちの言葉が、ここに並びます。</p>
            <p className="text-gray-500">名前を忘れても、言葉は残ります。</p>
          </div>
          <Link href="/michi/kiroku" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            記録を読む →
          </Link>
        </div>
      </section>
    </>
  );
}
