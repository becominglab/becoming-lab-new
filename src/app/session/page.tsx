import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "目標達成セッション",
  description: "頑張らせるセッションではなく、判断と選択を整えるための1on1対話。Becoming Labの目標達成セッション。",
};

export default function SessionPage() {
  const features = [
    {
      title: "頑張らせない",
      desc: "モチベーションに頼らず、仕組みと習慣で前に進む方法を一緒に考えます。",
    },
    {
      title: "判断を整える",
      desc: "選択肢を広げ、優先順位を明確にし、決断できる状態をつくります。",
    },
    {
      title: "在り方から変える",
      desc: "何をするかより、どんな在り方でいるか。Beingの変化がDoingを変えます。",
    },
    {
      title: "統合的に扱う",
      desc: "仕事だけ、家庭だけではなく、人生全体を視野に入れた対話をします。",
    },
  ];

  const process = [
    { step: "01", title: "無料相談", desc: "現状と課題をヒアリング。セッションが合うかどうか確認します。" },
    { step: "02", title: "目標設定", desc: "3ヶ月後にどうなっていたいか。具体的なゴールを設定します。" },
    { step: "03", title: "定期セッション", desc: "隔週60分のオンラインセッション。対話を通じて気づきを促します。" },
    { step: "04", title: "振り返り", desc: "3ヶ月ごとに進捗を振り返り、次のステップを設計します。" },
  ];

  const plans = [
    {
      name: "スタンダード",
      price: "30,000",
      period: "月額",
      features: ["隔週60分セッション（月2回）", "LINEでの質問サポート", "目標設定ワークシート"],
      recommended: false,
    },
    {
      name: "プレミアム",
      price: "50,000",
      period: "月額",
      features: ["週1回60分セッション（月4回）", "LINEでの随時サポート", "目標設定ワークシート", "アクションプラン作成"],
      recommended: true,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-accent mb-4">COACHING</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-primary leading-tight mb-8">
            目標達成セッション
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            頑張らせるセッションではなく、
            <br />
            判断と選択を整えるための1on1対話。
          </p>
          <Link
            href="/contact?type=session"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all"
          >
            無料相談を申し込む
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              こんな状態ではありませんか？
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "やりたいことはあるのに、なかなか始められない",
              "目標を立てても、途中で挫折してしまう",
              "何を優先すべきか、判断に迷うことが多い",
              "一人で考えていると、堂々巡りになる",
              "忙しさに追われて、本当に大事なことができていない",
              "変わりたいのに、変われない自分にもどかしさを感じる",
            ].map((problem, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-accent text-xl">•</span>
                <p className="text-gray-700">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">FEATURES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              Becoming Lab セッションの特徴
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PROCESS</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              セッションの流れ
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">PRICING</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              料金プラン
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl ${
                  plan.recommended
                    ? "bg-gradient-to-br from-primary to-secondary text-white"
                    : "bg-white border border-gray-100"
                }`}
              >
                {plan.recommended && (
                  <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-medium rounded-full mb-4">
                    おすすめ
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.recommended ? "text-white" : "text-primary"}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-black ${plan.recommended ? "text-white" : "text-primary"}`}>
                    ¥{plan.price}
                  </span>
                  <span className={plan.recommended ? "text-white/60" : "text-gray-500"}>
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.recommended ? "text-accent" : "text-accent"}`} />
                      <span className={plan.recommended ? "text-white/80" : "text-gray-600"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?type=session"
                  className={`block text-center py-3 rounded-full font-medium transition-colors ${
                    plan.recommended
                      ? "bg-white text-primary hover:bg-gray-100"
                      : "bg-primary text-white hover:bg-secondary"
                  }`}
                >
                  無料相談を申し込む
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            ※ 最低契約期間は3ヶ月です。まずは無料相談でご相談ください。
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            まずは対話から始めませんか？
          </h2>
          <p className="text-white/80 text-lg mb-12">
            無料相談では、現状の課題をヒアリングし、
            <br />
            セッションが合うかどうかを一緒に確認します。
          </p>
          <Link
            href="/contact?type=session"
            className="inline-block bg-white text-primary px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
          >
            無料相談を申し込む
          </Link>
        </div>
      </section>
    </>
  );
}
