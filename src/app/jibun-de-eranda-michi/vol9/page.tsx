import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { eventJsonLd, breadcrumbJsonLd } from "@/content/event-schema";

export const metadata: Metadata = {
  title: "第九回 自分で選んだ道 vol.9",
  description:
    "株式会社KYTE代表・「大人のやさしいアートゼミ」主催の村上静香さんをお迎えしました。テーマは「同じ絵を見ているのに、見えているものが違う？」。アートを通じて「見る力」を考える夜。2026年11月17日（火）、神田錦町にて開催（終了・開催報告あり）。",
  alternates: { canonical: "/jibun-de-eranda-michi/vol9" },
  openGraph: {
    title: "第九回 自分で選んだ道 vol.9｜同じ絵を見ているのに、見えているものが違う？",
    description:
      "株式会社KYTE代表・村上静香さんをお迎えしました。2026年11月17日（火）、神田錦町にて開催。開催報告を掲載しています。",
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
            アートに触れたとき、
            <br />
            あなたの新しい扉が開く。
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
              愛知県豊橋市出身。法政大学で美術史や現代思想、芸術と社会の関係性を研究。大手デベロッパー、広報PR、人材育成ベンチャーを経て、2023年にKYTEを設立。
            </p>
            <p>
              アート鑑賞を仕事にし、年間約80回・300名以上にセッションを提供。個人向けのほか、チームビルディングなどを目的とした法人向け研修も行う。
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
              当日は、対話で楽しむアート鑑賞のミニ体験も行いました。
            </p>
          </div>
          <div className="mt-12">
            <Image
              src="/images/jibun-de-eranda-michi/vol9.jpg"
              alt="becoming lab vol.9 アートに触れたとき、あなたの新しい扉が開く。 村上静香"
              width={360}
              height={510}
              className="w-full max-w-sm mx-auto h-auto border border-stone-200"
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

      {/* Report */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-500 block mb-4">REPORT</span>
          <h2 className="text-2xl font-light mb-4 tracking-tight">開催を終えて</h2>
          <p className="text-sm text-stone-400 mb-12">
            この回は終了しました。2026年11月17日、村上静香さんをお迎えして開催しました。
          </p>

          <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 border-l-2 border-stone-600 pl-6">
            人生は何歳からでも変えられる。
            <br />
            そして、世界の見え方も変えられる。
          </p>

          <div className="space-y-6 text-stone-300 leading-relaxed">
            <p>
              前半は、静香さんの人生とキャリアのお話。映画の宣伝、英会話、まちづくり、ベンチャー企業など、さまざまな仕事を経験され、40歳を迎えたときに自分の事業を立ち上げることを決意。現在は、大好きだったアートを仕事にされています。
            </p>
            <p>
              印象的だったのは、「80歳まで楽しく働く」という人生の目標を持っていらっしゃること。私たちはつい、年齢や過去の経験、社会の常識によって、自分の可能性に制限をかけてしまいがちです。でも、人生の選択肢は本当はもっと自由で、いくつになっても広げることができる。
            </p>
            <p>
              一見、遠回りに思えるキャリアも、好きなことや大切にしたい価値観を探し続けることで、一つの道につながっていく。そんな静香さんの歩みに、人生を自分らしく選び続けることの大切さを感じました。
            </p>
            <p>
              後半は、アートを通じて「見る力」を考える時間。実際に一枚の絵を鑑賞するワークも体験しました。同じ絵を見ているのに、人によって注目するところも、感じることも、想像するストーリーもまったく違う。そして、自分が「見えている」と思っていることの中にも、実は思い込みがたくさんある。
            </p>
            <p className="text-white">
              私たちは無意識のうちに、「事実」と「自分の解釈」を混同してしまう。
            </p>
            <p>
              これは、仕事でも、夫婦関係でも、子育てでも、日常のあらゆる場面に通じることだと感じました。自分と違う見方に出会ったとき、それを否定するのではなく、「そんな見方もあるんだ！」と面白がれること。その積み重ねが、人への理解を深め、より豊かな人間関係や、寛容な社会につながっていくのだと思います。
            </p>
            <p>
              詳しいワークの内容はここでは控えますが、頭で理解するのと実際に体験するのとでは、気づきの深さがまったく違いました。
            </p>
            <p>
              そして、懇親会。becoming labで大切にしたい時間の一つです。年齢も仕事も、人生経験も違う人たちが集まり、それぞれの視点や価値観に触れる。誰かの話を聞きながら自分自身を振り返ったり、自分の考えを話すことで、初めて気づくことがあったり。アート鑑賞で学んだ「違う視点に触れることの価値」を、人との交流を通じても感じられる時間でした。
            </p>
            <p>
              人は、学びによって視野が広がり、出会いによって人生の可能性が広がっていく。そんなことを改めて実感した夜でした。
            </p>
            <p>静香さん、ご参加くださった皆さま、本当にありがとうございました。</p>
            <p className="pt-8 text-sm text-stone-500">becoming lab 主宰</p>
          </div>

          <div className="mt-16 pt-8 border-t border-white/20 text-center">
            <p className="text-xs tracking-[0.3em] text-stone-500 mb-4">NEXT</p>
            <p className="text-stone-300 mb-6">
              vol.10 は 2026年12月17日（木）、山川胡桃さん「人と人を繋ぎ、人に与える生き方」
            </p>
            <Link
              href="/jibun-de-eranda-michi/vol10"
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
