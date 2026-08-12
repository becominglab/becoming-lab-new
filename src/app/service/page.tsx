import Link from "next/link";

export const metadata = {
  title: "サービス",
  description: "1on1セッション・神夫養成研究所。自分の在り方を整え、人生の軸を見つけるプログラム。becoming lab。",
};

export default function ServicePage() {
  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">SERVICE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Service</h1>
          <p className="text-lg text-gray-600">必要なタイミングで、必要な深さへ。</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>「道」の集まりは、誰でも来られる場所です。そこで足りないと感じたときに、もう少し深いところへ進む道があります。</p>
            <p className="text-gray-500">一人で向き合うか、夫婦で向き合うか。二つあります。</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8 space-y-16">

          <div>
            <p className="text-xs tracking-widest text-gray-400 mb-3">01　一人で向き合う</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1on1 セッション</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              自分の人生の軸を、言葉にしていく時間です。答えを渡すのではなく、すでにある答えを一緒に見つけにいきます。
            </p>
            <ul className="space-y-2 text-gray-600 text-sm mb-6">
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>人生の軸を言葉にする</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>判断に確信を持つ</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>在り方を整える</li>
            </ul>
            <Link href="/session" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1B6B7A" }}>
              ▶ セッション詳細・ご予約
            </Link>
          </div>

          <div className="pt-16 border-t border-stone-200">
            <p className="text-xs tracking-widest text-gray-400 mb-3">02　夫婦で向き合う</p>
            <h2 className="text-xl font-bold text-gray-900 mb-1">神夫養成研究所</h2>
            <p className="text-sm text-gray-400 mb-6">by 大塚昌代　― 幸せは家庭から ―</p>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-6">
              <p>
                夫婦関係を通じて人生を整え、家庭から幸せの循環を広げていくための学びの場です。
              </p>
              <p className="py-4 border-l-2 border-stone-200 pl-6 text-gray-500">
                在り方が、家庭を変える。<br />
                家庭が、世界を照らす。
              </p>
              <p>
                「相手を変えること」ではなく、自分の在り方を整えることから始めます。夫を変える場所ではなく、あなた自身が整い、本来の輝きを取り戻す場所です。
              </p>
              <p className="text-gray-500 text-sm">
                覚醒期・共鳴期・神化期という三つの段階を通して、夫婦が互いを通して成長し合う関係へと進んでいきます。
              </p>
            </div>
            <a
              href="https://kamiotto.jp/koza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: "#1B6B7A" }}
            >
              ▶ 講座の詳細はこちら
            </a>
          </div>

        </div>
      </section>

      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-sm opacity-80 mb-6">どれが合うか分からないときも、まずお話しください。</p>
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ 相談する
          </Link>
        </div>
      </section>
    </>
  );
}
