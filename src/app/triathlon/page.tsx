import Link from "next/link";
import { Target, Users, TrendingUp, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "トライアスロン×ビジネス",
  description: "挑戦したいビジネスパーソンと、トライアスロンコーチをマッチング。両方に価値を生むプログラム。",
};

export default function TriathlonPage() {
  const benefits = [
    {
      icon: Target,
      title: "明確な目標設定",
      desc: "レース完走という具体的な目標が、日々の行動を変える。",
    },
    {
      icon: TrendingUp,
      title: "継続力の向上",
      desc: "3種目のトレーニングを続けることで、継続する力が身につく。",
    },
    {
      icon: Users,
      title: "仲間との出会い",
      desc: "同じ目標を持つビジネスパーソンとの出会いが、新しい可能性を開く。",
    },
    {
      icon: Award,
      title: "達成感と自信",
      desc: "完走という成功体験が、仕事や人生にも好影響を与える。",
    },
  ];

  const programs = [
    {
      name: "初心者向け",
      target: "スプリント完走",
      period: "6ヶ月",
      desc: "泳げない、自転車もない、でも大丈夫。ゼロから始めて、スプリント距離（S750m/B20km/R5km）の完走を目指します。",
    },
    {
      name: "経験者向け",
      target: "オリンピックディスタンス",
      period: "6ヶ月",
      desc: "スプリント経験者が、オリンピックディスタンス（S1.5km/B40km/R10km）にチャレンジ。",
    },
    {
      name: "アドバンス",
      target: "ロングディスタンス",
      period: "12ヶ月",
      desc: "アイアンマン70.3やフルアイアンマンを目指す方向け。長期的な計画で挑戦。",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-white/60 mb-4">TRIATHLON × BUSINESS</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-8">
            挑戦が、
            <br />
            人生を変える
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12">
            トライアスロンは、単なるスポーツではありません。
            <br />
            目標設定、継続、限界突破—ビジネスに直結する学びの宝庫です。
          </p>
          <Link
            href="/contact?type=other"
            className="inline-block bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-accent/90 transition-all"
          >
            プログラムについて問い合わせる
          </Link>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm tracking-widest text-accent mb-4">CONCEPT</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              なぜトライアスロン×ビジネスなのか
            </h2>
          </div>
          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl">
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                多くのビジネスパーソンが、「挑戦したい」と思いながらも、きっかけがなく、一歩を踏み出せずにいます。
              </p>
              <p>
                トライアスロンは、その一歩を踏み出すのに最適な挑戦です。
              </p>
              <p>
                明確なゴール（レース完走）があり、進捗が可視化でき、達成感を味わえる。
                そして何より、その過程で身につく「継続力」「目標設定力」「自己管理力」は、そのままビジネスに活きます。
              </p>
              <p className="text-primary font-bold">
                Becoming Lab は、挑戦したいビジネスパーソンと、経験豊富なトライアスロンコーチをマッチングし、両方に価値を生むプログラムを提供します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">BENEFITS</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              トライアスロンで得られるもの
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PROGRAMS</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              プログラム一覧
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all"
              >
                <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                  {program.period}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{program.name}</h3>
                <p className="text-accent font-medium mb-4">目標: {program.target}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Coaches Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm tracking-widest text-accent mb-4">FOR COACHES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              コーチとして参加しませんか？
            </h2>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                トライアスロン経験を活かして、挑戦するビジネスパーソンをサポートしませんか？
              </p>
              <p>
                Becoming Lab では、経験豊富なトライアスリートをコーチとして募集しています。
              </p>
              <ul className="space-y-3 my-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  トライアスロン完走経験（距離問わず）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  初心者に教えることが好きな方
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  ビジネスパーソンとの対話に興味がある方
                </li>
              </ul>
              <p>
                コーチ報酬あり。詳細はお問い合わせください。
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/contact?type=other"
                className="inline-block bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all"
              >
                コーチとして参加する
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            新しい挑戦を始めませんか？
          </h2>
          <p className="text-white/80 text-lg mb-12">
            泳げなくても、自転車を持っていなくても大丈夫。
            <br />
            ゼロから一緒に始めましょう。
          </p>
          <Link
            href="/contact?type=other"
            className="inline-block bg-accent text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-accent/90 transition-all"
          >
            プログラムについて問い合わせる
          </Link>
        </div>
      </section>
    </>
  );
}
