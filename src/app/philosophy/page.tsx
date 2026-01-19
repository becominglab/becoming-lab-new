import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "Becoming Labの哲学。整える・向き合う・つむぐ—3つの価値観で人生を更新し続ける。",
};

export default function PhilosophyPage() {
  const values = [
    {
      emoji: "🧭",
      title: "整える（Align）",
      subtitle: "自分の軸を見つける",
      desc: "外側に正解を求めるのではなく、内側から始める。自分の価値観、感情、身体の声に耳を傾け、ブレない土台をつくる。整っていない状態で何かを始めても、長くは続かない。",
      questions: [
        "今、自分の中で何が起きているか？",
        "本当に大切にしたいことは何か？",
        "どんな状態でありたいか？",
      ],
    },
    {
      emoji: "🪞",
      title: "向き合う（Face）",
      subtitle: "現実と対話する",
      desc: "見たくないものを見る勇気。感情を抑え込まず、現実から逃げず、正直に対話する。向き合うことは辛いが、そこからしか本当の変化は生まれない。",
      questions: [
        "避けていることは何か？",
        "本当は何を感じているか？",
        "相手の視点から見ると？",
      ],
    },
    {
      emoji: "🧵",
      title: "つむぐ（Weave）",
      subtitle: "物語を編み上げる",
      desc: "点を線に、線を面に。バラバラだった経験を意味ある物語として編み上げる。過去の失敗も、今の苦しみも、すべてが人生の厚みになる。",
      questions: [
        "この経験から何を学べるか？",
        "どんな物語として語りたいか？",
        "次に何をつなげるか？",
      ],
    },
  ];

  const principles = [
    {
      title: "完成より更新",
      desc: "人生に「完成」はない。だからこそ、更新し続けることに価値がある。完璧を求めず、今日より明日、少しでも前に進む。",
    },
    {
      title: "分断より統合",
      desc: "仕事・家庭・挑戦を分けて考えない。すべてはつながっている。一つの領域での学びは、他の領域にも活きる。",
    },
    {
      title: "消費より循環",
      desc: "自分だけが得をするのではなく、学んだことを他者に還元する。成長・貢献・継続が循環する人生へ。",
    },
    {
      title: "孤独より対話",
      desc: "一人で抱え込まない。対話の中で気づきが生まれ、変化が起きる。弱さを見せられる関係性が、強さになる。",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-accent mb-4">PHILOSOPHY</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-primary leading-tight mb-8">
            完成ではなく、
            <br />
            更新を重ねる
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            人生は「完成」させるものではない。
            <br />
            整え、向き合い、つむぎながら、更新し続けるもの。
          </p>
        </div>
      </section>

      {/* Core Message */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12 rounded-3xl">
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                私たちは、「完成した自分」を目指しがちです。
              </p>
              <p>
                もっと稼げるようになったら。もっと時間ができたら。もっと落ち着いたら。
                <br />
                そうしたら、やっと「理想の人生」が始まると思っている。
              </p>
              <p>
                でも、その「完成」は永遠にやってきません。
                <br />
                なぜなら、人生は常に変化し続けるものだから。
              </p>
              <p className="text-primary font-bold text-xl">
                だからこそ、Becoming Lab は「更新を重ねる人生」を提案します。
              </p>
              <p>
                完成を待たない。今のままで始める。
                <br />
                そして、少しずつ、更新し続ける。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">THREE VALUES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              3つの価値観
            </h2>
          </div>
          <div className="space-y-12">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100"
              >
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl">{value.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{value.title}</h3>
                        <p className="text-accent">{value.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">{value.desc}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <p className="text-sm font-medium text-primary mb-4">問いかけ</p>
                    <ul className="space-y-3">
                      {value.questions.map((q, j) => (
                        <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-accent">?</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PRINCIPLES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              行動の原則
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{principle.title}</h3>
                <p className="text-gray-600 leading-relaxed">{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl md:text-3xl font-display font-bold leading-relaxed mb-8">
            「人生は、なるものではなく、
            <br />
            なりつつあるものである」
          </blockquote>
          <p className="text-white/60">— Becoming Lab</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            更新を始めませんか？
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            完璧を待たなくていい。今のままで始められる。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kamiotto"
              className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all"
            >
              神夫養成講座を見る
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary text-primary px-8 py-4 rounded-full font-medium hover:bg-primary hover:text-white transition-all"
            >
              対話を始める
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
