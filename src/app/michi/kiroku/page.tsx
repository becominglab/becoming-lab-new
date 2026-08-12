import Link from "next/link";
import { records, jpDate } from "@/content/michi";

export const metadata = {
  title: "あの日の記録",
  description: "会が終わった翌日、その日いた人たちの言葉が並びます。becoming lab「道」の記録。",
};

export default function KirokuPage() {
  const sorted = [...records].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">RECORD</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">あの日の記録</h1>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>会が終わった翌日、その日いた人たちの言葉が、ここに並びます。</p>
            <p className="text-gray-500">誰が何を持ち帰ったのか。名前を忘れても、言葉は残ります。</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          {sorted.length === 0 ? (
            <p className="text-gray-500">最初の記録は、次の会のあとに置かれます。</p>
          ) : (
            <div className="space-y-8">
              {sorted.map((r) => (
                <Link
                  key={r.date}
                  href={`/michi/kiroku/${r.date}`}
                  className="block border-l-2 border-stone-200 pl-6 hover:border-[#1B6B7A] transition-colors"
                >
                  <p className="text-sm text-gray-400 mb-1">{jpDate(r.date)}</p>
                  <h2 className="font-bold text-gray-900 mb-1">{r.label}</h2>
                  {r.question && <p className="text-sm text-gray-600">この日の問い：{r.question}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <Link href="/michi" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
            ▶ 道に戻る
          </Link>
        </div>
      </section>
    </>
  );
}
