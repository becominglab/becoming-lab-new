import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <p className="text-sm tracking-widest text-gray-500 mb-6">BECOMING LAB</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-primary leading-tight mb-8">
            自分らしく、
            <br />
            <span className="text-accent">更新し続ける</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            完成を目指すのではなく、整え、向き合い、つむぎながら、
            <br className="hidden md:block" />
            人生に「厚み」をつくる実験場
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all hover:scale-105"
            >
              Becoming Lab とは
            </Link>
            <Link
              href="/kamiotto"
              className="border-2 border-primary text-primary px-8 py-4 rounded-full font-medium hover:bg-primary hover:text-white transition-all"
            >
              神夫養成講座
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">VALUES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              3つの価値観
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🧭",
                title: "整える（Align）",
                desc: "自分の軸を見つけ、ブレない土台をつくる。外側ではなく内側から始まる変化。",
              },
              {
                emoji: "🪞",
                title: "向き合う（Face）",
                desc: "現実と感情に正直に、逃げずに対話する。そこから本当の成長が始まる。",
              },
              {
                emoji: "🧵",
                title: "つむぐ（Weave）",
                desc: "人生の経験を意味ある物語として編み上げる。点を線に、線を面に。",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              提供するサービス
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 神夫養成講座 */}
            <Link
              href="/kamiotto"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <p className="text-sm tracking-widest text-white/60 mb-4">
                  RELATIONSHIP DESIGN
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">神夫養成講座</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  夫婦関係から人生全体を整え直すプログラム。相手を変えるのではなく、自分の在り方を更新する。
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  詳しく見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* 目標達成コーチング */}
            <Link
              href="/coaching"
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 md:p-12 hover:shadow-xl hover:border-accent/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <p className="text-sm tracking-widest text-accent mb-4">COACHING</p>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  目標達成コーチング
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  頑張らせるコーチングではなく、判断と選択を整えるための1on1対話。
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  詳しく見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* コミュニティ */}
            <Link
              href="/community"
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 md:p-12 hover:shadow-xl hover:border-accent/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <p className="text-sm tracking-widest text-accent mb-4">COMMUNITY</p>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  コミュニティ
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  食事会・勉強会・Circleを通じて、安心して立ち止まり、対話できる関係性。
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  詳しく見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* トライアスロン×ビジネス */}
            <Link
              href="/triathlon"
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 md:p-12 hover:shadow-xl hover:border-accent/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <p className="text-sm tracking-widest text-accent mb-4">
                  TRIATHLON × BUSINESS
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  トライアスロン×ビジネス
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  挑戦したいビジネスパーソンと、コーチをマッチングし、両方に価値を生む。
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  詳しく見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-accent mb-4">PHILOSOPHY</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8">
            完成ではなく、更新を重ねる
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Becoming Lab は、「完成」を目指すのではなく、「更新を重ねる人生」という思想をテーマにした事業です。
            人生・仕事・家庭・挑戦を切り分けずに扱い、自分らしい選択を更新し続けていく。
            学びの場やコミュニティでもありますが、本質的には「人生の扱い方を取り戻すための実験場」です。
          </p>
          <Link
            href="/philosophy"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            Philosophy を読む
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            まずは対話から始めませんか？
          </h2>
          <p className="text-white/80 text-lg mb-12">
            無理な勧誘は一切ありません。
            <br />
            あなたの「今」と「これから」について、一緒に考える時間を。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all hover:scale-105"
            >
              無料相談を申し込む
            </Link>
            <Link
              href="/kamiotto#seminar"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              体験セミナーに参加する
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
