import Link from "next/link";

export const metadata = {
  title: "becoming lab | 更新を重ねる人生を",
  description:
    "人生に完成はない。迷いながら、選び直しながら、それでも進む。becoming labは「なりつづける人生」を生きる人のための場所です。",
};

export default function TopPage() {
  return (
    <>
      {/* ═══════════════════════════════════════
          HERO — 100vh / 3秒で心を掴む
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center -mt-16 pt-16 overflow-hidden">
        {/* Background — atmospheric gradient (morning light) */}
        <div
          className="absolute inset-0 animate-hero-bg"
          style={{
            background:
              "linear-gradient(160deg, #F7F6F3 0%, #EDE9E3 30%, #D9D2C7 60%, #C5BFB4 100%)",
          }}
        />

        {/* Subtle light overlay */}
        <div
          className="absolute inset-0 animate-hero-bg"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Content — centered */}
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
          {/* Main Copy */}
          <h1
            className="text-3xl md:text-[2.8rem] font-light leading-[1.6] md:leading-[1.7] tracking-tight animate-hero-copy"
            style={{ color: "#111" }}
          >
            更新を重ねる人生を。
            <br />
            <span className="block mt-1">
              自分で選んだ道を、
            </span>
            <span className="block mt-1">
              生きる。
            </span>
          </h1>

          {/* Sub Copy */}
          <div className="mt-10 md:mt-12 space-y-4 animate-hero-sub">
            <p
              className="text-sm md:text-base font-light leading-[2] tracking-wide"
              style={{ color: "#555" }}
            >
              人生に完成はない。
              <br />
              迷いながら、
              <br className="md:hidden" />
              選び直しながら、
              <br />
              それでも進む。
            </p>
            <p
              className="text-sm md:text-base font-light leading-[2] tracking-wide"
              style={{ color: "#555" }}
            >
              becoming lab は、
              <br />
              「なりつづける人生」を生きる人のための場所です。
            </p>
          </div>

          {/* CTA — 2 buttons only */}
          <div className="mt-12 md:mt-14 flex flex-col sm:flex-row gap-4 justify-center animate-hero-cta">
            <Link
              href="/concept"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-wider transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: "#111",
                color: "#fff",
              }}
            >
              思想を知る
            </Link>
            <Link
              href="/jibun-de-eranda-michi"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-wider border transition-all duration-300 hover:bg-black/5"
              style={{
                borderColor: "#111",
                color: "#111",
              }}
            >
              物語を読む
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-indicator">
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-[9px] tracking-[0.25em] uppercase"
              style={{ color: "#999" }}
            >
              Scroll
            </span>
            <div
              className="w-px h-10"
              style={{
                background:
                  "linear-gradient(to bottom, #999, transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PHILOSOPHY — 思想
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-32 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-8"
            style={{ color: "#B8A88A" }}
          >
            Philosophy
          </p>
          <h2
            className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight mb-10"
            style={{ color: "#111" }}
          >
            人生に、完成はない
          </h2>
          <div
            className="space-y-5 text-sm md:text-base font-light leading-[2]"
            style={{ color: "#555" }}
          >
            <p>
              「Being」は「在る」こと。
              <br />
              「Becoming」は「なりつつある」こと。
            </p>
            <p>
              完成した状態を目指すのではなく、
              <br />
              常に「なりつつある」自分を肯定する。
            </p>
            <p>
              becoming lab は、その思想を共有し、
              <br />
              実践するための場所です。
            </p>
          </div>
          <Link
            href="/concept"
            className="inline-block mt-10 text-sm tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: "#1B6B7A" }}
          >
            思想を読む →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STORIES — 物語
          ═══════════════════════════════════════ */}
      <section
        className="px-6 py-28 md:py-32"
        style={{ backgroundColor: "#F7F6F3" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-8"
            style={{ color: "#B8A88A" }}
          >
            Stories
          </p>
          <h2
            className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight mb-6"
            style={{ color: "#111" }}
          >
            自分で選んだ道を歩く人たち
          </h2>
          <p
            className="text-sm md:text-base font-light leading-[2] mb-10"
            style={{ color: "#555" }}
          >
            完成された成功談ではなく、
            <br />
            迷いや葛藤も含めた
            <br className="md:hidden" />
            リアルな人生の物語。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jibun-de-eranda-michi"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-wider border transition-all duration-300 hover:bg-black/5"
              style={{
                borderColor: "#111",
                color: "#111",
              }}
            >
              物語を読む
            </Link>
            <Link
              href="/members"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide transition-opacity hover:opacity-70"
              style={{ color: "#1B6B7A" }}
            >
              メンバーを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COMMUNITY — コミュニティ
          ═══════════════════════════════════════ */}
      <section className="px-6 py-28 md:py-32 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-8"
            style={{ color: "#B8A88A" }}
          >
            Community
          </p>
          <h2
            className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight mb-6"
            style={{ color: "#111" }}
          >
            人生の途中を、一緒に歩む
          </h2>
          <p
            className="text-sm md:text-base font-light leading-[2] mb-10"
            style={{ color: "#555" }}
          >
            語り、聴き、一緒に過ごす場。
            <br />
            月1回のトークイベント「自分で選んだ道」を起点に、
            <br />
            食事会・ランニング・勉強会など、
            <br className="md:hidden" />
            さまざまな形でつながります。
          </p>
          <Link
            href="/community"
            className="inline-block text-sm tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: "#1B6B7A" }}
          >
            コミュニティについて →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SESSION — セッション
          ═══════════════════════════════════════ */}
      <section
        className="px-6 py-28 md:py-32"
        style={{ backgroundColor: "#F7F6F3" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-8"
            style={{ color: "#B8A88A" }}
          >
            Session
          </p>
          <h2
            className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight mb-6"
            style={{ color: "#111" }}
          >
            becoming session
          </h2>
          <p
            className="text-sm md:text-base font-light leading-[2] mb-10"
            style={{ color: "#555" }}
          >
            自分自身の人生を見つめ直し、
            <br />
            次の一歩を踏み出すためのセッション。
          </p>
          <Link
            href="/service"
            className="inline-block text-sm tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: "#1B6B7A" }}
          >
            セッションについて →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — 静かに閉じる
          ═══════════════════════════════════════ */}
      <section
        className="px-6 py-28 md:py-32"
        style={{ backgroundColor: "#1C2D3F" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-8"
            style={{ color: "#B8A88A" }}
          >
            Contact
          </p>
          <h2 className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight text-white mb-4">
            まず、話してみる
          </h2>
          <p className="text-sm font-light text-stone-400 mb-10">
            なりつづける人生に、興味があるあなたへ。
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-sm tracking-wider transition-all duration-300 hover:bg-stone-100"
            style={{ color: "#1C2D3F" }}
          >
            お問い合わせ
          </Link>
        </div>
      </section>
    </>
  );
}
