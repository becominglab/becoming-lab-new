import Link from 'next/link';
import { pastEvents } from '@/content/events';

export default function PastSpeakers() {
  const past = pastEvents();

  return (
    <section className="bc-next">
      <div className="bc-wrap">
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
