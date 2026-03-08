import Link from "next/link";

export const metadata = {
  title: "コミュニティ",
  description: "語り、聴き、一緒に過ごす場。becoming labのコミュニティで、日常が少しずつ更新されていく。",
};

export default function CommunityPage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">COMMUNITY</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Community</h1>
          <p className="text-lg text-gray-600">語りが、日常へと続いていく場所。</p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">

          {/* コミュニティとは */}
          <div className="mb-16">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>becoming lab のコミュニティは、自分で選んだ道で生まれた言葉や気づきが、日常の時間へとゆっくり溶け込んでいく場です。</p>
              <p>語る／聴く、だけで終わらず、一緒に過ごし、動き、対話する中で、人生が少しずつ更新されていきます。</p>
            </div>
          </div>

          {/* メンバーの定義 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">MEMBER</p>
            <h2 className="text-xl font-bold text-gray-900 mb-6">becoming lab メンバーの定義</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              becoming labのメンバーとは、人生を更新し続けようとする人です。<br />
              年齢や職業、立場は問いません。共通しているのは、次の姿勢です。
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>自分の人生を自分で選ぼうとする人</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>人生の途中を正直に語れる人</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>誰かの挑戦を応援できる人</li>
            </ul>
            <p className="text-gray-500">
              becoming labは、完成された人が集まる場所ではありません。<br />
              迷いながらも、考えながらも、自分の人生を歩こうとする人たちが集まるコミュニティです。
            </p>
          </div>

          {/* メンバーの役割 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">ROLES</p>
            <h2 className="text-xl font-bold text-gray-900 mb-8">Member Roles</h2>
            <p className="text-gray-600 mb-8">becoming labには、それぞれの人生を歩む人が集まり、さまざまな形でコミュニティに関わっています。</p>
            <div className="space-y-10">
              {[
                { en: "Story Teller", ja: "人生の途中を語る人", body: "Story Tellerは、自分の人生の途中を語る人です。完成された成功談ではなく、迷いや葛藤も含めたリアルな人生の物語を共有します。そのストーリーは、参加者に新しい問いを生みます。" },
                { en: "Challenger", ja: "自分で選んだ道を歩む人", body: "Challengerは、自分で選んだ道を歩んでいる人です。まだ途中でも、迷いながらでも構いません。挑戦している姿そのものが、コミュニティに勇気を与えます。" },
                { en: "Supporter", ja: "挑戦を応援する人", body: "Supporterは、コミュニティの仲間を応援する人です。誰かの挑戦を見守り、励まし、その歩みを尊重します。becoming labは応援の文化で成り立っています。" },
                { en: "Path Finder", ja: "新しい道を見つける人", body: "Path Finderは、人生の問いを持ち、自分の道を探している人です。まだ答えがなくても構いません。問いを持つこと自体が、人生を更新する第一歩です。" },
                { en: "Curator", ja: "コミュニティを育てる人", body: "Curatorは、becoming labという場を育てる人です。人と人をつなぎ、ストーリーが生まれる場をつくります。" },
              ].map((role, i) => (
                <div key={i} className="border-l-2 border-stone-200 pl-6">
                  <p className="text-xs tracking-widest text-stone-400 mb-1">{i + 1}</p>
                  <h3 className="font-bold text-gray-900 mb-1">{role.en}</h3>
                  <p className="text-sm text-stone-500 mb-3">{role.ja}</p>
                  <p className="text-gray-600 leading-relaxed text-sm">{role.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 大切にしている空気感 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">大切にしている空気感</h2>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>無理に話さなくていい</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>立派なことを言わなくていい</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>未完成のままでいていい</li>
            </ul>
            <p className="text-gray-500">ここは、自分を整えながら、他者と重なっていく場です。</p>
          </div>

          {/* 主な活動 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-8">主な活動</h2>
            <div className="space-y-8">
              {[
                { title: "自分で選んだ道（月1回）", body: "人生の途中を語り、聴き合う時間。すべての活動の起点です。" },
                { title: "食事会", body: "肩書きや役割を外し、同じテーブルを囲んで言葉を交わします。" },
                { title: "ウォーキング・ランニング・トライアスロン", body: "ウォーキングや皇居ラン、トライアスロン練習体験会など、身体を動かしながら、自分と向き合う時間。初心者の方も歓迎しています。機材のレンタルに対応できることもありますので、お気軽にご相談ください。" },
                { title: "勉強会・対話会", body: "仕事・家族・人生について、正解を探すのではなく、問いを深める場。" },
                { title: "合宿・リトリート（不定期）", body: "日常を離れ、人生全体を見渡すための時間。" },
              ].map((act, i) => (
                <div key={i}>
                  <h3 className="font-bold text-gray-900 mb-2">{act.title}</h3>
                  <p className="text-gray-600 text-sm">{act.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* コミュニティとの関わり方 */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">コミュニティとの関わり方</h2>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>参加は自由</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>継続は義務ではありません</li>
              <li className="flex items-start gap-2"><span className="text-stone-400 mt-1">・</span>参加と距離の取り方は、自分で決められます</li>
            </ul>
            <p className="text-gray-500">必要なタイミングで、必要な関わり方を。</p>
          </div>

          {/* メンバー紹介へ */}
          <div className="mb-16 p-6 bg-stone-50 border border-stone-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">コミュニティメンバー</h2>
            <p className="text-gray-600 text-sm mb-4">becoming labには、それぞれの人生を自分で選び、更新し続けようとしている人たちが集まっています。</p>
            <Link href="/members" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
              ▶ メンバーを見る
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B6B7A] text-white">
        <div className="max-w-2xl mx-auto px-8 space-y-4">
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ 開催情報を受け取る
          </Link>
          <Link href="/contact" className="block hover:opacity-70 transition-opacity">
            ▶ コミュニティについて相談する
          </Link>
        </div>
      </section>
    </>
  );
}
