// 読みもの（note 記事）の構造化データ
import { canonicalUrlFor, type NoteArticle } from "@/lib/note-article";

const SITE_URL = "https://becominglab.life";

const PUBLISHER = {
  "@type": "Organization",
  name: "becoming lab",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.png`,
  },
};

/**
 * 記事本体の構造化データ。
 * 正規URL（サイトに全文があればサイト、無ければ note）に mainEntityOfPage を揃えます。
 */
export function articleJsonLd(a: NoteArticle) {
  const published = a.publishedAt ?? undefined;
  const url = canonicalUrlFor(a);
  const eyecatch = a.eyecatch
    ? a.eyecatch.startsWith("/")
      ? `${SITE_URL}${a.eyecatch}`
      : a.eyecatch
    : null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title.slice(0, 110),
    description: a.excerpt || undefined,
    image: eyecatch ? [eyecatch] : [`${SITE_URL}/images/og.png`],
    datePublished: published,
    dateModified: published,
    author: PUBLISHER,
    publisher: PUBLISHER,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "ja",
    isPartOf: {
      "@type": "Blog",
      name: "読みもの ｜ becoming lab",
      url: `${SITE_URL}/blog`,
    },
  };
}

/** 記事ページのパンくず */
export function articleBreadcrumbJsonLd(a: NoteArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "ホーム", url: SITE_URL },
      { name: "読みもの", url: `${SITE_URL}/blog` },
      { name: a.title, url: `${SITE_URL}/blog/${a.key}` },
    ].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
