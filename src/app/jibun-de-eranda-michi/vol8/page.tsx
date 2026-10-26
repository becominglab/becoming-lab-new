import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { eventJsonLd, breadcrumbJsonLd } from "@/content/event-schema";

export const metadata: Metadata = {
  title: "第八回 自分で選んだ道 vol.8",
  description:
    "臨床心理士・公認心理師の伊藤有梨花さんをお迎えしました。テーマは「心は、測れるのか。」。記憶とアイデンティティ、そして組織の未来。2026年10月21日（水）、神田錦町にて開催（終了・開催報告あり）。",
  alternates: { canonical: "/jibun-de-eranda-michi/vol8" },
  openGraph: {
    title: "第八回 自分で選んだ道 vol.8｜心は、測れるのか。",
    description:
      "臨床心理士・公認心理師の伊藤有梨花さんをお迎えしました。2026年10月21日（水）、神田錦町にて開催。開催報告を掲載しています。",
    url: "https://becominglab.life/jibun-de-eranda-michi/vol8",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
  },
};

const forYou = [
  "「心を測る」ということに、興味がある",
  "過去の経験が、今の自分にどう影響しているのか考えてみたい",
  "研究や専門職から、起業へという道に関心がある",
  "組織の中で、立場によるズレを感じている",
];

export default function Vol8Page() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <JsonLd data={eventJsonLd(8)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "自分で選んだ道", path: "/jibun-de-eranda-michi" },
          { name: "vol.8 伊藤有梨花", path: "/jibun-de-eranda-michi/vol8" },
        ])}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
            「自分で選んだ道」 vol.8
          </span>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
            心は、
            <br />
            <span className="font-normal">測れるのか。</span>
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
            心理学 × 測定論 × 起業
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
            <p className="text-lg font-light">伊藤 有梨花（いとう ゆりか）</p>
            <p>臨床心理士・公認心理師。</p>
            <p>
              大学院修了後、スクールカウンセラー、精神科研究室、医療系統計解析を経験。2020年より適性検査SPIの研究開発に携わる。2026年1月よりNTTドコモで、AIによる性格・価値観推定を研究。
            </p>
            <p>
              現在は、組織の3層間のズレを可視化するHR SaaS「LayerScope」を開発中。
            </p>
            <p className="pt-4 border-t border-stone-200 text-stone-600 italic">
              自伝的記憶の研究から、心を測る技術、そして起業へ。
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
            過去の経験は、
            <br />
            今の自分をどう形作るのか。
          </h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p>
              人の記憶を研究し、適性検査をつくり、AIで性格や価値観を推定する。伊藤さんはずっと、目に見えない「心」を数字にする仕事をしてきました。
            </p>
            <p>
              心は、本当に測れるのか。測れたとして、それは何のためなのか。研究から技術へ、そして起業へと進んできた歩みの途中を、聞かせてもらいます。
            </p>
          </div>
          <div className="mt-12">
            <Image
              src="/images/jibun-de-eranda-michi/vol8.jpg"
              alt="becoming lab vol.8 心は、測れるのか。 伊藤有梨花"
              width={1414}
              height={2000}
              className="w-full h-auto border border-stone-200"
            />
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
                2026年10月21日（水）
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
            <p>
              becoming labでは、毎回一人のスピーカーに、人生の途中を語ってもらっています。
            </p>
            <p>
              今回は、心を測る技術を仕事にしてきた伊藤さんです。
              <br />
              研究室にいた人が、企業で検査をつくり、AIに向き合い、いま自分の会社をつくろうとしている。
            </p>
            <p>
              過去の経験が今の自分をどう形作ってきたのか。
              <br />
              それは、伊藤さんの研究テーマであると同時に、伊藤さん自身の道の話でもあります。
            </p>
            <p>その話を、途中のまま聞かせてもらいます。</p>
            <p>皆さまとお会いできることを楽しみにしています。</p>
            <p className="pt-8 text-sm text-stone-500">becoming lab 主宰</p>
          </div>
        </div>
      </section>

      {/* Report — 開催後に追加 */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-500 block mb-4">REPORT</span>
          <h2 className="text-2xl font-light mb-4 tracking-tight">開催を終えて</h2>
          <p className="text-sm text-stone-400 mb-12">
            この回は終了しました。2026年10月21日、伊藤有梨花さんをお迎えして開催しました。
          </p>

          <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 border-l-2 border-stone-600 pl-6">
            自分をつくっているのは、
            <br />
            過去の記憶かもしれない。
          </p>

          <div className="space-y-6 text-stone-300 leading-relaxed">
            <p>
              テーマは「心は測れるのか？ 〜記憶とアイデンティティ、そして組織の未来〜」。臨床心理士・公認心理師としての専門性を持ち、心理測定や機械学習の研究に取り組む伊藤さんに、研究から起業へと続く道の途中を聞かせていただきました。
            </p>
            <p>
              私たちは普段、自分の性格や価値観を、これまでの経験によって形成されたものだと考えています。けれど実際には「何を経験したか」だけでなく、「その経験をどう記憶し、どう意味づけているか」が、今の自分を形づくっているそうです。
            </p>
            <p className="text-white">
              「過去の記憶の捉え方が変われば、今の自分も、未来の可能性も変わる」
            </p>
            <p>
              同じ出来事でも、当時は失敗だと思っていたことが、今振り返ると人生の転機だったりする。辛かった経験も、時間が経ち、新しい視点を持つことで、自分にとっての意味が変わっていく。becoming labが大切にしている「更新を重ねる人生」にも、まっすぐつながる話でした。
            </p>
            <p>
              伊藤さんが開発に取り組んでいる「レイヤースコープ」の話も印象的でした。経営層、管理職、現場。同じ組織にいても、立場によって見えている景色や判断基準は違う。それぞれが正しいと思って行動していても、その認識のズレが摩擦を生む。目に見えない心や認識の違いを可視化することで、組織のコミュニケーションを変えていく試みです。
            </p>
            <p>
              後半は、自分自身の記憶を振り返るワークショップ。自分らしさを表す言葉は何か。その言葉につながる具体的な記憶は。その経験は、今の自分にどんな影響を与えているのか。今振り返ると、その出来事にはどんな意味があるのか。参加者同士で共有しながら、自分でも気づいていなかった価値観を見つめ直す時間になりました。
            </p>
            <p>
              過去は変えられない。でも、過去の意味づけは変えられる。そして、その意味づけが変わることで、これからの選択も変わっていく。人は何歳からでも変われる。その可能性を、心理学という新しい視点から感じた夜でした。
            </p>
            <p>伊藤さん、ご参加くださった皆さま、本当にありがとうございました。</p>
            <p className="pt-8 text-sm text-stone-500">becoming lab 主宰</p>
          </div>

          <div className="mt-16 pt-8 border-t border-white/20 text-center">
            <p className="text-xs tracking-[0.3em] text-stone-500 mb-4">NEXT</p>
            <p className="text-stone-300 mb-6">
              vol.9 は 2026年11月17日（火）、村上静香さん「同じ絵を見ているのに、見えているものが違う？」
            </p>
            <Link
              href="/jibun-de-eranda-michi/vol9"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300"
            >
              <span className="text-sm">▶</span>
              <span>次回の詳細を見る</span>
            </Link>
            <p className="mt-10">
              <Link href="/jibun-de-eranda-michi" className="text-sm text-stone-400 hover:text-white transition-colors">
                ← 「自分で選んだ道」一覧へ
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
