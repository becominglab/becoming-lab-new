import Link from "next/link";
import Reveal from "@/components/Reveal";
import Cycle from "@/components/Cycle";
import "@/styles/becoming.css";

export const metadata = {
  title: "コミュニティ",
  description: "語り、聴き、一緒に過ごす場。becoming labのコミュニティで、日常が少しずつ更新されていく。",
};

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
      opacity={Math.max(0.1, 0.9 - i * 0.13)}
      style={{ animationDelay: `${i * 70}ms` }}
    />
  ));

const attitudes = [
  "自分の人生を自分で選ぼうとする人",
  "人生の途中を正直に語れる人",
  "誰かの挑戦を応援できる人",
];

const airs = [
  "無理に話さなくていい",
  "立派なことを言わなくていい",
  "未完成のままでいていい",
];

const distances = [
  "参加は自由",
  "継続は義務ではありません",
  "参加と距離の取り方は、自分で決められます",
];

export default function CommunityPage() {
  return (
    <div className="bc">
      <section className="bc-hero bc-hero-sub">
        <svg
          className="bc-hero-rings"
          viewBox="0 0 680 300"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {rings(600, 150, 6, 46)}
        </svg>
        <div className="bc-wrap bc-hero-inner">
          <p className="bc-eyebrow">COMMUNITY</p>
          <h1>
            語りが、
            <br />
            日常へと続いていく。
          </h1>
          <p className="bc-voice">一人で始めたことが、いつのまにか続いている。</p>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <Reveal>
          <div className="bc-prose">
            <p>
              becoming lab のコミュニティは、「自分で選んだ道」で生まれた言葉や気づきが、日常の時間へゆっくり溶け込んでいく場です。
            </p>
            <p>
              語る、聴く、で終わらせない。一緒に過ごし、動き、話しているうちに、人生が少しずつ更新されていきます。
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bc-band">
        <div className="bc-wrap">
          <Reveal>
            <p className="bc-eyebrow">MEMBER</p>
            <h2 className="bc-h2">メンバーとは</h2>
            <p className="bc-lead">
              人生を更新し続けようとする人です。年齢も職業も立場も問いません。共通しているのは、この三つだけです。
            </p>
          </Reveal>
          <div className="bc-stack">
            {attitudes.map((a, i) => (
              <Reveal key={a} delay={i * 120}>
                <div className="bc-line-item">
                  <span className="bc-line-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{a}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={400}>
            <p className="bc-note">
              完成された人が集まる場所ではありません。迷いながら、考えながら、自分の人生を歩こうとする人たちの集まりです。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <Reveal>
          <p className="bc-eyebrow">CYCLE</p>
          <h2 className="bc-h2">一度きりでは、終わりません</h2>
          <p className="bc-lead">
            更新した自分で、また新しい人に会う。また整う。また一歩進む。ここで起きているのは、その繰り返しです。
          </p>
        </Reveal>
        <Reveal delay={150}>
          <Cycle />
        </Reveal>
        <Reveal delay={300}>
          <p className="bc-note">
            どこから入っても構いません。何周しても構いません。急ぐ必要もありません。
          </p>
        </Reveal>
      </section>

      <section className="bc-band">
        <div className="bc-wrap">
          <Reveal>
            <h2 className="bc-h2">大切にしている空気感</h2>
          </Reveal>
          <div className="bc-airs">
            {airs.map((a, i) => (
              <Reveal key={a} delay={i * 140}>
                <p className="bc-air">{a}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={480}>
            <p className="bc-note">ここは、自分を整えながら、他者と重なっていく場です。</p>
          </Reveal>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <Reveal>
          <p className="bc-eyebrow">ACTIVITIES</p>
          <h2 className="bc-h2">主な活動</h2>
          <div className="bc-prose">
            <p>
              月に一度のトークイベント「自分で選んだ道」を起点に、走る会、食事会、勉強会や対話会、合宿など、いくつかの集まりが続いています。
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="bc-ways-list bc-ways-list-sub">
            <Link href="/jibun-de-eranda-michi" className="bc-way">
              <span className="bc-way-verb">聴く。</span>
              <span className="bc-way-note">月に一度、人生の途中を聴く</span>
            </Link>
            <Link href="/michi/au" className="bc-way">
              <span className="bc-way-verb">会う。</span>
              <span className="bc-way-note">毎月一度、皇居に集まる</span>
            </Link>
            <Link href="/michi/kakomu" className="bc-way">
              <span className="bc-way-verb">囲む。</span>
              <span className="bc-way-note">8名で、テーブルを囲む</span>
            </Link>
          </div>
          <p className="bc-more">
            <Link href="/michi">それぞれの日程と参加のしかたを見る →</Link>
          </p>
        </Reveal>
      </section>

      <section className="bc-band">
        <div className="bc-wrap">
          <Reveal>
            <h2 className="bc-h2">距離の取り方</h2>
          </Reveal>
          <div className="bc-stack">
            {distances.map((d, i) => (
              <Reveal key={d} delay={i * 120}>
                <div className="bc-line-item">
                  <span className="bc-line-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{d}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={400}>
            <p className="bc-note">必要なタイミングで、必要な関わり方を。</p>
          </Reveal>
        </div>
      </section>

      <section className="bc-wrap bc-block">
        <Reveal>
          <p className="bc-eyebrow">MEMBERS</p>
          <h2 className="bc-h2">ここにいる人たち</h2>
          <div className="bc-prose">
            <p>
              それぞれの人生を自分で選び、更新し続けようとしている人たちが集まっています。
            </p>
          </div>
          <p className="bc-more">
            <Link href="/members">メンバーを見る →</Link>
          </p>
        </Reveal>
      </section>

      <section className="bc-cta">
        <div className="bc-wrap">
          <p className="bc-cta-kicker">JOIN</p>
          <h2>まず、一度来てみてください。</h2>
          <p className="bc-cta-sub">
            入会の手続きも、会費もありません。来た人が、メンバーです。
          </p>
          <div className="bc-cta-actions">
            <Link className="bc-btn bc-btn-invert" href="/michi">
              道を見る
            </Link>
            <p className="bc-cta-note">日程と参加のしかたは、こちらにまとめています</p>
            <div className="bc-letter-signup">
              <Link href="/contact">▶ まず話してみる</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
