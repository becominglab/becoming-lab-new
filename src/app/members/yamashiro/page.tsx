import Link from "next/link";

export const metadata = {
  title: "山岸穂高 | コミュニティメンバー",
  description: "プロトライアスリート、ロングディスタンス日本チャンピオン。アスリートとして世界を目指す道を歩む、山岸穂高の物語。",
};

export default function YamashiroMemberPage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <Link href="/members" className="text-xs text-stone-400 hover:text-stone-600 transition-colors mb-6 block">
            ← メンバー一覧に戻る
          </Link>
          <p className="text-xs tracking-widest text-gray-400 mb-4">COMMUNITY MEMBER</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">山岸穂高</h1>
          <p className="text-sm text-stone-500">自分で選んだ道：アスリートとして世界を目指す道</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8 pt-16">

          {/* 自分で選んだ道 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">CHOSEN PATH</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">アスリートとして世界を目指す道</h2>
            <p className="text-gray-600 leading-relaxed">
              プロトライアスリートとして、ロングディスタンス（アイアンマン）の日本チャンピオンに輝いた山岸穂高。自分で選んだ競技の道を極めながら、その挑戦する姿でコミュニティに勇気を与え続けている。
            </p>
          </div>

          {/* プロフィール */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">PROFILE</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">プロフィール</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>プロトライアスリート。ロングディスタンス（アイアンマン距離：スイム3.8km、バイク180km、ラン42.195km）の日本チャンピオン。</p>
              <p>競技の枠を超え、挑戦することの意味、自分で道を選ぶことの重さを、becoming labのコミュニティと共有している。</p>
            </div>
          </div>

          {/* 人生の転機 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">TURNING POINT</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">人生の転機</h2>
            <p className="text-gray-600 leading-relaxed">
              トライアスロンという競技を通じて、限界と向き合い続けてきた。「まだ途中」と感じながらも、その途中を正直に語ることが、次の誰かの一歩になると信じている。
            </p>
          </div>

          {/* 今取り組んでいること */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">NOW</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">今取り組んでいること</h2>
            <p className="text-gray-600 leading-relaxed">
              世界大会への挑戦を続けながら、トライアスロンを通じた人の成長・コミュニティづくりにも力を入れている。becoming labでのトライアスロン練習体験会など、身体を通じた対話の場を共につくっている。
            </p>
          </div>

          {/* becoming labでの役割 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">ROLE</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">becoming labでの役割</h2>
            <div className="flex gap-3 flex-wrap">
              {["Story Teller", "Challenger", "Supporter"].map((role) => (
                <span key={role} className="text-xs px-3 py-1 border border-stone-300 text-stone-600">{role}</span>
              ))}
            </div>
          </div>

          {/* コミュニティへの貢献 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">CONTRIBUTION</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">コミュニティへの貢献</h2>
            <p className="text-gray-600 leading-relaxed">
              挑戦する姿そのものが、コミュニティへの贈り物。プロアスリートとしての日々のリアルを語り、「自分で選んだ道」vol.2のスピーカーとして参加。トライアスロン体験会など、身体を動かしながらつながる場もつくっている。
            </p>
          </div>

          {/* イベント情報 */}
          <div className="mb-16 p-6 bg-stone-50 border border-stone-200">
            <p className="text-xs tracking-widest text-gray-400 mb-3">UPCOMING EVENT</p>
            <p className="font-bold text-gray-900 mb-1">「自分で選んだ道」vol.2 スピーカー</p>
            <p className="text-sm text-stone-500 mb-4">2026年4月22日（水）19:30〜 ｜ 神田錦町</p>
            <Link href="/jibun-de-eranda-michi/vol2" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
              ▶ イベント詳細を見る
            </Link>
          </div>

          {/* Message */}
          <div className="mb-16 p-8 bg-stone-50">
            <p className="text-xs tracking-widest text-gray-400 mb-4">MESSAGE</p>
            <p className="text-gray-700 leading-relaxed italic">
              「挑戦しているときは、いつも途中だ。それでいい。途中を、一緒に走ろう。」
            </p>
          </div>

          {/* 戻るリンク */}
          <div className="pt-8 border-t border-stone-200">
            <Link href="/members" className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity">
              ← メンバー一覧に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
