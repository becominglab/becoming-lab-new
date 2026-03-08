import Link from "next/link";

export const metadata = {
  title: "立川さん | コミュニティメンバー",
  description: "国立大卒・ベンチャー企業のエースから、秩父の猟師へ。24歳が選んだ、自分の志の物語。",
};

export default function TachikawaMemberPage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8">
          <Link href="/members" className="text-xs text-stone-400 hover:text-stone-600 transition-colors mb-6 block">
            ← メンバー一覧に戻る
          </Link>
          <p className="text-xs tracking-widest text-gray-400 mb-4">COMMUNITY MEMBER</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">立川さん</h1>
          <p className="text-sm text-stone-500">自分で選んだ道：猟師として生きる道</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8 pt-16">

          {/* 自分で選んだ道 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">CHOSEN PATH</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">猟師として生きる道</h2>
            <p className="text-gray-600 leading-relaxed">
              国立大学農学部を卒業後、ベンチャー企業の新規事業部門で圧倒的な成果を出しながらも、入社2年目で退職。現在は秩父で猟師として山に入り、自給自足の生活を送りながら、観光事業への挑戦も見据えている。
            </p>
          </div>

          {/* プロフィール */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">PROFILE</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">プロフィール</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>24歳。国立大学農学部卒業。在学中からベンチャー企業でインターンを経験し、卒業後は新入社員として入社。新規事業部門で圧倒的な成果を出し、周囲の期待を集めていた。</p>
              <p>しかし、入社2年目で退職を決意。現在は猟師として山に入り、自給自足の生活を送りながら、近い将来、観光事業にも挑戦しようとしている。</p>
            </div>
          </div>

          {/* 人生の転機 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">TURNING POINT</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">人生の転機</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>周りが羨むような成果を出してきた日々。しかし、他人の期待を生きるレールから降り、自分の声に正直になったとき、選んだのは山と猟師の生活だった。</p>
              <p className="border-l-2 border-stone-300 pl-6 italic text-stone-500">
                「期待に応えて生きてきた。それが間違いだとは思わない。ただ自分の声を、後回しにしてきた。」
              </p>
            </div>
          </div>

          {/* 今取り組んでいること */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">NOW</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">今取り組んでいること</h2>
            <p className="text-gray-600 leading-relaxed">
              秩父での猟師生活を基盤としながら、自然と人をつなぐ観光事業を構想中。自分の手で生きることの意味を問いながら、新たな挑戦の準備を進めている。
            </p>
          </div>

          {/* becoming labでの役割 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">ROLE</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">becoming labでの役割</h2>
            <div className="flex gap-3 flex-wrap">
              {["Story Teller", "Challenger"].map((role) => (
                <span key={role} className="text-xs px-3 py-1 border border-stone-300 text-stone-600">{role}</span>
              ))}
            </div>
          </div>

          {/* コミュニティへの貢献 */}
          <div className="mb-16">
            <p className="text-xs tracking-widest text-gray-400 mb-4">CONTRIBUTION</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">コミュニティへの貢献</h2>
            <p className="text-gray-600 leading-relaxed">
              挑戦する姿と、人生のリアルなストーリー。「自分で選んだ道」第1回スピーカーとして、becoming labの最初の語りを担ってくれた。彼の言葉が、多くの参加者に新しい問いを生んだ。
            </p>
          </div>

          {/* Message */}
          <div className="mb-16 p-8 bg-stone-50">
            <p className="text-xs tracking-widest text-gray-400 mb-4">MESSAGE</p>
            <p className="text-gray-700 leading-relaxed italic">
              「完成していなくていい。途中のままで、語ることに意味がある。」
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
