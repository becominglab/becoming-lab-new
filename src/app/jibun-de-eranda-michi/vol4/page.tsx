// src/app/jibun-de-eranda-michi/vol4/page.tsx
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { eventJsonLd, breadcrumbJsonLd } from '@/content/event-schema';

export const metadata = {
  title: '第四回 自分で選んだ道 vol.4',
  description: '建設DX・ICT領域の最前線で活躍する法人営業リーダー・佐藤加奈子さんが語る、成果を出し続ける思考と在り方。2026年6月24日、神田錦町にて開催。',
};

const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfLLtEgLT6YTt1GbsiePrx8oTPjuC-D6t6ZAKTZWxFbueot0g/viewform';

export default function JibunVol4() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <JsonLd data={eventJsonLd(4)} />
      <JsonLd data={breadcrumbJsonLd([{ name: '自分で選んだ道', path: '/jibun-de-eranda-michi' }, { name: 'vol.4 佐藤加奈子', path: '/jibun-de-eranda-michi/vol4' }])} />

      {/* ヒーローセクション */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
            「自分で選んだ道」 vol.4
          </span>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
            最前線で戦う女性は、<br />
            <span className="font-normal">何を見ているのか</span>
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
            企業の課題解決を担う法人営業の最前線。<br />
            建設DX・ICT領域で活躍するリーダー。<br />
            成果を出し続ける思考と在り方に触れる。
          </p>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* スピーカー紹介 */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">SPEAKER</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">スピーカーについて</h2>
          <div className="space-y-6 text-stone-700 leading-relaxed">
            <p className="text-lg font-light">佐藤 加奈子（さとう かなこ）</p>
            <p>オリックス株式会社 事業法人営業第二部 第一チーム長。</p>
            <p>企業の課題解決を担う法人営業の最前線で、建設DX・ICT領域のリーダーとして活躍。</p>
            <p>ただ数字を追うのではなく、顧客の事業そのものに踏み込み、変化をつくり続けてきた。</p>
            <p className="pt-4 border-t border-stone-200 text-stone-600 italic">
              「最前線で戦う」とはどういうことか——成果を出し続ける思考と在り方に触れる、特別な時間です。
            </p>
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
              <div className="px-4 py-4 text-stone-800">
                2026年6月24日（水）<br />
                開場 19:15 / トーク 19:30〜20:30<br />
                懇親会 20:30〜21:30
              </div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">場所</div>
              <div className="px-4 py-4 text-stone-800">
                神田SDGsコネクション 3階<br />
                <span className="text-sm text-stone-500">東京都千代田区神田錦町2-9-15</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">参加費</div>
              <div className="px-4 py-4 text-stone-800">
                3,000円（税込）<br />
                <span className="text-sm text-stone-500">※懇親会飲食代込み</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* こんな方へ */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">FOR YOU</span>
          <h2 className="text-2xl font-light mb-12 tracking-tight">こんな方へ</h2>
          <ul className="space-y-4">
            {[
              '最前線で成果を出し続ける思考に触れたい',
              '女性リーダーの在り方を聴きたい',
              '法人営業／DX・ICT領域に関心がある',
              '自分の「働き方」を問い直したい',
            ].map((item, i) => (
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
            <p>佐藤さんと話していると、「強さ」という言葉のイメージが、少し変わります。</p>
            <p>建設DX・ICTという、変化のスピードが速い領域で、<br />企業の課題に向き合い続け、成果を出し続けてきた人。</p>
            <p>けれど、彼女が語ってくれたのは、<br />華やかな実績の話ではなく、<br />その手前にある「どう在るか」という問いでした。</p>
            <p>最前線で戦う女性は、何を見ているのか。<br />迷いも、痛みも、そのまま抱えながら、<br />それでも前に進む人の言葉を、聴きたいと思いました。</p>
            <p className="py-4 text-stone-600 italic border-l-2 border-stone-300 pl-6">
              スピーカーは、完成した人ではありません。<br />
              途中のまま語る人です。
            </p>
            <p>彼女の言葉が、誰かの問いになり、<br />その問いが、また誰かの語りになる。</p>
            <p>皆さまとお会いできることを楽しみにしています。</p>
            <p className="pt-8 text-sm text-stone-500">becoming lab 主宰</p>
          </div>
        </div>
      </section>

      {/* 申し込み導線 */}
      <section className="px-6 py-24 bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-stone-500 block mb-4">JOIN US</span>
          <h2 className="text-2xl font-light mb-8 tracking-tight">参加申し込み</h2>
          <Link
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300"
          >
            <span className="text-sm">▶</span>
            <span>参加を申し込む</span>
          </Link>
          <p className="text-sm text-stone-500 mt-8">※ 定員に達し次第、締め切らせていただきます</p>
        </div>
      </section>

    </main>
  );
}
