import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Users, Target, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Becoming Labについて。「自分らしく、更新し続ける」をテーマに、人生・仕事・家庭・挑戦を統合的に扱う事業を運営しています。",
};

export default function AboutPage() {
  const milestones = [
    { year: "〜2020", event: "金融からキャリアをスタートし、複数の企業で経営に関与", desc: "キャリアビジョンの重要性に気づく" },
    { year: "2020", event: "夫婦関係の危機", desc: "「在り方」の重要性に気づく" },
    { year: "2020", event: "セッションを学び始める", desc: "対話の力を知る" },
    { year: "2022", event: "減量に取り組む", desc: "「身体を整える」重要性に気づく" },
    { year: "2022", event: "マラソンを始める", desc: "ひとり時間と内省の重要性に気づく" },
    { year: "2023", event: "トライアスロンを始める", desc: "挑戦と継続、バランスの原体験" },
    { year: "2024", event: "不動産賃貸事業を本格化する", desc: "入居者の幸せと家族の未来の幸せの両立に気づく原体験" },
    { year: "2025", event: "神夫養成講座を開始", desc: "夫婦関係の変革プログラム" },
    { year: "2026", event: "Becoming Lab設立", desc: "統合的な人生支援へ" },
];

  const beliefs = [
    {
      title: "完成より更新",
      desc: "人生に「完成」はない。だからこそ、更新し続けることに価値がある。",
    },
    {
      title: "分断より統合",
      desc: "仕事・家庭・挑戦を分けて考えない。すべてはつながっている。",
    },
    {
      title: "テクニックより在り方",
      desc: "何をするかより、どんな在り方で接するか。Being が Doing を決める。",
    },
    {
      title: "孤独より対話",
      desc: "一人で抱え込まない。対話の中で気づきが生まれ、変化が起きる。",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <p className="text-sm tracking-widest text-accent mb-4">ABOUT</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-primary leading-tight mb-8">
              自分らしく、
              <br />
              更新し続ける
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Becoming Lab は、「完成」を目指すのではなく、
              <br className="hidden md:block" />
              「更新を重ねる人生」という思想をテーマにした事業です。
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center">
              <img src="/founder.png" alt="Founder" className="w-full h-full object-cover rounded-3xl" />
            </div>
            <div>
              <p className="text-sm tracking-widest text-accent mb-4">FOUNDER</p>
              <h2 className="text-3xl font-display font-bold text-primary mb-6">
                
                <span className="text-lg font-normal text-gray-500 ml-4"></span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  会社役員として働きながら、経営者として事業を行いながら、トライアスロンに挑戦し、家庭を持ち、子育てをしてきました。
                </p>
                <p>
                  「仕事」「家庭」「挑戦」—この3つを両立させようとする中で、何度も壁にぶつかりました。特に夫婦関係では、どれだけ頑張っても空回りする時期がありました。
                </p>
                <p>
                  転機は、「やり方」ではなく「在り方」を変えることでした。自分の内側を整え、相手と向き合い、関係性をつむぎ直す。そのプロセスの中で、人生全体が変わっていきました。
                </p>
                <p>
                  Becoming Lab は、その経験と学びを体系化し、同じように悩む人の支援をするために立ち上げた事業です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">WHY BECOMING LAB</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              なぜ「Becoming」なのか
            </h2>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100">
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                「Being」は「在る」こと。
                <br />
                「Becoming」は「なりつつある」こと。
              </p>
              <p>
                完成した「Being」を目指すのではなく、常に「Becoming」—なりつつある状態を肯定する。
              </p>
              <p>
                人生に完成はありません。だからこそ、更新し続けることに価値がある。
              </p>
              <p>
                Becoming Lab は、そんな思想を共有し、実践するための「実験場（Lab）」です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">BELIEFS</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              大切にしている信念
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {beliefs.map((belief, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{belief.title}</h3>
                <p className="text-gray-600 leading-relaxed">{belief.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">JOURNEY</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              これまでの歩み
            </h2>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold text-primary mb-2">{milestone.event}</h3>
                  <p className="text-gray-600">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-white/60 mb-4">MISSION</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
            人生の「更新」を支援する
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-12">
            成長・貢献・継続が循環する人生へ。
            <br />
            一人ひとりが自分らしい選択を更新し続けられる社会をつくる。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/philosophy"
              className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all"
            >
              Philosophy を読む
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              対話を始める
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              提供しているサービス
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/kamiotto"
              className="group p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-4xl block mb-4"><Users className="w-12 h-12 text-primary" /></span>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                神夫養成講座
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                夫婦関係から人生全体を整え直すプログラム
              </p>
              <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                詳しく見る
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/session"
              className="group p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-4xl block mb-4"><Users className="w-12 h-12 text-primary" /></span>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                目標達成セッション
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                判断と選択を整えるための1on1対話
              </p>
              <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                詳しく見る
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/community"
              className="group p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-4xl block mb-4"><Handshake className="w-12 h-12 text-primary" /></span>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                コミュニティ
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                安心して立ち止まり、対話できる関係性
              </p>
              <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                詳しく見る
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
