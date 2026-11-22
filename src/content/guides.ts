// サイト原本の記事（手引き）。本文は content/guides/*.json に1記事1ファイルで置く。
// 記事を足すときは、JSON を1つ追加して下の ALL に並べるだけ。
import erabinaosu from "./guides/erabinaosu.json";
import hitoriSanka from "./guides/hitori-sanka-community.json";
import triathlon from "./guides/triathlon-hajimekata.json";
import kyuju from "./guides/90kg-kara-hashiru.json";
import tanaoroshi from "./guides/hansei-tanaoroshi.json";
import kataru from "./guides/jinsei-wo-kataru.json";

const SITE_URL = "https://becominglab.life";

export type GuideBlock =
  | { t: "p"; v: string }
  | { t: "h3"; v: string }
  | { t: "ul"; v: string[] }
  | { t: "ol"; v: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  author: string;
  /** 冒頭の結論。ここだけ読んでも答えが分かるように書く */
  lead: string[];
  /** この記事の要点（3つ前後） */
  points: string[];
  sections: { h: string; blocks: GuideBlock[] }[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
};

const ALL = [erabinaosu, hitoriSanka, triathlon, kyuju, tanaoroshi, kataru] as unknown as Guide[];

/** 新しい順 */
export const guides: Guide[] = [...ALL].sort((a, b) => (a.published < b.published ? 1 : -1));

export const findGuide = (slug: string) => guides.find((g) => g.slug === slug) ?? null;

export const guideDate = (iso: string) => iso.replace(/-/g, ".");

/** 本文中の [文字](URL) を落として、素の文章にする（構造化データ用） */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

const AUTHOR = (name: string) => ({
  "@type": "Person",
  name,
  jobTitle: "becoming lab 主宰",
  url: `${SITE_URL}/concept`,
  worksFor: { "@type": "Organization", name: "becoming lab", url: SITE_URL },
});

const PUBLISHER = {
  "@type": "Organization",
  name: "becoming lab",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
};

export function guideJsonLd(g: Guide) {
  const url = `${SITE_URL}/guide/${g.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    image: [`${SITE_URL}/images/og.png`],
    datePublished: `${g.published}T09:00:00+09:00`,
    dateModified: `${g.updated}T09:00:00+09:00`,
    author: AUTHOR(g.author),
    publisher: PUBLISHER,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "ja",
  };
}

export function guideFaqJsonLd(g: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
}

export function guideBreadcrumbJsonLd(g: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "ホーム", url: SITE_URL },
      { name: "手引き", url: `${SITE_URL}/guide` },
      { name: g.title, url: `${SITE_URL}/guide/${g.slug}` },
    ].map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export const guideListJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "becoming lab の手引き",
  itemListElement: guides.map((g, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: g.title,
    url: `${SITE_URL}/guide/${g.slug}`,
  })),
});
