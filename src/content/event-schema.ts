// 構造化データの定義。イベントの中身は content/events.ts を参照します。
import { events } from '@/content/events';

export const SITE_URL = 'https://becominglab.life';

const VENUE = {
  '@type': 'Place',
  name: '神田SDGsコネクション 3階',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '神田錦町2-9-15',
    addressLocality: '千代田区',
    addressRegion: '東京都',
    postalCode: '101-0054',
    addressCountry: 'JP',
  },
};

const ORGANIZER = {
  '@type': 'Organization',
  name: 'becoming lab',
  url: SITE_URL,
};

const APPLY_URL = 'https://forms.gle/bDM2tyMbvBvSuWPf9';

/** vol.1 のみ 2,000円、以降は 3,000円 */
const priceOf = (vol: number) => (vol === 1 ? '2000' : '3000');

/** 「自分で選んだ道」各回の Event 構造化データ */
export function eventJsonLd(vol: number): Record<string, unknown> {
  const e = events.find((x) => x.vol === vol);
  if (!e || !e.date) {
    return { '@context': 'https://schema.org', '@type': 'Event', name: `自分で選んだ道 vol.${vol}` };
  }
  const past = new Date(`${e.date}T21:30:00+09:00`) < new Date();
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `自分で選んだ道 vol.${e.vol}｜${e.theme ?? ''}`,
    description: e.subtitle ?? e.theme ?? '',
    startDate: `${e.date}T19:30:00+09:00`,
    endDate: `${e.date}T21:30:00+09:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: VENUE,
    organizer: ORGANIZER,
    performer: e.guest ? { '@type': 'Person', name: e.guest } : undefined,
    image: [`${SITE_URL}/images/og.png`],
    url: `${SITE_URL}${e.href ?? ''}`,
    isAccessibleForFree: false,
    offers: {
      '@type': 'Offer',
      price: priceOf(e.vol),
      priceCurrency: 'JPY',
      availability: past ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: e.applyUrl ?? APPLY_URL,
      validFrom: `${e.date}T00:00:00+09:00`,
    },
    inLanguage: 'ja',
  };
}

/** トップページの FAQ */
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      q: '一人で行っても、浮きませんか。',
      a: 'ほとんどの方が一人で来ます。開始前に運営が必ず声をかけ、席も組みます。知り合い同士で固まる場にならないよう、意図的に設計しています。',
    },
    {
      q: '何か話さないといけませんか。',
      a: '聞いているだけで構いません。対話の時間はありますが、パスできます。何も持ち帰らなかった日があっても、それでいいと思っています。',
    },
    {
      q: '意識が高い人ばかりですか。',
      a: '迷っている方、決めきれない方が大半です。何かを決めて帰る場ではありません。',
    },
    {
      q: '経営者や起業家ばかりですか。',
      a: '会社員の方が最も多く、次に自営業、主婦、学生と続きます。肩書きを名乗る時間はありません。名刺交換も、こちらからはお願いしていません。',
    },
  ].map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** パンくず */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'ホーム', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === '/' ? '' : it.path}`,
    })),
  };
}

/** 語った人たち（/members） */
export const speakersJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '「自分で選んだ道」に登壇した人たち',
  itemListElement: events
    .filter((e) => e.guest && e.href)
    .map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: e.guest,
        description: e.theme ?? '',
        url: `${SITE_URL}${e.href}`,
      },
    })),
};
