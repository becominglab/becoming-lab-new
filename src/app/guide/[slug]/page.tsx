import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import {
  guides,
  findGuide,
  guideDate,
  guideJsonLd,
  guideFaqJsonLd,
  guideBreadcrumbJsonLd,
  type GuideBlock,
} from "@/content/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return { title: "手引き" };
  const url = `https://becominglab.life/guide/${g.slug}`;
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: url },
    authors: [{ name: g.author }],
    openGraph: {
      type: "article",
      title: g.title,
      description: g.description,
      url,
      publishedTime: g.published,
      modifiedTime: g.updated,
      images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
    },
  };
}

const linkClass = "text-[#1B6B7A] underline underline-offset-4";

/** 本文中の [文字](URL) をリンクにする */
function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const [, label, href] = m;
    out.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function Block({ b }: { b: GuideBlock }) {
  switch (b.t) {
    case "p":
      return <p className="mb-6">{inline(b.v)}</p>;
    case "h3":
      return <h3 className="mt-10 mb-3 text-lg font-bold text-gray-900">{b.v}</h3>;
    case "ul":
      return (
        <ul className="mb-6 list-disc pl-6">
          {b.v.map((x, i) => (
            <li key={i} className="mb-2">
              {inline(x)}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mb-6 list-decimal pl-6">
          {b.v.map((x, i) => (
            <li key={i} className="mb-2">
              {inline(x)}
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse text-[14px] leading-relaxed">
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} className="border-b border-gray-300 py-3 pr-4 text-left font-bold text-gray-900">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className="border-b border-gray-200 py-3 pr-4 align-top">
                      {inline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  return (
    <article className="mx-auto max-w-[42rem] px-6 pt-32 pb-28">
      <JsonLd data={guideJsonLd(g)} />
      <JsonLd data={guideFaqJsonLd(g)} />
      <JsonLd data={guideBreadcrumbJsonLd(g)} />

      <Link href="/guide" className="text-sm text-gray-400 hover:text-[#1B6B7A] transition-colors">
        ← 手引き
      </Link>

      <header className="mt-10">
        <p className="text-xs tracking-widest text-gray-400">
          <time dateTime={g.published}>{guideDate(g.published)}</time>
          {g.updated !== g.published && (
            <>
              　更新 <time dateTime={g.updated}>{guideDate(g.updated)}</time>
            </>
          )}
        </p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold leading-relaxed text-gray-900">{g.title}</h1>
        <p className="mt-4 text-sm text-gray-500">
          書いた人　<Link href="/concept" className={linkClass}>{g.author}</Link>（becoming lab 主宰）
        </p>
      </header>

      <div className="mt-12 text-[15px] leading-[2.1] text-gray-700">
        {g.lead.map((p, i) => (
          <p key={i} className="mb-6">
            {inline(p)}
          </p>
        ))}

        <div className="my-10 rounded-2xl border border-[#1B6B7A]/20 p-6 md:p-8" style={{ backgroundColor: "rgba(27,107,122,0.03)" }}>
          <p className="text-[10px] tracking-[0.25em] mb-4" style={{ color: "#1B6B7A" }}>
            この記事の要点
          </p>
          <ul className="list-disc pl-5">
            {g.points.map((x, i) => (
              <li key={i} className="mb-1">
                {inline(x)}
              </li>
            ))}
          </ul>
        </div>

        {g.sections.map((s) => (
          <section key={s.h}>
            <h2 className="mt-14 mb-4 text-xl font-bold text-gray-900">{s.h}</h2>
            {s.blocks.map((b, i) => (
              <Block key={i} b={b} />
            ))}
          </section>
        ))}

        <section>
          <h2 className="mt-14 mb-6 text-xl font-bold text-gray-900">よくある質問</h2>
          <dl>
            {g.faqs.map((f) => (
              <div key={f.q} className="mb-8">
                <dt className="mb-2 font-bold text-gray-900">{f.q}</dt>
                <dd>{inline(f.a)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <footer className="mt-20 border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-500 mb-4">あわせて読む</p>
        <ul className="space-y-2 text-sm">
          {g.related.map((r) => (
            <li key={r.href}>{inline(`[${r.label}](${r.href})`)}</li>
          ))}
        </ul>
        <p className="mt-10 text-sm leading-relaxed text-gray-500">
          becoming lab は、東京・神田錦町を拠点に、月に一度のトークイベント「自分で選んだ道」をひらいているコミュニティです。
        </p>
        <Link href="/jibun-de-eranda-michi" className={`mt-3 inline-block text-sm ${linkClass}`}>
          「自分で選んだ道」について →
        </Link>
      </footer>
    </article>
  );
}
