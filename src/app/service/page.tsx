import Link from "next/link";

export const metadata = {
  title: "サービス",
  description: "1on1セッション・神夫養成講座。自分の在り方を整え、人生の軸を見つけるプログラム。becoming lab。",
};

export default function ServicePage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">SERVICE</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Service</h1>
          <p className="text-lg text-gray-600">必要なタイミングで、必要な深さへ。</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <div className="mb-16">
            <p className="text-gray-600 leading-relaxed">
              自分で選んだ道だけでなく、1on1 セッション・講座をご希望の方はこちら。
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">1on1 セッション</h2>
            <ul className="space-y-2 text-gray-600">
              <li>人生の軸を言葉にする</li>
              <li>判断に確信を持つ</li>
              <li>在り方を整える</li>
            </ul>
          </div>

          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-2">神夫養成研究所</h2>
            <p className="text-sm text-gray-400 mb-2">by 大塚昌代</p>
            <p className="text-sm text-gray-500 italic mb-8">― 幸せは家庭から ―</p>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                神夫養成研究所は、夫婦関係を通じて人生を整え、<br />
                家庭から幸せの循環を広げていくための学びの場です。
              </p>

              <p className="py-4 border-l-2 border-gray-200 pl-6 text-gray-500 italic">
                在り方が、家庭を変える。<br />
                家庭が、世界を照らす。
              </p>

              <p>
                「相手を変えること」ではなく、自分の在り方を整えることからすべてが始まる——
                私たちはそう考えています。
              </p>
              <p>
                人は誰もが本来、愛・調和・優しさといった"神性"を持つ存在です。
                その神性が整い始めると、最も近いパートナーとの関係が自然と変わり始め、
                やがて夫婦は互いの存在を通して成長し合う関係へと進化していきます。
              </p>

              <div className="pt-2">
                <h3 className="font-bold text-gray-800 mb-3">「神夫」とは何か</h3>
                <p>
                  神夫とは、完璧な夫のことではありません。<br />
                  夫婦が互いを尊重し、成長を支え合い、<br />
                  「この人と出会えてよかった」と心から言える関係の中で、自然と現れる存在のことです。
                </p>
                <p className="mt-3 text-gray-500">
                  神夫は、生まれつきの才能ではなく、夫婦という関係の中で育まれていくもの。<br />
                  その変化の始まりは、いつも「あなた自身」の内側から起こります。
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-gray-800 mb-4">夫婦が進化する三つの段階</h3>
                <div className="space-y-4">
                  {[
                    { label: "覚醒期", desc: "自分自身を知り、受け入れ、整え始める時期。すべての変化はここから始まります。" },
                    { label: "共鳴期", desc: "整った在り方がパートナーに伝わり、夫婦の空気や関係性が少しずつ変わり始める時期。" },
                    { label: "神化期", desc: "感謝と敬意が自然に循環し、夫婦が互いを通して成長し合う関係へと進化します。" },
                  ].map((stage, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-xs tracking-widest text-gray-400 mt-1 w-14 flex-shrink-0">{stage.label}</span>
                      <p className="text-gray-600 text-sm leading-relaxed">{stage.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500 italic">
                  焦る必要はありません。どの段階にいても、その旅路はすべて意味のあるものです。
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-gray-800 mb-3">大切にしていること</h3>
                <ul className="space-y-2">
                  {["感情を敵にしない", "正しさより愛を選ぶ", "相手を変えようとしない", "自分の在り方を整える", "比較を手放し、自分の人生に還る", "家庭からALL WINの循環をつくる"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-6 border-t border-b border-gray-100 text-gray-500 leading-relaxed">
                <p>ここは、夫を変える場所ではありません。</p>
                <p className="mt-2">あなた自身が整い、本来の輝きを取り戻す場所です。</p>
                <p className="mt-4 italic">
                  あなたが整えば、家庭が整う。<br />
                  家庭が整えば、社会が優しくなる。
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-gray-800 mb-3">こんな想いを持つあなたへ</h3>
                <ul className="space-y-2">
                  {["夫婦関係をもっと穏やかにしたい", "自分を大切にできるようになりたい", "子どもに誇れる夫婦でありたい", "我慢ではなく愛でつながりたい", "人生をもっと豊かにしたい"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-gray-500 italic">
                  その願いは、わがままではありません。それは、あなたの魂からの声です。
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI勉強会</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>AIは、道具です。<br />
              でも、道具を手にしたとき、人は問われます。<br />
              ——あなたは、何のために使うのか？</p>
              <p>becoming labのAI勉強会は、技術の習得よりも先に、その問いを大切にします。</p>
              <ul className="space-y-2">
                {["AIを通じて、自分の時間を取り戻す。", "AIを通じて、自分がやりたいことに集中できる。", "AIを通じて、自分で選んだ道を、もっと自分らしく歩く。"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>ここで学ぶのは、操作の仕方だけではありません。<br />
              「AIを使って、自分はどんな人生を創りたいのか」を、一緒に考える場です。</p>
              <p className="py-4 border-l-2 border-gray-200 pl-6 text-gray-500 italic">
                完成した答えは、持ってこなくていい。<br />
                試しながら、問いながら、更新していく。<br />
                それが、becoming lab のスタイルです。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8">
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            ▶ 相談する
          </Link>
        </div>
      </section>
    </>
  );
}
