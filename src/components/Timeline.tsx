'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import RingMark from '@/components/RingMark';
import {
  events,
  formatDate,
  nextEvent,
  timelineWindow,
  type BecomingEvent,
} from '@/content/events';

export default function Timeline() {
  const items = timelineWindow();
  const current = nextEvent();
  const [selected, setSelected] = useState<BecomingEvent | null>(current);
  const drawnRef = useRef<HTMLDivElement>(null);

  const currentIndex = items.findIndex((e) => e.vol === current?.vol);
  const ratio = currentIndex < 0 ? 1 : (currentIndex + 0.5) / items.length;
  const firstDate = events.find((e) => e.date)?.date ?? null;

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (drawnRef.current) drawnRef.current.style.width = `${ratio * 100}%`;
    }, 150);
    return () => window.clearTimeout(id);
  }, [ratio]);

  const shown = selected ?? current;

  return (
    <section className="bc-timeline" aria-label="これまでの開催">
      <div className="bc-wrap">
        <p className="bc-timeline-label">
          {formatDate(firstDate)} — 更新中
        </p>

        <div className="bc-track">
          <div className="bc-track-base" aria-hidden="true" />
          <div className="bc-track-drawn" ref={drawnRef} aria-hidden="true" />
          <div className="bc-nodes">
            {items.map((e) => {
              const isCurrent = e.vol === current?.vol;
              const isFuture = !e.date;
              return (
                <button
                  key={e.vol}
                  type="button"
                  className={[
                    'bc-node',
                    isCurrent ? 'bc-node-current' : '',
                    isFuture ? 'bc-node-future' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={shown?.vol === e.vol}
                  aria-label={`vol.${e.vol}${e.guest ? ` ${e.guest}` : '（これから）'}`}
                  disabled={isFuture}
                  onClick={() => setSelected(e)}
                >
                  <span className="bc-node-num">
                    {String(e.vol).padStart(2, '0')}
                  </span>
                  {isCurrent ? (
                    <RingMark size={15} />
                  ) : (
                    <span className="bc-node-dot" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {shown && (
          <div className="bc-track-detail">
            <p className="bc-track-meta">
              <span>vol.{String(shown.vol).padStart(2, '0')}</span>
              <span>{formatDate(shown.date)}</span>
            </p>
            <p className="bc-track-guest">{shown.guest ?? '（準備中）'}</p>
            <p className="bc-track-theme">{shown.theme ?? ''}</p>
            {shown.href && (
              <p className="bc-track-link">
                <Link href={shown.href}>この回を読む</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
