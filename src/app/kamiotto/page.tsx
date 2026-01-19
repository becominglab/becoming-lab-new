import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "神夫養成講座",
  description: "夫婦関係から人生全体を整え直すプログラム。相手を変えるのではなく、自分の在り方を更新する。",
};

export default function KamiottoPage() {
  const problems = [
    { emoji: "😔", text: "何をしても妻に怒られる、正解がわからない" },
    { emoji: "😞", text: "家事育児を頑張っているのに認めてもらえない" },
    { emoji: "😣", text: "話すと雰囲気が悪くなるので、黙ってしまう" },
    { emoji: "😰", text: "仕事も家庭も頑張っているのに報われない" },
    { emoji: "😢", text: "子どもに尊敬される父親になりたいのに…" },
    { emoji: "😥", text: "家庭での居場所がない気がする" },
  ];

  const principles = [
    {
      num: "01",
      title: "意識が変われば行動が変わる",
      desc: "Being → Doing → Having。「何をするか」より「どんな在り方で接するか」で夫婦関係は決まる。",
    },
    {
      num: "02",
      title: "すべての問題はコミュニケーションで起き、解決する",
      desc: "言葉だけでなく、感情の扱い、質問、観察など「非言語含む全体」が鍵。",
    },
    {
      num: "03",
      title: "家庭はチーム、夫婦は共同経営者である",
      desc: "役割分担ではなく「共創」。協力ではなく「共同責任」。All Winの関係性。",
    },
    {
      num: "04",
      title: "愛は「習慣」でつくられる",
      desc: "日常の小さな行動、声かけ、態度が愛着を作り続ける。",
    },
    {
      num: "05",
      title: "家庭の幸福度 = 人生の幸福度",
      desc: "仕事・子育て・健康すべてが家庭の安心から生まれる。",
    },
  ];

  const curriculum = [
    {
      quarter: "Q1",
      title: "Being（在り方）",
      subtitle: "意識の土台づくり",
      items: ["自己理解・感情の取り扱い", "他者理解（妻・子ども）", "関係性の原則"],
    },
    {
      quarter: "Q2",
      title: "Doing（行動）",
      subtitle: "家庭の仕組みづくり",
      items: ["家事育児の分担システム", "夫婦コミュニケーション", "自発性の仕組み"],
    },
    {
      quarter: "Q3",
      title: "Having（成果）",
      subtitle: "夫婦の未来設計",
      items: ["夫婦ビジョン作成", "経済・役割の再定義", "つながりの再強化"],
    },
    {
      quarter: "Q4",
      title: "応用編",
      subtitle: "人生の幸福を育てる",
      items: ["子育ての共同戦略", "危機対応", "総まとめ・認定"],
    },
  ];

  const faqs = [
    {
      q: "妻に内緒で参加しても大丈夫ですか？",
      a: "はい、もちろん大丈夫です。多くの方が最初は一人で参加されます。ただ、講座の中で「伝える」タイミングについてもお話しします。",
    },
    {
      q: "夫婦で参加することはできますか？",
      a: "はい、夫婦での参加も歓迎です。ただ、まずはお一人で参加されて、その後パートナーを誘う方が多いです。",
    },
    {
      q: "オンラインでも効果はありますか？",
      a: "はい、十分に効果があります。オンラインだからこそ、自宅からリラックスして参加でき、学んだことをすぐに実践できます。",
    },
    {
      q: "体験セミナー後の勧誘はありますか？",
      a: "無理な勧誘は一切ありません。年間講座のご案内はしますが、決めるのはあなたです。体験だけで十分な学びを持ち帰っていただけます。",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <p className="text-sm tracking-widest text-white/60 mb-4">
                RELATIONSHIP DESIGN PROGRAM
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-6">
                神夫養成講座
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                夫婦関係から、
                <br />
                人生全体を整え直す
              </p>
              <p className="text-white/70 mb-8 leading-relaxed">
                「良い夫になる方法」を教える講座ではありません。
                <br />
                家庭という最も影響力の大きい関係性から、
                <br />
                人生全体を整え直すプログラムです。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#seminar"
                  className="bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-accent/90 transition-all text-center"
                >
                  体験セミナーに申し込む
                </Link>
                <Link
                  href="#program"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all text-center"
                >
                  プログラム詳細
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center text-white">
                  <p className="text-6xl mb-4">👨‍👩‍👧‍👦</p>
                  <p className="text-lg font-medium mb-2">家庭の幸福度 = 人生の幸福度</p>
                  <p className="text-sm text-white/60">
                    仕事・子育て・健康すべてが家庭の安心から生まれる
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PROBLEMS</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              こんな悩みはありませんか？
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4"
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">
              これらの悩みは、
              <span className="font-bold text-primary">「やり方」ではなく「在り方」</span>
              を変えることで解決します。
            </p>
          </div>
        </div>
      </section>

      {/* Principle Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PRINCIPLES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              神夫養成講座の5つの原則
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              結果は原則が支配している。テクニックではなく、原則から変える。
            </p>
          </div>
          <div className="space-y-6">
            {principles.map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-primary/5 to-transparent p-8 rounded-2xl border-l-4 border-primary"
              >
                <div className="flex items-start gap-6">
                  <span className="text-4xl font-display font-black text-primary/20">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PROGRAM</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              年間カリキュラム
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              1年間で「神夫の在り方・習慣・コミュニケーション」を完成させる
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculum.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  {item.quarter}
                </div>
                <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.subtitle}</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  {item.items.map((text, j) => (
                    <li key={j}>• {text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seminar CTA Section */}
      <section id="seminar" className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-white/60 mb-4">TRIAL SEMINAR</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            まずは体験セミナーから
          </h2>
          <p className="text-white/80 text-lg mb-8">
            たった3時間で「家庭の空気が変わるきっかけ」を体験しませんか？
            <br />
            無理な勧誘は一切ありません。
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/20 max-w-md mx-auto">
            <p className="text-3xl font-bold mb-2">体験セミナー</p>
            <p className="text-5xl font-black mb-2">
              ¥5,000<span className="text-lg font-normal">（税込）</span>
            </p>
            <p className="text-white/60 text-sm">オンライン / 3時間</p>
          </div>
          <Link
            href="/contact?type=seminar"
            className="inline-block bg-accent text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-accent/90 transition-all hover:scale-105"
          >
            体験セミナーに申し込む
          </Link>
          <p className="text-white/50 text-sm mt-6">※ 日程は申込後に調整いたします</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              よくある質問
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((item, i) => (
              <details key={i} className="group bg-gray-50 rounded-2xl">
                <summary className="p-6 cursor-pointer flex items-center justify-between font-medium text-primary">
                  {item.q}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            相手を変えるのではなく、
            <br />
            自分の在り方を更新する
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            それが、家庭を変え、人生を変える唯一の方法です。
          </p>
          <Link
            href="/contact?type=seminar"
            className="inline-block bg-primary text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-secondary transition-all hover:scale-105"
          >
            体験セミナーに申し込む
          </Link>
        </div>
      </section>
    </>
  );
}
