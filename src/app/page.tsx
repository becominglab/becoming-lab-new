import Link from 'next/link';
import RingMark from '@/components/RingMark';
import Timeline from '@/components/Timeline';
import Voices from '@/components/Voices';
import { formatDate, nextEvent } from '@/content/events';
import '@/styles/becoming.css';

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
      opacity={Math.max(0.1, 0.95 - i * 0.12)}
      style={{ animationDelay: `${i * 70}ms` }}
    />
  ));

const faqs = [
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
];

const pillars = [
  {
    ja: '会う',
    en: 'LIVE',
    body: '挑戦の途中にいる人の話を聞く。答えではなく、途中を聞く場です。',
    href: '/jibun-de-eranda-michi',
    icon: (
      <g stroke="var(--bc-teal)" fill="none" strokeWidth="1.2">
        <circle cx="22" cy="17" r="13" />
        <circle cx="38" cy="17" r="13" />
      </g>
    ),
  },
  {
    ja: '整う',
    en: 'DIALOGUE ＆ SESSION',
    body: '仲間の言葉をきっかけに、自分に還る。答えが出なくても構いません。',
    href: '/community',
    icon: (
      <g stroke="var(--bc-teal)" fill="none" strokeWidth="1.2">
        <circle cx="30" cy="17" r="5" />
        <circle cx="30" cy="17" r="11" />
        <circle cx="30" cy="17" r="16" />
      </g>
    ),
  },
  {
    ja: '更新する',
    en: 'STORIES',
    body: 'その後どうなったかを、半年後、一年後に聞きに行きます。',
    href: '/jibun-de-eranda-michi/archive',
    icon: (
      <g stroke="var(--bc-teal)" fill="none" strokeWidth="1.2">
        <path d="M8 26 q11 -16 22 0" />
        <path d="M8 19 q11 -16 22 0" />
        <path d="M8 12 q11 -16 22 0" />
        <path d="M30 26 q11 -16 22 0" />
        <path d="M30 19 q11 -16 22 0" />
      </g>
    ),
  },
];

export default function Home() {
  const next = nextEvent();

  return (
    <div className="bc">
      <section className="bc-hero">
        <svg
          className="bc-hero-rings"
          viewBox="0 0 680 320"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {rings(606, 160, 7, 44)}
        </svg>
        <div className="bc-wrap bc-hero-inner">
          <h1>
            人は、いつからでも
            <br />
            選び直せる。
          </h1>
          <p className="bc-voice">仲間がいれば、何度でも。</p>
        </div>
      </section>

      <section className="bc-wrap bc-triad">
        <div className="bc-triad-rule" aria-hidden="true" />
        <p>会う、整う、更新する。</p>
      </section>

      <Timeline />
      <Voices />

      <section className="bc-pillars" aria-label="becoming labの3つの柱">
        {pillars.map((p) => (
          <Link key={p.ja} className="bc-pillar" href={p.href}>
            <svg viewBox="0 0 60 34" width="56" height="32" aria-hidden="true">
              {p.icon}
            </svg>
            <h3>{p.ja}</h3>
            <p className="bc-pillar-en">{p.en}</p>
            <p>{p.body}</p>
          </Link>
        ))}
      </section>

      <section className="bc-letter">
        <svg
          className="bc-letter-rings"
          viewBox="0 0 680 260"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {rings(640, 130, 4, 48)}
        </svg>
        <div className="bc-wrap bc-letter-inner">
          <p className="bc-eyebrow">なぜ、二人ではじめたのか</p>
          <p className="bc-voice bc-letter-lead">
            自分で選んだ道を、誰かと更新していく。
            <br />
            その納得感のことを、私たちは幸せと呼ぶことにしました。
          </p>
          <p>
            私たちは夫婦です。片方は会社を経営し、片方は人の話を聴く仕事をしています。二人に共通していたのは、「自分で選んだはずの道が、いつのまにか選ばされた道になっている」人を、あまりにも多く見てきたことでした。
          </p>
          <p>
            人は環境で変われる、と私たちは信じています。だから、変わろうとしている人が集まる環境そのものを作ることにしました。
          </p>
          <div className="bc-signature">
            <span>大塚貴生　大塚昌代</span>
            <Link href="/concept">続きを読む</Link>
          </div>
        </div>
      </section>

      <section className="bc-faq">
        <div className="bc-wrap">
          <p className="bc-eyebrow">はじめての方から、よく聞かれること</p>
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {next && (
        <section className="bc-cta" id="join">
          <div className="bc-wrap">
            <p className="bc-cta-kicker">
              vol.{String(next.vol).padStart(2, '0')} ／ becoming lab「自分で選んだ道」
            </p>
            <h2>{next.theme}</h2>
            {next.subtitle && <p className="bc-cta-sub">{next.subtitle}</p>}
            <p className="bc-cta-guest">{next.guest}</p>

            <dl className="bc-details">
              <dt>日時</dt>
              <dd>
                {formatDate(next.date)}　{next.time}
                {next.doorsOpen && <span>（開場 {next.doorsOpen}）</span>}
              </dd>
              <dt>会場</dt>
              <dd>
                {next.venue}
                <br />
                <span>{next.address}</span>
              </dd>
              <dt>参加費</dt>
              <dd>{next.fee}</dd>
            </dl>

            <div className="bc-cta-actions">
              <a
                className="bc-btn bc-btn-invert"
                href={next.applyUrl}
                target="_blank"
                rel="noreferrer"
              >
                申し込む
              </a>
              <p className="bc-cta-note">申込ページへ移動します</p>

              <div className="bc-letter-signup">
                今回は都合が合わない方へ　
                <Link href="/contact">話してみる</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
