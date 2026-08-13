/* eslint-disable @typescript-eslint/no-explicit-any */

const USER = "becominglab";
const UA = "Mozilla/5.0 (compatible; becominglab-site/1.0)";
const REVALIDATE = 3600;

export type NoteArticle = {
  key: string;
  title: string;
  excerpt: string;
  eyecatch: string | null;
  publishedAt: string | null;
  noteUrl: string;
  bodyHtml: string;
};

export function noteUrlFor(key: string) {
  return `https://note.com/${USER}/n/${key}`;
}

export function formatArticleDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

/** note の本文HTMLから危険な要素と冗長な属性を落とす */
export function sanitizeNoteBody(html: string): string {
  return html
    .replace(/<\/?(script|style|iframe|object|embed|link|meta|form|input|button)\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\s(?:name|id)\s*=\s*"[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

/** 記事キーの一覧。ビルド時の静的生成に使う */
export async function fetchNoteKeys(limit = 24): Promise<string[]> {
  try {
    const res = await fetch(
      `https://note.com/api/v2/creators/${USER}/contents?kind=note&page=1`,
      { headers: { "User-Agent": UA }, next: { revalidate: REVALIDATE } }
    );
    if (!res.ok) return [];
    const json: any = await res.json();
    const contents: any[] = json?.data?.contents ?? [];
    return contents
      .filter((c) => c?.key && c?.status === "published")
      .map((c) => String(c.key))
      .slice(0, limit);
  } catch {
    return [];
  }
}

/** 単記事の全文 */
export async function fetchNoteArticle(key: string): Promise<NoteArticle | null> {
  if (!/^n[0-9a-z]+$/.test(key)) return null;
  try {
    const res = await fetch(`https://note.com/api/v3/notes/${key}`, {
      headers: { "User-Agent": UA },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json: any = await res.json();
    const d = json?.data;
    if (!d || !d.body || d.is_limited || (d.price ?? 0) > 0) return null;
    return {
      key: String(d.key ?? key),
      title: String(d.name ?? ""),
      excerpt: String(d.description ?? "").trim(),
      eyecatch: d.eyecatch ? String(d.eyecatch) : null,
      publishedAt: d.publish_at ?? d.created_at ?? null,
      noteUrl: String(d.note_url ?? noteUrlFor(key)),
      bodyHtml: sanitizeNoteBody(String(d.body)),
    };
  } catch {
    return null;
  }
}
