/**
 * note の記事一覧を RSS から取得する。
 * note に書けば、サイトの /blog も自動で更新されます。
 * 取得に失敗しても落ちないよう、必ず配列を返します。
 */
export type NotePost = {
  title: string;
  link: string;
  date: string;
  excerpt: string;
};

const FEED = "https://note.com/becominglab/rss";

const pick = (block: string, tag: string) => {
  const m = block.match(
    new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`)
  );
  return m ? m[1].trim() : "";
};

const stripTags = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/続きをみる/g, "")
    .replace(/続きを読む/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const jpDate = (raw: string) => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export async function fetchNotePosts(limit = 9): Promise<NotePost[]> {
  try {
    const res = await fetch(FEED, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "becominglab.life" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.slice(0, limit).map((block) => {
      const body = pick(block, "description") || pick(block, "content:encoded");
      const text = stripTags(body);
      return {
        title: stripTags(pick(block, "title")),
        link: pick(block, "link"),
        date: jpDate(pick(block, "pubDate")),
        excerpt: text.length > 90 ? `${text.slice(0, 90)}…` : text,
      };
    });
  } catch {
    return [];
  }
}
