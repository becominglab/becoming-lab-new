import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { eventJsonLd, breadcrumbJsonLd } from "@/content/event-schema";

const APPLY_URL = "https://forms.gle/y2NegAebsgLGruJn9";

export const metadata: Metadata = {
  title: "第十回 自分で選んだ道 vol.10",
  description:
    "SPEAR HEADS株式会社 代表取締役の山川胡桃さんをお迎えします。テーマは「人と人を繋ぎ、人に与える生き方」。営業やMCを通じて人をつなぐ、その原点を伺います。2026年12月17日（木）19:30より、神田錦町にて開催。",
  alternates: { canonical: "/jibun-de-eranda-michi/vol10" },
  openGraph: {
    title: "第十回 自分で選んだ道 vol.10｜人と人を繋ぎ、人に与える生き方",
    description:
      "SPEAR HEADS株式会社 代表取締役・山川胡桃さんをお迎えします。2026年12月17日（木）19:30より、神田錦町にて開催。",
    url: "https://becominglab.life/jibun-de-eranda-michi/vol10",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
  },
};

const forYou = [
  "人と人をつなぐ仕事や役割に、関心がある",
  "「まず自分から与える」という姿勢の、背景を聞いてみたい",
  "若くして起業した人の、道の選び方に触れたい",
  "これからの自分の仕事や生き方を考えたい",
];

export default function Vol10Page() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <JsonLd data={eventJsonLd(10)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "自分で選んだ道", path: "/jibun-de-eranda-michi" },
          { name: "vol.10 山川胡桃", path: "/jibun-de-eranda-michi/vol10" },
        ])}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
            「自分で選んだ道」 vol.10
          </span>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
            人と人を繋ぎ、
            <br />
            <span className="font-normal">人に与える生き方</span>
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
            営業代行、MCも得意な若き経営者。
            <br />
            人をつなぐ胡桃さんの原点へ。
          </p>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-12 px-8 py-4 bg-stone-900 text-white hover:bg-stone-700 transition-colors duration-300"
          >
            <span className="text-sm">▶</span>
            <span>参加を申し込む</span>
          </a>
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
            <p className="text-lg font-light">山川 胡桃</p>
            <p>SPEAR HEADS株式会社 代表取締役。</p>
            <p>営業代行・営業支援を展開し、MCも得意。歌って踊って、よく喋る元アイドル。</p>
            <p>趣味はランニング、銭湯、サウナと、その後のお酒。屋上農園づくりを構想中。</p>
            <p className="pt-4 border-t border-stone-200 text-stone-600 italic">
              その根底にあるのは、まず自分から与える姿勢。
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
            その生き方は、
            <br />
            どこから生まれたのか。
          </h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p>営業やMCを通じて、人と人をつなぐ胡桃さん。</p>
            <p>その根底にあるのは、まず自分から与える姿勢です。その生き方は、どこから生まれたのでしょうか。</p>
            <p>幼少期の経験から、今、大切にしている想いまで。なぜ、その想いをカタチにしたいのか。</p>
            <p>屋上農園という夢も交えながら、胡桃さんが「自分で選んだ道」を伺います。</p>
          </div>
          <div className="mt-12">
            <Image
              src="/images/jibun-de-eranda-michi/vol10.jpg"
              alt="becoming lab vol.10 人と人を繋ぎ、人に与える生き方 山川胡桃"
              width={360}
              height={509}
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
                2026年12月17日（木）
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
              記念すべき第十回は、山川胡桃さんです。
              <br />
              営業代行の会社を率い、MCとして場をつくり、人と人をつないでいる人です。
            </p>
            <p>
              なぜ、まず自分から与えるのか。
              <br />
              その姿勢の原点を、幼少期の経験からたどります。
            </p>
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
