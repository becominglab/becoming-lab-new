import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "第六回 自分で選んだ道 vol.6 | becoming lab",
  description:
    "産業能率大学教授・亀田憲さんが語る、自分を何度もupdateしつづけるキャリアの選び方。2026年8月5日、神田錦町にて開催。",
};

/* ── ここに申込フォームURLを入れてください ─────────────────── */
const APPLY_URL = "";

/* ── 小パーツ ──────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#c9a227]">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 font-serif text-2xl font-bold tracking-wide text-[#0f1e3a] md:text-3xl">
      {children}
    </h2>
  );
}

function Section({
  label,
  title,
  children,
  tone = "light",
}: {
  label?: string;
  title: string;
  children: React.ReactNode;
  tone?: "light" | "tint";
}) {
  return (
    <section
      className={
        tone === "tint"
          ? "border-y border-[#e7e3d8] bg-[#faf8f3] px-6 py-16 md:py-20"
          : "px-6 py-16 md:py-20"
      }
    >
      <div className="mx-auto max-w-3xl">
        {label && <SectionLabel>{label}</SectionLabel>}
        <SectionTitle>{title}</SectionTitle>
        {children}
      </div>
    </section>
  );
}

function DetailRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#e7e3d8] py-5 md:flex-row md:gap-8">
      <dt className="w-28 shrink-0 text-sm font-medium tracking-wider text-[#6b7280]">
        {term}
      </dt>
      <dd className="text-[15px] leading-relaxed text-[#0f1e3a]">{children}</dd>
    </div>
  );
}

const QUESTIONS = [
  {
    no: "Q1",
    title: "自分の「強み」は、どう掛け算するか",
    body: "マーケティング × 診断士 × MBA。複数の武器を重ねて、自分だけの価値をつくる。",
  },
  {
    no: "Q2",
    title: "迷ったとき、何を基準に選ぶか",
    body: "転職も挑戦も、軸ではなく戦略で。キャリアの分岐点での意思決定を考える。",
  },
  {
    no: "Q3",
    title: "「updateしつづける」ために必要なもの",
    body: "学び直し、資格、出版。自分をアップデートしつづける習慣とは。",
  },
];

const CAREER = [
  "東急エージェンシー",
  "ディズニー",
  "アディダス",
  "チチカカ",
  "ブランドコンサル",
  "ビデオリサーチ",
];

/* ── ページ本体 ────────────────────────────────────────── */
export default function Vol6Page() {
  return (
    <main className="bg-white text-[#0f1e3a]">
      {/* HERO */}
      <header className="bg-[#0f1e3a] px-6 py-20 text-white md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-[11px] tracking-[0.28em] text-[#c9a227]">
            「自分で選んだ道」 VOL.06
          </p>
          <p className="mb-6 inline-block border border-[#c9a227]/60 px-4 py-1.5 text-xs tracking-[0.2em] text-[#c9a227]">
            戦略的キャリア
          </p>
          <h1 className="font-serif text-3xl leading-[1.5] font-bold md:text-[2.75rem] md:leading-[1.45]">
            人生<span className="text-[#c9a227]">カスタマイズ</span>時代を、
            <br />
            どう生きるのか？
          </h1>
          <div className="mt-10 h-px w-16 bg-[#c9a227]" />
          <p className="mt-8 text-[15px] leading-loose text-white/80">
            会社が敷いたレールも、「正解」とされる生き方も、もうどこにもない時代。
            <br />
            自分の価値観を軸に、自由に、しなやかに生きるヒントを一緒に探しましょう。
          </p>
        </div>
      </header>

      {/* SPEAKER */}
      <Section label="SPEAKER" title="スピーカーについて">
        <div className="mb-8">
          <p className="font-serif text-xl font-bold md:text-2xl">
            亀田 憲（かめだ けん）
            <span className="ml-3 font-serif text-base font-normal italic text-[#6b7280]">
              KAMEDA Ken
            </span>
          </p>
          <p className="mt-2 text-sm leading-relaxed tracking-wide text-[#6b7280]">
            産業能率大学 経営学部 教授｜中小企業診断士｜MBA（グロービス経営大学院）
          </p>
        </div>

        <div className="space-y-6 text-[15px] leading-loose text-[#374151]">
          <p>
            専門は、マーケティング戦略・ブランド戦略・商品開発・消費者行動。実務と理論を行き来する。
          </p>
          <p>
            東急エージェンシーからはじまり、ディズニー、アディダス、チチカカ、ブランドコンサル、ビデオリサーチ。広告代理店の営業からブランディング、コンサルティング、そしてシンクタンクの所長まで。「マーケティング戦略」と徹底的に、真正面から向き合い続けてきた。
          </p>
          <p>その間に、MBAを取り、中小企業診断士になり、4冊の本を出している。</p>
          <p className="border-l-2 border-[#c9a227] pl-5 text-[#0f1e3a]">
            いつも何かにチャレンジして、自分自身を何度もupdateし続けてきた人。
          </p>
        </div>

        {/* 軌跡 */}
        <div className="mt-12">
          <p className="mb-5 text-[11px] tracking-[0.22em] text-[#c9a227]">
            A JOURNEY OF BECOMING ── updateしつづけた軌跡
          </p>
          <ul className="flex flex-wrap gap-x-3 gap-y-3">
            {CAREER.map((c) => (
              <li
                key={c}
                className="rounded-full border border-[#e7e3d8] px-4 py-1.5 text-[13px] tracking-wide text-[#374151]"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* 哲学 */}
        <figure className="mt-12 bg-[#0f1e3a] px-8 py-10 text-white">
          <figcaption className="mb-4 text-[11px] tracking-[0.2em] text-[#c9a227]">
            MESSAGE FROM THE GUEST ── 亀田さんの哲学
          </figcaption>
          <blockquote className="font-serif text-xl leading-relaxed font-bold md:text-2xl">
            “知恵”と“経験”という武器を手に、仲間と冒険をしよう。
          </blockquote>
          <p className="mt-6 text-sm leading-loose text-white/75">
            人生という冒険は、一人で挑むものではありません。失敗なんて怖くない。仲間とともに学び、挑戦し、成長していく。そんな冒険の旅を楽しみましょう。
          </p>
        </figure>

        <p className="mt-10 text-[15px] leading-loose text-[#0f1e3a]">
          完成された答えではなく、途中のまま語る、その一夜。
        </p>
      </Section>

      {/* 3つの問い */}
      <Section
        label="QUESTIONS"
        title="この夜、いっしょに考えたい3つの問い"
        tone="tint"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {QUESTIONS.map((q) => (
            <div key={q.no} className="border-t-2 border-[#c9a227] bg-white p-6">
              <p className="font-serif text-lg font-bold text-[#c9a227]">{q.no}</p>
              <p className="mt-3 font-serif text-base leading-relaxed font-bold text-[#0f1e3a]">
                {q.title}
              </p>
              <p className="mt-4 text-[13px] leading-loose text-[#6b7280]">{q.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* EVENT DETAILS */}
      <Section label="EVENT DETAILS" title="開催概要">
        <dl>
          <DetailRow term="日時">
            2026年8月5日（水）
            <br />
            開場 19:15 / トーク 19:30〜20:30
            <br />
            懇親会 20:30〜21:30
          </DetailRow>
          <DetailRow term="場所">
            神田SDGsコネクションビル 3階
            <br />
            <span className="text-[#6b7280]">
              〒101-0054 東京都千代田区神田錦町2-9-15
            </span>
          </DetailRow>
          <DetailRow term="参加費">
            3,000円（税込）
            <br />
            <span className="text-[#6b7280]">※懇親会費を含みます</span>
          </DetailRow>
        </dl>
      </Section>

      {/* FOR YOU */}
      <Section label="FOR YOU" title="こんな方へ" tone="tint">
        <ul className="space-y-4">
          {[
            "キャリアの分岐点に立っている",
            "複数の強みを、どう掛け算するか悩んでいる",
            "学び直しや資格取得を考えている",
            "「正解のない時代」の選び方を知りたい",
          ].map((t) => (
            <li key={t} className="flex gap-4 text-[15px] leading-relaxed text-[#374151]">
              <span className="mt-[0.6em] h-px w-4 shrink-0 bg-[#c9a227]" />
              {t}
            </li>
          ))}
        </ul>
      </Section>

      {/* FROM HOST */}
      <Section label="FROM HOST" title="この会について">
        <div className="space-y-6 text-[15px] leading-loose text-[#374151]">
          <p>亀田さんとは、以前の職場で同じチームにいました。</p>
          <p>
            それから何年も経ちますが、会うたびに肩書きが増えています。ディズニー、アディダス、ブランドコンサル、ビデオリサーチ、そして大学教授。その間にMBAを取り、中小企業診断士になり、本を4冊出している。
          </p>
          <p className="font-serif text-lg font-bold text-[#0f1e3a]">
            なぜ、そんなに動き続けられるのか。
          </p>
          <p>実は私も、ちゃんと聞いたことがありません。今回、それを聞きます。</p>
          <p>
            会社が敷いたレールも、正解とされる生き方も、もうどこにもない時代です。そのなかで、自分を何度もupdateしてきた人が、何を基準に選んできたのか。
          </p>
          <p>その話を、途中のまま聞かせてもらいます。</p>
          <p>皆さまとお会いできることを楽しみにしています。</p>
          <p className="pt-2 text-sm tracking-wider text-[#6b7280]">becoming lab 主宰</p>
        </div>
      </Section>

      {/* JOIN US */}
      <Section label="JOIN US" title="参加申し込み" tone="tint">
        <div className="space-y-4">
          {APPLY_URL ? (
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#0f1e3a] px-10 py-4 text-[15px] tracking-wider text-white transition hover:bg-[#1a3057]"
            >
              ▶ 参加を申し込む
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-block bg-[#0f1e3a] px-10 py-4 text-[15px] tracking-wider text-white transition hover:bg-[#1a3057]"
            >
              ▶ 参加を申し込む
            </Link>
          )}
          <p className="text-xs text-[#6b7280]">
            ※ 定員に達し次第、締め切らせていただきます
          </p>
        </div>
      </Section>

      {/* 一覧へ戻る */}
      <div className="border-t border-[#e7e3d8] px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/jibun-de-eranda-michi"
            className="text-sm tracking-wider text-[#6b7280] transition hover:text-[#0f1e3a]"
          >
            ← 「自分で選んだ道」一覧へ
          </Link>
        </div>
      </div>
    </main>
  );
}
