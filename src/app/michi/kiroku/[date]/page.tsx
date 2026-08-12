import Link from "next/link";
import { notFound } from "next/navigation";
import { records, jpDate } from "@/content/michi";

export function generateStaticParams() {
  return records.map((r) => ({ date: r.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const record = records.find((r) => r.date === date);
  if (!record) return { title: "あの日の記録" };
  return {
    title: `${jpDate(record.date)}｜${record.label}`,
    description: `${record.label} の記録。becoming lab「道」。`,
  };
}

export default async function KirokuDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const record = records.find((r) => r.date === date);
  if (!record) notFound();

  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">RECORD</p>
          <p className="text-sm text-gray-500 mb-2">{jpDate(record.date)}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{record.label}</h1>
        </div>
      </section>

      {record.question && (
        <section className="pb-12">
          <div className="max-w-2xl mx-auto px-8">
            <p className="text-xs tracking-widest text-gray-400 mb-3">この日の問い</p>
            <p className="text-lg text-gray-900">{record.question}</p>
          </div>
        </section>
      )}

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-6">この日の言葉</p>
          {!record.voices || record.voices.length === 0 ? (
            <p className="text-gray-500">この日の言葉は、まだ届いていません。</p>
          ) : (
            <div className="space-y-8">
              {record.voices.map((v, i) => (
                <div key={i} className="border-l-2 border-stone-200 pl-6">
                  <p className="text-gray-800 leading-loose">{v.text}</p>
                  <p className="text-sm text-gray-400 mt-2">{v.name ?? "匿名"}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-10 text-sm text-gray-400 leading-relaxed">
            掲載しているのは、載せてよいとおっしゃっていただいた言葉だけです。
          </p>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8 space-y-4">
          <Link href="/michi/kiroku" className="block text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ ほかの記録を読む
          </Link>
          <Link href="/michi" className="block text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ 道に戻る
          </Link>
        </div>
      </section>
    </>
  );
}
