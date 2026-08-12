import Link from "next/link";
import { events, formatDate } from "@/content/events";

export const metadata = {
  title: "これまでのスピーカー",
  description: "becoming lab「自分で選んだ道」に登壇した方々の物語。月に一度、一人のスピーカーが人生の途中を語ります。",
};

export default function ArchivePage() {
  const past = events.filter((e) => e.guest).slice().reverse();

  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">ARCHIVE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">これまでのスピーカー</h1>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>この語りは、誰かの正解ではありません。</p>
            <p className="text-gray-500">しかし、あなたの問いに重なる瞬間が、きっとあります。</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-8">
            {past.map((e) => (
              <Link
                key={e.vol}
                href={e.href ?? "/jibun-de-eranda-michi"}
                className="block border-l-2 border-stone-200 pl-6 hover:border-[#1B6B7A] transition-colors"
              >
                <p className="text-xs text-gray-400 mb-1">
                  vol.{String(e.vol).padStart(2, "0")}　{formatDate(e.date)}
                </p>
                <h2 className="font-bold text-gray-900 mb-1">{e.guest}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{e.theme}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8 space-y-4">
          <Link href="/jibun-de-eranda-michi" className="block text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ 自分で選んだ道について
          </Link>
          <Link href="/michi" className="block text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ ほかの道を見る
          </Link>
        </div>
      </section>
    </>
  );
}
