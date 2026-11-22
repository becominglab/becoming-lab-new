import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { guides, guideDate, guideListJsonLd } from "@/content/guides";
import { breadcrumbJsonLd } from "@/content/event-schema";

export const metadata = {
  title: "手引き ｜ 人生を選び直すための実践記事",
  description:
    "becoming lab の手引き。40代・50代で人生を選び直す手順、一人で参加できるコミュニティの選び方、トライアスロンの始め方、半生の棚卸しのやり方を、主宰者の実体験から書いています。",
  alternates: { canonical: "https://becominglab.life/guide" },
};

export default function GuideIndexPage() {
  return (
    <>
      <JsonLd data={guideListJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "手引き", path: "/guide" }])} />
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">GUIDE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">手引き</h1>
          <div className="mt-8 space-y-4 text-gray-600 leading-relaxed">
            <p>
              手引きは、becoming lab の主宰者が、自分で試してきたことを手順としてまとめた記事です。
            </p>
            <p>考えている途中のことは<Link href="/blog" className="text-[#1B6B7A] underline underline-offset-4">読みもの</Link>に、やり方はここに置いています。</p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-2xl mx-auto px-8 space-y-10">
          {guides.map((g) => (
            <Link key={g.slug} href={`/guide/${g.slug}`} className="block group">
              <p className="text-xs tracking-widest text-gray-400 mb-2">{guideDate(g.published)}</p>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1B6B7A] transition-colors">
                {g.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
