import Link from "next/link";

export default function ArchivePage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">ARCHIVE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">これまでの語り部</h1>
        </div>
      </section>

      {/* 準備中 */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <p className="text-gray-500 mb-8">Coming Soon</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            語り部たちの物語を、順次公開していきます。
          </p>
        </div>
      </section>

      {/* 共通文言 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            この語りは、誰かの正解ではありません。<br />
            しかし、あなたの問いに重なる瞬間が、きっとあります。
          </p>
          <Link href="/kataribe" className="text-[#1B6B7A] hover:opacity-70 transition-opacity">
            ▶ 語り部の会について
          </Link>
        </div>
      </section>
    </>
  );
}
