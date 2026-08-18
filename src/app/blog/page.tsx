import Link from "next/link";
import Reveal from "@/components/Reveal";
import { fetchNotePosts } from "@/lib/note";
import "@/styles/becoming.css";

export const revalidate = 3600;

export const metadata = {
  title: "読みもの ｜ note",
  description:
    "becoming lab の note。人生の途中で考えていること、月に一つの問い、会のあとに残った言葉を書いています。東京・神田のコミュニティ becoming lab。",
  alternates: { canonical: "https://becominglab.life/blog" },
  openGraph: {
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
    title: "読みもの ｜ becoming lab",
    description: "人生の途中で考えていることを、note に書いています。",
    url: "https://becominglab.life/blog",
    type: "website",
  },
};

const NOTE_URL = "https://note.com/becominglab";

const rings = (cx: number, cy: number, count: number, step: number) =>
  Array.from({ length: count }, (_, i) => (
    <circle
      key={i}
      cx={cx}
      cy={cy}
      r={step * (i + 1)}
      fill="none"
      stroke="var(--bc-mist)"
      strokeWidth="1"
      opacity={Math.max(0.1, 0.9 - i * 0.13)}
      style={{ animationDelay: `${i * 70}ms` }}
    />
  ));

const noteKeyOf = (link: string) =>
  (link.match(/\/n\/(n[0-9a-z]+)/) || [])[1] ?? null;

export default async function BlogPage() {
  const posts = await fetchNotePosts();

  return (
    <div className="bc">
      <section className="bc-hero bc-hero-sub">
        <svg
          className="bc-hero-rings"
          viewBox="0 0 680 300"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {rings(600, 150, 6, 46)}
        </svg>
        <div className="bc-wrap bc-hero-inner">
          <p className="bc-eyebrow">NOTE</p>
          <h1>読みもの</h1>
          <p className="bc-voice">考えている途中のことを、そのまま置いています。</p>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <Reveal>
          <div className="bc-prose">
            <p>
              会のできごとは<Link href="/michi">道</Link>に、
              考えていることは note に書いています。
            </p>
          </div>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={120}>
            <p className="bc-note">
              最初の一本は、まだ書かれていません。
              <br />
              書き上がると、ここに並びます。
            </p>
            <p className="bc-more">
              <a href={NOTE_URL} target="_blank" rel="noreferrer">
                note を見る →
              </a>
            </p>
          </Reveal>
        ) : (
          <>
            <div className="bc-posts">
              {posts.map((p, i) => {
                const k = noteKeyOf(p.link);
                const inner = (
                  <>
                    <p className="bc-post-date">{p.date}</p>
                    <h2 className="bc-post-title">{p.title}</h2>
                    {p.excerpt && <p className="bc-post-excerpt">{p.excerpt}</p>}
                  </>
                );
                return (
                  <Reveal key={p.link} delay={i * 80}>
                    {k ? (
                      <Link className="bc-post" href={`/blog/${k}`}>
                        {inner}
                      </Link>
                    ) : (
                      <a className="bc-post" href={p.link} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    )}
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={300}>
              <p className="bc-more">
                <a href={NOTE_URL} target="_blank" rel="noreferrer">
                  note ですべて読む →
                </a>
              </p>
            </Reveal>
          </>
        )}
      </section>

      <section className="bc-cta">
        <div className="bc-wrap">
          <p className="bc-cta-kicker">JOIN</p>
          <h2>読むより、来てしまう方が早いこともあります。</h2>
          <p className="bc-cta-sub">
            月に一度、東京・神田で人生の途中を語り合っています。
          </p>
          <div className="bc-cta-actions">
            <Link className="bc-btn bc-btn-invert" href="/michi">
              道を見る
            </Link>
            <p className="bc-cta-note">日程と参加のしかたは、こちらにまとめています</p>
          </div>
        </div>
      </section>
    </div>
  );
}
