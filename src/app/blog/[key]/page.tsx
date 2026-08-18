/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchNoteArticle,
  fetchNoteKeys,
  formatArticleDate,
} from "@/lib/note-article";
import JsonLd from "@/components/JsonLd";
import { articleJsonLd, articleBreadcrumbJsonLd } from "@/content/article-schema";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const keys = await fetchNoteKeys(24);
  return keys.map((key) => ({ key }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { key } = await params;
  const a = await fetchNoteArticle(key);
  if (!a) return { title: "読みもの" };
  return {
    title: a.title,
    description: a.excerpt || undefined,
    alternates: { canonical: a.noteUrl },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt || undefined,
      url: a.noteUrl,
      images: a.eyecatch ? [a.eyecatch] : undefined,
      publishedTime: a.publishedAt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.excerpt || undefined,
      images: a.eyecatch ? [a.eyecatch] : undefined,
    },
  };
}

export default async function NoteArticlePage({ params }: any) {
  const { key } = await params;
  const a = await fetchNoteArticle(key);
  if (!a) notFound();

  return (
    <article className="mx-auto max-w-[42rem] px-6 pt-32 pb-28">
      <JsonLd data={articleJsonLd(a)} />
      <JsonLd data={articleBreadcrumbJsonLd(a)} />
      <Link
        href="/blog"
        className="text-sm text-gray-400 hover:text-[#1B6B7A] transition-colors"
      >
        ← 読みもの
      </Link>

      <header className="mt-10">
        {a.publishedAt && (
          <p className="text-xs tracking-widest text-gray-400">
            {formatArticleDate(a.publishedAt)}
          </p>
        )}
        <h1 className="mt-4 text-2xl md:text-3xl font-bold leading-relaxed text-gray-900">
          {a.title}
        </h1>
      </header>

      {a.eyecatch && (
        <img src={a.eyecatch} alt="" className="mt-10 w-full" loading="lazy" />
      )}

      <div
        className="mt-12 text-[15px] leading-[2.1] text-gray-700
          [&_p]:mb-6
          [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900
          [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900
          [&_strong]:font-bold [&_strong]:text-gray-900
          [&_hr]:my-14 [&_hr]:border-gray-200
          [&_a]:text-[#1B6B7A] [&_a]:underline [&_a]:underline-offset-4
          [&_img]:my-10 [&_img]:w-full
          [&_figure]:my-10
          [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-200 [&_blockquote]:pl-6 [&_blockquote]:text-gray-500
          [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6
          [&_li]:mb-2"
        dangerouslySetInnerHTML={{ __html: a.bodyHtml }}
      />

      <footer className="mt-20 border-t border-gray-200 pt-8">
        <p className="text-sm leading-relaxed text-gray-500">
          この記事は note に書いたものです。
          <br />
          スキやコメントは note からどうぞ。
        </p>
        <a
          href={a.noteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-[#1B6B7A] underline underline-offset-4"
        >
          note で読む →
        </a>
      </footer>
    </article>
  );
}
