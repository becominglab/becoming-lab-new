import Link from "next/link";

export const metadata = {
  title: "becoming lab | æ´æ°ãéã­ãäººçã",
  description: "becoming labã¯ãæ´æ°ãç¶ããäººãéã¾ããèªåã§é¸ãã éãå°éããäºãã®ææ¦ã¨èªå·±å®ç¾ãå¿æ´ãåãã³ãã¥ããã£ã§ãã",
};

export default function HomePage() {
  return (
    <>
      {/* ãã¼ã­ã¼ã»ã¯ã·ã§ã³ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-8">becoming lab</p>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-12 tracking-tight text-gray-900">
            æ´æ°ãéã­ãã<br />äººçãã
          </h1>
          <div className="space-y-4 text-stone-600 leading-relaxed text-base md:text-lg max-w-xl mx-auto mb-12">
            <p>becoming labã¯ãæ´æ°ãç¶ããäººãéã¾ãã</p>
            <p>èªåã§é¸ãã éãå°éãã</p>
            <p>äºãã®ææ¦ã¨èªå·±å®ç¾ãå¿æ´ãåãã³ãã¥ããã£ã§ãã</p>
            <p className="pt-4 text-stone-500">becoming labã¯ããã®äººçã®ææ¦ãã¢ã·ã¹ããã¾ãã</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/concept" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-sm">
              <span>â¶</span> becoming labã¨ã¯
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B6B7A] text-white hover:bg-[#155a67] transition-colors duration-300 text-sm">
              <span>â¶</span> è©±ãã¦ã¿ã
            </Link>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* ã³ãã¥ããã£ç´¹ä» */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">COMMUNITY</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">äººçã®éä¸­ããä¸ç·ã«æ­©ã</h2>
          <div className="space-y-4 text-stone-600 leading-relaxed mb-8">
            <p>èªããè´ããä¸ç·ã«éããå ´ãæ1åã®ãã¼ã¯ã¤ãã³ããèªåã§é¸ãã éããèµ·ç¹ã«ãé£äºä¼ã»ã©ã³ãã³ã°ã»åå¼·ä¼ãªã©ããã¾ãã¾ãªå½¢ã§ã¤ãªããã¾ãã</p>
          </div>
          <Link href="/community" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
            â¶ ã³ãã¥ããã£ã«ã¤ãã¦
          </Link>
        </div>
      </section>

      {/* èªåã§é¸ãã é */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">EVENT</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">èªåã§é¸ãã é</h2>
          <p className="text-stone-600 leading-relaxed mb-8">èª°ãã®é¸æããããªãã®åãã«ãªããæ1åéå¬ã®ãã¼ã¯ã¤ãã³ãã·ãªã¼ãºã</p>
          <Link href="/jibun-de-eranda-michi" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
            â¶ ã¤ãã³ãä¸è¦§ãè¦ã
          </Link>
        </div>
      </section>

      {/* セッション */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">SESSION</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">becoming session</h2>
          <p className="text-stone-600 leading-relaxed mb-8">自分自身の人生を見つめ直し、次の一歩を踏み出すためのセッション。</p>
          <Link href="/session" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
            ▶ セッションについて
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-stone-500 mb-4">JOIN US</p>
          <h2 className="text-2xl font-light mb-8 tracking-tight">ã¾ããè©±ãã¦ã¿ã</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300">
            <span className="text-sm">â¶</span>
            <span>ãåãåãã</span>
          </Link>
        </div>
      </section>
    </>
  );
}
