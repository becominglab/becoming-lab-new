export type MichiEvent = {
  slug: 'au' | 'kakomu';
  title: string;
  date: string | null;
  summary: string;
};

/** 次に会える日。開催が決まったらここを更新する */
export const upcoming: MichiEvent[] = [
  {
    slug: 'au',
    title: 'その道で、会う ─ 錦町ランニングクラブ',
    date: '2026-10-28',
    summary: '17:00 勉強会／18:30 走る・歩く／20:00 懇親会',
  },
];

export const formatDate = (iso: string) => iso.replace(/-/g, '.');

export const jpDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const w = '日月火水木金土'[new Date(y, m - 1, d).getDay()];
  return `${y}年${m}月${d}日（${w}）`;
};
