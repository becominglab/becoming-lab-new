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

/** シリーズ全体（/jibun-de-eranda-michi）。各回を subEvent として束ねる */
export const seriesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventSeries',
  name: '自分で選んだ道',
  description:
    'becoming lab が月に一度ひらくトークイベント。一人のスピーカーが人生の途中を語ります。成功談ではなく、未完成のままの物語です。',
  url: `${SITE_URL}/jibun-de-eranda-michi`,
  location: VENUE,
  organizer: ORGANIZER,
  inLanguage: 'ja',
  subEvent: events
    .filter((e) => e.date && e.guest && e.href)
    .map((e) => ({
      '@type': 'Event',
      name: `自分で選んだ道 vol.${e.vol}｜${e.theme ?? ''}`,
      startDate: `${e.date}T19:30:00+09:00`,
      url: `${SITE_URL}${e.href}`,
      performer: { '@type': 'Person', name: e.guest },
      location: VENUE,
    })),
};

/** 思想ページ（/concept）。運営者と団体の関係を明示する */
export const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'becoming lab の思想',
  url: `${SITE_URL}/concept`,
  inLanguage: 'ja',
  mainEntity: {
    '@type': 'Organization',
    name: 'becoming lab',
    alternateName: 'ビカミングラボ',
    url: SITE_URL,
    description:
      'becoming lab は、更新し続ける人が集まり、自分で選んだ道を尊重し、互いの挑戦と自己実現を応援し合うコミュニティです。',
    founder: [
      { '@type': 'Person', name: '大塚貴生' },
      { '@type': 'Person', name: '大塚昌代' },
    ],
    sameAs: ['https://note.com/becominglab'],
  },
};

/** be / com / ing の定義。/concept の本文と同じ文言にそろえる */
export const becomingTerms = [
  {
    term: 'be',
    label: 'どうありたいか',
    text: '自分が向かいたい在り方を、自分の言葉で決めること。何を成し遂げるかの前に、どうありたいかを置きます。',
  },
  {
    term: 'com',
    label: '仲間',
    text: '自分ひとりでは見えないものを、仲間が映してくれること。becoming lab の中心にあるのは、この仲間（コミュニティ）そのものです。',
  },
  {
    term: 'ing',
    label: '更新し続ける',
    text: '一度決めて終わりにしないこと。仲間と会いながら、何度でも選び直し、更新を重ねます。',
  },
];

export const becomingTermsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'be / com / ing',
  description:
    'be / com / ing（ビー・カム・イング）は、becoming lab の考え方を三つに分けた言葉です。becoming という一語を、be・com・ing に区切っています。',
  url: `${SITE_URL}/concept#be-com-ing`,
  inLanguage: 'ja',
  hasDefinedTerm: becomingTerms.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.term,
    alternateName: t.label,
    description: t.text,
  })),
};
