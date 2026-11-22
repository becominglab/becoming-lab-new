export type BecomingEvent = {
  vol: number;
  /** 開催日。未定の回は null */
  date: string | null;
  guest: string | null;
  theme: string | null;
  /** 各回の詳細ページ。あれば線の点がリンクになる */
  href?: string;
  /** スピーカーの紹介ページ。あれば members から個別ページへ繋がる */
  profile?: string;
  /** 一覧に出す短い一行。省略すると theme が使われます */
  short?: string;
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
 * トップの線・次回情報・申込ボタンが自動で追従します。
 * 未定の回は date/guest/theme を null のままにしておくと、
 * 線の右側に「これから」の枠として表示されます。
 */
export const events: BecomingEvent[] = [
  {
    vol: 1,
    date: '2026-03-12',
    guest: '立川雄介',
    theme: '圧倒的成果を手放し、山へ還った24歳',
    short: '圧倒的成果を手放し、山へ還った24歳',
    href: '/jibun-de-eranda-michi/vol1',
    profile: '/members/tachikawa',
  },
  {
    vol: 2,
    date: '2026-04-22',
    guest: '山岸穂高',
    theme: 'ロングディスタンス日本一。そしてプロアスリートへ。',
    short: 'ロングディスタンス日本一。そしてプロへ',
    href: '/jibun-de-eranda-michi/vol2',
    profile: '/members/yamashiro',
  },
  {
    vol: 3,
    date: '2026-05-19',
    guest: '山崎満広',
    theme: 'なぜ彼は、アメリカで道を切り拓けたのか',
    short: 'なぜ彼は、アメリカで道を切り拓けたのか',
    href: '/jibun-de-eranda-michi/vol3',
  },
  {
    vol: 4,
    date: '2026-06-24',
    guest: '佐藤加奈子',
    theme: '最前線で戦う女性は、何を見ているのか',
    short: '最前線で戦う女性は、何を見ているのか',
    href: '/jibun-de-eranda-michi/vol4',
  },
  {
    vol: 5,
    date: '2026-07-15',
    guest: '鬼木陽一',
    theme: '100億円の事業をつくった人が、それでも「何でもない自分」を、生きている',
    short: '100億円をつくった人が、何でもない自分を生きている',
    href: '/jibun-de-eranda-michi/vol5',
  },
  {
    vol: 6,
    date: '2026-08-05',
    guest: '亀田憲',
    theme: '人生カスタマイズ時代を、どう生きるのか',
    short: '人生カスタマイズ時代を、どう生きるのか',
    href: '/jibun-de-eranda-michi/vol6',
  },
  {
    vol: 7,
    date: '2026-09-17',
    guest: '村松健一',
    theme: '誰のために、今を歩く。',
    subtitle: '目標を失って見つけた、「人のために」という生き方',
    href: '/jibun-de-eranda-michi/vol7',
    time: '19:30 – 21:30',
    doorsOpen: '19:15',
    venue: '神田SDGsコネクション 3階',
    address: '東京都千代田区神田錦町2-9-15',
    fee: '3,000円（税込・懇親会費を含みます）',
    applyUrl: 'https://forms.gle/bDM2tyMbvBvSuWPf9',
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

/** 開催済みの回を、新しい順に */
export const pastEvents = () => {
  const next = nextEvent();
  return events
    .filter((e) => e.guest && e.date && e.vol !== next?.vol)
    .slice()
    .reverse();
};

/** 線に表示する範囲。直近8回＋これから3枠に収める */
export const timelineWindow = () => {
  const next = nextEvent();
  const idx = next ? events.findIndex((e) => e.vol === next.vol) : events.length - 1;
  const start = Math.max(0, idx - 6);
  return events.slice(start, start + 10);
};
