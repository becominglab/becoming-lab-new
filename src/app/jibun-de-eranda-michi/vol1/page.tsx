// src/app/kataribe/vol1/page.tsx
import Link from 'next/link';

export const metadata = {
  title: '第一回 自分で選んだ道 | becoming lab',
  description: '国立大卒、ベンチャー新規事業のエース。圧倒的成果を手放し、猟師として自給自足の道を選んだ24歳が語る「志」の物語。2026年3月12日、神田錦町にて開催。',
};

export default function KataribeVol1() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      
      {/* ヒーローセクション */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
            KATARIBE vol.1
          </span>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
            圧倒的成果を手放し、<br />
            <span className="font-normal">山へ還った24歳</span>
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
            国立大卒・ベンチャー新規事業のエース。<br />
            その全てを捨て、猟師として自給自足の道を選んだ青年が語る「志」の物語。
          </p>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* 語り部の紹介 */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">STORYTELLER</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">スピーカーについて</h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p className="text-lg font-light">24歳。国立大学農学部卒業。</p>
            <p>在学中からベンチャー企業でインターンを経験し、卒業後は新入社員として入社。新規事業部門で圧倒的な成果を出し、周囲の期待を集めていた。</p>
            <p>しかし、入社2年目で退職を決意。</p>
            <p>現在は猟師として山に入り、自給自足の生活を送りながら、近い将来、観光事業にも挑戦しようとしている。</p>
            <p className="pt-4 border-t border-stone-200 text-stone-600 italic">「成功」と呼ばれるレールから降り、自分の手で生きることを選んだ彼が、今何を見つめ、何を志しているのか。</p>
            <p className="text-stone-500">完成された答えではなく、途中のまま語る、その一夜。</p>
          </div>
        </div>
      </section>

      {/* イベント概要 */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">EVENT DETAILS</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">開催概要</h2>
          <div className="border border-stone-200 divide-y divide-stone-200">
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">日時</div>
              <div className="px-4 py-4 text-stone-800">2026年3月12日（木）19:30〜</div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">場所</div>
              <div className="px-4 py-4 text-stone-800">神田錦町周辺<br /><span className="text-sm text-stone-500">詳細は申込者にお知らせします</span></div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">参加費</div>
              <div className="px-4 py-4 text-stone-800">2,000円</div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">定員</div>
              <div className="px-4 py-4 text-stone-800">30名</div>
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-6">※ 終了時刻は21:00頃を予定しています</p>
        </div>
      </section>

      {/* こんな方へ */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">FOR YOU</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">こんな方へ</h2>
          <ul className="space-y-4">
            {['今の生き方に違和感を感じている', '「成功」の定義を自分で問い直したい', '自分らしい選択をした人の話を聴きたい', '人生の転機にいる、またはこれから迎える'].map((item, i) => (
              <li key={i} className="flex items-start gap-4 text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 主催者より */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">FROM HOST</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">この会について</h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p>この3年間、彼と過ごしてきました。</p>
            <p>周りが羨むような成果を出してきた日々。<br />そして、全てを手放す決断をしたときの、澄んだ目。</p>
            <p>彼の熱い思いを受け取ったとき、becoming lab をこのような形で始めたいと思いました。</p>
            <p className="py-4 text-stone-600 italic border-l-2 border-stone-300 pl-6">スピーカーは、完成した人ではありません。<br />途中のまま語る人です。</p>
            <p>彼の言葉が、誰かの問いになり、<br />その問いが、また誰かの語りになる。</p>
            <p>そんな循環の、最初の一歩。<br />大切な第一回目を、一緒に過ごしませんか。</p>
            <p className="pt-8 text-sm text-stone-500">becoming lab 主宰</p>
          </div>
        </div>
      </section>

      {/* 申し込み導線 */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-stone-500 block mb-4">JOIN US</span>
          <h2 className="text-2xl font-light mb-8 tracking-tight">参加申し込み</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300">
            <span className="text-sm">▶</span>
            <span>参加を申し込む</span>
          </Link>
          <p className="text-sm text-stone-500 mt-8">※ 定員に達し次第、締め切らせていただきます</p>
        </div>
      </section>

    </main>
  );
}
