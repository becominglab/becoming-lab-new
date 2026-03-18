import Link from "next/link";
import DailyQuestionBlock from "@/components/DailyQuestionBlock";

export const metadata = {
  title: "becoming lab | 更新を重ねる人生を",
  description:
    "人生に完成はない。人は何度でも変わっていける。becoming labは「なりつづける人生」を生きる人のための場所です。",
};

export default function TopPage() {
  return (
    <>
      {/* ═══════════════════════════════════════
          ① HERO — 3秒で止める
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center -mt-16 pt-16 overflow-hidden">
        {/* Background — atmospheric morning light */}
        <div
          className="absolute inset-0 animate-hero-bg"
          style={{
            background:
              "linear-gradient(160deg, #F7F6F3 0%, #EDE9E3 30%, #D9D2C7 60%, #C5BFB4 100%)",
          }}
        />
        <div
          className="absolute inset-0 animate-hero-bg"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
          <h1
            className="text-3xl md:text-[2.8rem] font-light leading-[1.6] md:leading-[1.7] tracking-tight animate-hero-copy"
            style={{ color: "#111" }}
          >
            更新を重ねる人生を。
            <br />
            <span className="block mt-2 text-2xl md:text-[2rem] text-stone-500">
              人は、何度でも変わっていける。
            </span>
          </h1>

          <div className="mt-10 md:mt-12 space-y-4 animate-hero-sub">
            <p
              className="text-sm md:text-base font-light leading-[2] tracking-wide"
              style={{ color: "#555" }}
            >
              人生に、完成はない。
              <br />
              迷いながら、
              <br className="md:hidden" />
              選び直しながら、
              <br />
              それでも進んでいく。
            </p>
          </div>

          <div className="mt-12 md:mt-14 flex flex-col sm:flex-row gap-4 justify-center animate-hero-cta">
            <Link
              href="/concept"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-wider transition-all duration-300 hover:opacity-80"
              style={{ backgroundColor: "#111", color: "#fff" }}
            >
              思想を知る
            </Link>
            <Link
              href="/jibun-de-eranda-michi"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-wider border transition-all duration-300 hover:bg-black/5"
              style={{ borderColor: "#111", color: "#111" }}
            >
              物語を読む
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-indicator">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "#999" }}>
              Scroll
            </span>
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #999, transparent)" }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ② WHY WE CHANGE — 共鳴
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-36 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-10" style={{ color: "#B8A88A" }}>
            Why We Change
          </p>
          <div className="space-y-6 text-base md:text-lg font-light leading-[2.2]" style={{ color: "#333" }}>
            <p>
              人は、
              <br />
              変わりたいと思いながら、
              <br />
              変われずにいる。
            </p>
            <p>
              忙しさの中で、
              <br />
              本当の声を後回しにしてしまう。
            </p>
            <p>
              気づけば、
              <br />
              誰かの期待の中で生きている。
            </p>
          </div>
          <div className="mt-16 pt-10 border-t border-stone-200">
            <p
              className="text-lg md:text-xl font-light italic leading-relaxed"
              style={{ color: "#111" }}
            >
              あなたは今、
              <br />
              更新し続けていますか？
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ③ PHILOSOPHY — 問い→気づき→再定義
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-36" style={{ backgroundColor: "#F7F6F3" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-10" style={{ color: "#B8A88A" }}>
            Philosophy
          </p>

          {/* 問い */}
          <p
            className="text-lg md:text-xl font-light italic leading-relaxed mb-12"
            style={{ color: "#111" }}
          >
            あなたは、
            <br />
            どこかで「完成」を目指していませんか。
          </p>

          {/* 気づき */}
          <div className="w-px h-12 bg-stone-300 mx-auto mb-12" />
          <div className="space-y-5 text-sm md:text-base font-light leading-[2]" style={{ color: "#555" }}>
            <p>
              「Being」は「在る」こと。
              <br />
              「Becoming」は「なりつつある」こと。
            </p>
          </div>

          {/* 再定義 */}
          <div className="w-px h-12 bg-stone-300 mx-auto my-12" />
          <p
            className="text-lg md:text-xl font-light leading-relaxed"
            style={{ color: "#111" }}
          >
            人生に、完成はない。
            <br />
            だからこそ、
            <br />
            更新し続けることに意味がある。
          </p>

          <Link
            href="/concept"
            className="inline-block mt-12 text-sm tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: "#1B6B7A" }}
          >
            思想を読む →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ④ STORY — Before / Turning Point / Now
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-36 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-10 text-center" style={{ color: "#B8A88A" }}>
            Story
          </p>

          {/* Story card */}
          <div className="border border-stone-200 p-8 md:p-10 mb-8">
            <div className="space-y-8">
              {/* Before */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#B8A88A" }}>
                  Before
                </p>
                <p className="text-sm font-light leading-[2] text-stone-500">
                  期待に応えて生きてきた。
                  <br />
                  それが間違いだとは思わない。
                  <br />
                  ただ自分の声を、後回しにしてきた。
                </p>
              </div>

              <div className="w-8 h-px bg-stone-200 mx-auto" />

              {/* Turning Point */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#1B6B7A" }}>
                  Turning Point
                </p>
                <p className="text-sm font-light leading-[2]" style={{ color: "#333" }}>
                  自分で選んだ道を歩く。
                  <br />
                  その覚悟が、静かに芽生えた。
                </p>
              </div>

              <div className="w-8 h-px bg-stone-200 mx-auto" />

              {/* Now */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#111" }}>
                  Now
                </p>
                <p className="text-sm font-light leading-[2]" style={{ color: "#333" }}>
                  迷いは消えない。
                  <br />
                  でも、更新し続けることを選んでいる。
                </p>
              </div>
            </div>
          </div>

          {/* Closing message */}
          <p className="text-center text-sm font-light italic text-stone-400 mb-8">
            次に更新されるのは、あなたの物語かもしれません。
          </p>

          <div className="text-center">
            <Link
              href="/jibun-de-eranda-michi"
              className="inline-block text-sm tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: "#1B6B7A" }}
            >
              物語を読む →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ⑤ DAILY QUESTION — 再訪導線
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-36" style={{ backgroundColor: "#F7F6F3" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-10" style={{ color: "#B8A88A" }}>
            Today&apos;s Question
          </p>
          <DailyQuestionBlock />
          <p className="text-[11px] text-stone-400 mt-8 font-light">
            この問いは毎日変わります。
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ⑥ BEGINNING — 最初の一歩
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-36" style={{ backgroundColor: "#1C2D3F" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-10" style={{ color: "#B8A88A" }}>
            Beginning
          </p>
          <h2 className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight text-white mb-4">
            最初の一歩は、
            <br />
            小さくていい。
          </h2>
          <p className="text-sm font-light text-stone-400 mb-12">
            なりつづける人生に、興味があるあなたへ。
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-sm tracking-wider transition-all duration-300 hover:bg-stone-100"
            style={{ color: "#1C2D3F" }}
          >
            話してみる
          </Link>
        </div>
      </section>
    </>
  );
}
