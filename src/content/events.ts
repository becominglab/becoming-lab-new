export type BecomingEvent = {
  vol: number;
  /** 開催日。未定の回は null */
  date: string | null;
  guest: string | null;
  theme: string | null;
  subtitle?: string;
  time?: string;
  doorsOpen?: string;
  venue?: string;
  address?: string;
  fee?: string;
  applyUrl?: string;
};

/**
 * 回を追加するときは、この配列に1件足すだけ。
 * トップの線・次回情報・各回ページが自動で追従します。
 * 未定の回は date/guest/theme を null のままにしておくと、
 * 線の右側に「これから」の枠として表示されます。
 */
export const events: BecomingEvent[] = [
  { vol: 1, date: '2025-10-01', guest: null, theme: null },
  { vol: 2, date: '2025-12-01', guest: null, theme: null },
  { vol: 3, date: '2026-02-01', guest: null, theme: null },
  { vol: 4, date: '2026-04-01', guest: null, theme: null },
  { vol: 5, date: '2026-06-01', guest: '鬼木洋一', theme: null },
  { vol: 6, date: '2026-08-05', guest: '亀田健', theme: null },
  {
    vol: 7,
    date: '2026-09-17',
    guest: '村松健一',
    theme: '誰のために、今を歩く。',
    subtitle: '目標を失って見つけた、「人のために」という生き方',
    time: '19:30 – 21:30',
    doorsOpen: '19:15',
    venue: '神田SDGSコネクション 3F',
    address: '東京都千代田区神田錦町2-9-15',
    fee: '3,000円（懇親会費を含みます）',
    applyUrl: 'https://peatix.com/', // ← 実際の申込URLに差し替え
  },
  { vol: 8, date: null, guest: null, theme: null },
  { vol: 9, date: null, guest: null, theme: null },
  { vol: 10, date: null, guest: null, theme: null },
];

export const formatDate = (iso: string | null) =>
  iso ? iso.replace(/-/g, '.') : '';

/** 開催予定日が今日以降で、いちばん近い回 */
export const nextEvent = () => {
  const today = new Date().toISOString().slice(0, 10);
  return (
    events.find((e) => e.date && e.date >= today && e.guest) ??
    [...events].reverse().find((e) => e.guest) ??
    null
  );
};

/** 線に表示する範囲。直近8回＋これから3枠に収める */
export const timelineWindow = () => {
  const next = nextEvent();
  const idx = next ? events.findIndex((e) => e.vol === next.vol) : events.length - 1;
  const start = Math.max(0, idx - 6);
  return events.slice(start, start + 10);
};
