import Link from "next/link";
import { Users, MessageCircle, Calendar, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コミュニティ",
  description: "Becoming Labのコミュニティ。食事会・勉強会・Circleを通じて、安心して立ち止まり、対話できる関係性。",
};

export default function CommunityPage() {
  const activities = [
    {
      icon: Users,
      title: "食事会",
      desc: "月1回、オフラインで集まる食事会。ゆるやかなつながりの中で、普段話せないことを話せる場。",
      frequency: "月1回",
    },
    {
      icon: MessageCircle,
      title: "勉強会",
      desc: "テーマを決めて学び合う勉強会。夫婦関係、コミュニケーション、目標設定など、実践的な内容を扱います。",
      frequency: "月2回",
    },
    {
      icon: Calendar,
      title: "Circle",
      desc: "少人数で深く対話するCircle。お互いの話を聴き合い、気づきを深める時間。",
      frequency: "週1回",
    },
    {
      icon: Heart,
      title: "オンラインコミュニティ",
      desc: "日々の気づきや質問を共有するオンラインスペース。いつでもつながれる安心感。",
      frequency: "常時",
    },
  ];

  const values = [
    {
      title: "安心して弱さを見せられる",
      desc: "完璧でなくていい。悩みや失敗を共有できる関係性。",
    },
    {
      title: "一人じゃないと思える",
      desc: "同じように悩み、挑戦している仲間がいる。",
    },
    {
      title: "学びを実践に変えられる",
      desc: "知識だけでなく、実践報告や励まし合いで行動が続く。",
    },
    {
      title: "新しい視点が得られる",
      desc: "多様なバックグラウンドを持つ仲間との対話で視野が広がる。",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-accent mb-4">COMMUNITY</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-primary leading-tight mb-8">
            安心して立ち止まり、
            <br />
            対話できる場所
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            一人で抱え込まなくていい。
            <br />
            同じように悩み、挑戦する仲間がここにいます。
          </p>
          <Link
            href="/contact?type=other"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all"
          >
            コミュニティについて問い合わせる
          </Link>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">ACTIVITIES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              コミュニティの活動
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-primary">{activity.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {activity.frequency}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{activity.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">VALUES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              コミュニティで得られるもの
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Voice */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest text-accent mb-4">VOICE</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              メンバーの声
            </h2>
          </div>
          <div className="space-y-8">
            {[
              {
                text: "一人で悩んでいたことを話せる場所ができて、本当に救われました。同じように悩んでいる人がいると知るだけで、気持ちが軽くなります。",
                name: "40代・会社員",
              },
              {
                text: "勉強会で学んだことを、すぐに家庭で実践できる。その報告をコミュニティで共有すると、さらに励みになります。",
                name: "30代・経営者",
              },
              {
                text: "食事会で出会った仲間とは、ビジネスでもつながるようになりました。人生全体を共有できる関係性が心強いです。",
                name: "50代・会社員",
              },
            ].map((voice, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-gray-700 leading-relaxed mb-4">「{voice.text}」</p>
                <p className="text-sm text-gray-500">— {voice.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm tracking-widest text-accent mb-4">MEMBERSHIP</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8">
            メンバーシップ
          </h2>
          <div className="bg-white p-8 rounded-3xl border border-gray-100">
            <p className="text-5xl font-black text-primary mb-2">
              ¥5,000<span className="text-lg font-normal text-gray-500">/月</span>
            </p>
            <p className="text-gray-600 mb-6">すべての活動に参加可能</p>
            <ul className="text-left space-y-3 mb-8">
              {["食事会への参加", "勉強会への参加", "Circleへの参加", "オンラインコミュニティへの参加", "過去のコンテンツ閲覧"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <span className="text-accent">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact?type=other"
              className="block bg-primary text-white py-4 rounded-full font-medium hover:bg-secondary transition-colors"
            >
              メンバーシップについて問い合わせる
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            ※ 神夫養成講座の受講生は、在籍中は無料で参加できます
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            一人じゃない、を実感しませんか？
          </h2>
          <p className="text-white/80 text-lg mb-12">
            まずは体験として、食事会や勉強会に参加してみてください。
          </p>
          <Link
            href="/contact?type=other"
            className="inline-block bg-white text-primary px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
          >
            問い合わせる
          </Link>
        </div>
      </section>
    </>
  );
}
