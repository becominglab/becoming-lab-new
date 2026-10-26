import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { eventJsonLd, breadcrumbJsonLd } from "@/content/event-schema";

const APPLY_URL = "https://forms.gle/8x1qmNzxRV1buezH6";

export const metadata: Metadata = {
  title: "第九回 自分で選んだ道 vol.9",
  description:
    "株式会社KYTE代表・「大人のやさしいアートゼミ」主催の村上静香さんをお迎えします。テーマは「同じ絵を見ているのに、見えているものが違う？」。対話で楽しむアート鑑賞のミニ体験つき。2026年11月17日（火）19:30より、神田錦町にて開催。",
  alternates: { canonical: "/jibun-de-eranda-michi/vol9" },
  openGraph: {
    title: "第九回 自分で選んだ道 vol.9｜同じ絵を見ているのに、見えているものが違う？",
    description:
      "株式会社KYTE代表・村上静香さんをお迎えします。対話で楽しむアート鑑賞のミニ体験つき。2026年11月17日（火）19:30より、神田錦町にて開催。",
    url: "https://becominglab.life/jibun-de-eranda-michi/vol9",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
  },
};

const scenes = [
  "同じ説明を聞いても、人によって受け取り方が違う",
  "「当然伝わっている」と思っていたことが、伝わっていない",
  "新しい発想がほしいのに、いつもの考え方から抜け出せない",
];

const forYou = [
  "人を理解したい",
  "チームの対話を深めたい",
  "これからの自分の仕事や生き方を考えたい",
  "アートの知識はないけれど、少し気になっている",
];

export default function Vol9Page() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <JsonLd data={eventJsonLd(9)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "自分で選んだ道", path: "/jibun-de-eranda-michi" },
          { name: "vol.9 村上静香", path: "/jibun-de-eranda-michi/vol9" },
        ])}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
            「自分で選んだ道」 vol.9
          </span>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
            同じ絵を見ているのに、
            <br />
            <span className="font-normal">見えているものが違う？</span>
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
            アート鑑賞 × 対話 × 起業
          </p>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* Speaker */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">SPEAKER</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">スピーカーについて</h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p className="text-lg font-light">村上 静香（むらかみ しずか）</p>
            <p>株式会社KYTE 代表。「大人のやさしいアートゼミ」主催。</p>
            <p>
              大手デベロッパー、広報PR、人材育成ベンチャーを経て、2023年にKYTEを設立。対話で楽しむアート鑑賞を、仕事にしている。
            </p>
            <p>
              どんな経験や想いが、アート鑑賞を仕事にする選択につながったのか。前回の「記憶とアイデンティティ」のお話にもつながる、その方ならではの選択の背景を伺います。
            </p>
            <p className="pt-4 border-t border-stone-200 text-stone-600 italic">
              一枚の絵を前に、「何が見える？」「どこからそう感じた？」
            </p>
            <p className="text-stone-500">完成された答えではなく、途中のまま語る、その一夜。</p>
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">THEME</span>
          <h2 className="text-2xl font-light mb-8 tracking-tight">
            アートと仕事に、
            <br />
            どんな関係があるの？
          </h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p>今回の入り口は、アート鑑賞です。そう聞いて、首をかしげる方もいるかもしれません。</p>
            <p>例えば、職場でこんなことはありませんか。</p>
            <ul className="space-y-3 pl-1">
              {scenes.map((t) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p>
              一枚の絵を前に、「何が見える？」「どこからそう感じた？」と対話してみる。そこには、自分の見方のクセや、相手の視点に気づくヒントがあります。
            </p>
            <p>
              当日は、対話で楽しむアート鑑賞のミニ体験も予定しています。アートの知識がない方も、ご自身が感じたことを入り口にご参加いただけます。
            </p>
          </div>
        </div>
      </section>

      {/* Event details */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">EVENT DETAILS</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">開催概要</h2>
          <div className="border border-stone-200 divide-y divide-stone-200 bg-white">
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">日時</div>
              <div className="px-4 py-4 text-stone-800">
                2026年11月17日（火）
                <br />
                開場 19:15 / 19:30〜21:30
                <br />
                <span className="text-sm text-stone-500">※懇親会を含みます</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">場所</div>
              <div className="px-4 py-4 text-stone-800">
                神田SDGsコネクション 3階
                <br />
                <span className="text-sm text-stone-500">東京都千代田区神田錦町2-9-15</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">参加費</div>
              <div className="px-4 py-4 text-stone-800">
                3,000円（税込）
                <br />
                <span className="text-sm text-stone-500">※懇親会費を含みます</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For you */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">FOR YOU</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">こんな方へ</h2>
          <ul className="space-y-4">
            {forYou.map((t) => (
              <li key={t} className="flex items-start gap-4 text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5 flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* From host */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">FROM HOST</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">この会について</h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p>becoming labでは、毎回一人のスピーカーに、人生の途中を語ってもらっています。</p>
            <p>
              今回は、アート鑑賞を仕事にしている村上さんです。
              <br />
              デベロッパー、広報PR、人材育成。いくつもの場所を経て、「絵を前に対話する」ことを選んだ人です。
            </p>
            <p>
              同じ絵を見ているのに、見えているものが違う。
              <br />
              それは職場でも、家庭でも、毎日起きていることかもしれません。
            </p>
            <p>いつもとは少し違う角度から、自分と相手を見つめる夜をご一緒しませんか。</p>
            <p>初めての方も、お久しぶりの方も歓迎です。皆さまとお会いできることを楽しみにしています。</p>
            <p className="pt-8 text-sm text-stone-500">becoming lab 主宰</p>
          </div>
        </div>
      </section>

      {/* Join */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-stone-500 block mb-4">JOIN US</span>
          <h2 className="text-2xl font-light mb-8 tracking-tight">参加申し込み</h2>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300"
          >
            <span className="text-sm">▶</span>
            <span>参加を申し込む</span>
          </a>
          <p className="text-sm text-stone-500 mt-8">※ 定員に達し次第、締め切らせていただきます</p>
          <p className="mt-10">
            <Link href="/jibun-de-eranda-michi" className="text-sm text-stone-400 hover:text-white transition-colors">
              ← 「自分で選んだ道」一覧へ
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
