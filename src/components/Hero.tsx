import Link from 'next/link';
import { formatDate, nextEvent } from '@/content/events';

const WEEK = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const weekday = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return WEEK[new Date(y, m - 1, d).getDay()];
};

const rings = Array.from({ length: 7 }, (_, i) => (
  <circle
    key={i}
    cx={600}
    cy={150}
    r={44 * (i + 1)}
    fill="none"
    stroke="var(--bc-mist)"
    strokeWidth="1"
    opacity={Math.max(0.1, 0.9 - i * 0.12)}
    style={{ animationDelay: `${i * 70}ms` }}
  />
));

export default function Hero() {
  const next = nextEvent();

  return (
    <section className="bc-hero-main">
      <svg
        className="bc-hero-rings"
        viewBox="0 0 680 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {rings}
      </svg>

      <div className="bc-wrap bc-hero-grid">
        <div className="bc-hero-copy">
          <h1>
            人は、いつからでも
            <br />
            選び直せる。
          </h1>
          <p className="bc-voice bc-hero-sub2">仲間がいれば、何度でも。</p>
          <div className="bc-triad-rule" aria-hidden="true" />
          <p className="bc-triad-line">会う、整う、更新する。</p>
        </div>

        {next && (
          <div className="bc-hero-card">
            <p className="bc-card-label">次に会えるのは</p>
            <p className="bc-card-date">
              {formatDate(next.date)}
              <span>{next.date ? weekday(next.date) : ''}</span>
            </p>
            <p className="bc-card-name">{next.guest}</p>
            <p className="bc-card-theme">{next.theme}</p>
            <dl className="bc-card-details">
              <dt>時間</dt>
              <dd>{next.time}</dd>
              <dt>会場</dt>
              <dd>{next.venue}</dd>
              <dt>参加費</dt>
              <dd>{next.fee}</dd>
            </dl>
            {next.applyUrl && (
              <a
                className="bc-btn bc-card-btn"
                href={next.applyUrl}
                target="_blank"
                rel="noreferrer"
              >
                申し込む
              </a>
            )}
            <p className="bc-card-note">
              初めての方も、お一人での参加も歓迎です。
            </p>
            {next.href && (
              <Link className="bc-card-more" href={next.href}>
                この回について詳しく →
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
