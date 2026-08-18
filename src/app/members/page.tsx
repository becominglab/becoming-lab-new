import Link from "next/link";
import Reveal from "@/components/Reveal";
import { events, formatDate } from "@/content/events";
import "@/styles/becoming.css";
import JsonLd from '@/components/JsonLd';
import { speakersJsonLd } from '@/content/event-schema';

export const metadata = {
  title: "語った人たち ｜ 「自分で選んだ道」スピーカー",
  description:
    "becoming lab のトークイベント「自分で選んだ道」で人生の途中を語った方々。猟師、プロトライアスリート、経営者、都市デザイナー。完成した人ではなく、途中のまま語る人たちの一覧です。",
  keywords: ["自分で選んだ道", "トークイベント 東京", "神田 イベント", "生き方 講演", "becoming lab"],
  alternates: { canonical: "https://becominglab.life/members" },
  openGraph: {
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
    title: "語った人たち ｜ becoming lab",
    description: "完成した人ではありません。途中のまま話してくれた人たちです。",
    url: "https://becominglab.life/members",
    type: "website",
  },
};

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

const gifts = [
  { title: "人生が整理される", body: "話すために振り返ると、点だった出来事が、線になって見えてきます。" },
  { title: "経験が意味に変わる", body: "自分では失敗だと思っていたことが、聴いた人の一歩になることがあります。" },
  { title: "自分の歩みが肯定される", body: "評価されず、比較されず、ただ聴かれる。それ自体が、深い経験になります。" },
];

export default function MembersPage() {
  const speakers = events.filter((e) => e.guest && e.date).slice().reverse();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bc">
      <JsonLd data={speakersJsonLd} />
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
          <p className="bc-eyebrow">SPEAKERS</p>
          <h1>語った人たち</h1>
          <p className="bc-voice">完成した人ではありません。途中のまま話してくれた人たちです。</p>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <div className="bc-speakers">
          {speakers.map((e, i) => {
            const upcoming = e.date! >= today;
            return (
              <Reveal key={e.vol} delay={i * 90}>
                <div className="bc-speaker">
                  <div className="bc-speaker-meta">
                    <span className="bc-speaker-vol">
                      vol.{String(e.vol).padStart(2, "0")}
                    </span>
                    <span>{formatDate(e.date)}</span>
                    {upcoming && <span className="bc-speaker-next">次回</span>}
                  </div>
                  <h2 className="bc-speaker-name">{e.guest}</h2>
                  <p className="bc-speaker-theme">{e.theme}</p>
                  <div className="bc-speaker-links">
                    {e.profile && <Link href={e.profile}>この人の物語を読む →</Link>}
                    {e.href && <Link href={e.href}>この回を見る →</Link>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bc-band">
        <div className="bc-wrap">
          <Reveal>
            <p className="bc-eyebrow">SPEAKING</p>
            <h2 className="bc-h2">スピーカーという在り方</h2>
            <div className="bc-prose">
              <p>スピーカーは、完成した人ではありません。途中のまま語る人です。</p>
              <p>語ることで輪郭が生まれ、聴くことで重なり、次の語りが生まれます。</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <Reveal>
          <h2 className="bc-h2">語る側に、起きること</h2>
          <p className="bc-lead">
            聴く人のためだけの時間ではありません。いちばん変わるのは、話した本人であることが多いです。
          </p>
        </Reveal>
        <div className="bc-stack">
          {gifts.map((g, i) => (
            <Reveal key={g.title} delay={i * 130}>
              <div className="bc-gift">
                <span className="bc-line-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="bc-gift-title">{g.title}</p>
                  <p className="bc-gift-body">{g.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bc-cta">
        <div className="bc-wrap">
          <p className="bc-cta-kicker">NEXT SPEAKER</p>
          <h2>次に語るのは、あなたかもしれません。</h2>
          <p className="bc-cta-sub">
            実績も、肩書きも要りません。まだ途中である、ということだけが条件です。
          </p>
          <div className="bc-cta-actions">
            <Link className="bc-btn bc-btn-invert" href="/contact">
              話してみる
            </Link>
            <p className="bc-cta-note">まずは一度、聴きに来ていただくのがおすすめです</p>
            <div className="bc-letter-signup">
              <Link href="/jibun-de-eranda-michi">▶ 「自分で選んだ道」について</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
