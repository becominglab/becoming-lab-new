import Link from 'next/link';
import { formatDate, nextEvent, pastEvents } from '@/content/events';

const WEEK = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const weekday = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return WEEK[new Date(y, m - 1, d).getDay()];
};

export default function NextAndPast() {
  const next = nextEvent();
  const past = pastEvents();

  return (
    <section className="bc-next">
      <div className="bc-wrap">
        {next && (
          <div className="bc-next-main">
            <p className="bc-eyebrow">次に会えるのは</p>
            <p className="bc-next-date">
              {formatDate(next.date)}
              <span>{next.date ? weekday(next.date) : ''}</span>
            </p>
            <h2 className="bc-next-name">{next.guest}</h2>
            <p className="bc-next-theme">{next.theme}</p>
            {next.subtitle && <p className="bc-next-sub">{next.subtitle}</p>}
            <div className="bc-next-actions">
              {next.applyUrl && (
                <a
                  className="bc-btn"
                  href={next.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  申し込む
                </a>
              )}
              {next.href && (
                <Link className="bc-next-more" href={next.href}>
                  この回を見る →
                </Link>
              )}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className="bc-past">
            <p className="bc-past-label">
              これまで、{past.length}人が語りました
            </p>
            <ul className="bc-past-list">
              {past.map((e) => (
                <li key={e.vol}>
                  <Link href={e.href ?? '/members'} className="bc-past-item">
                    <span className="bc-past-name">{e.guest}</span>
                    <span className="bc-past-theme">{e.short ?? e.theme}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="bc-more">
              <Link href="/members">語った人たちを見る →</Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
