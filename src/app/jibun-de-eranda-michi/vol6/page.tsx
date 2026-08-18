// src/app/jibun-de-eranda-michi/vol6/page.tsx
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { eventJsonLd, breadcrumbJsonLd } from '@/content/event-schema';

export const metadata = {
title: '第六回 自分で選んだ道 vol.6',
description: '産業能率大学教授・亀田憲さんが語る、自分を何度もupdateしつづけるキャリアの選び方。2026年8月5日、神田錦町にて開催。',
};

const APPLY_URL = 'https://forms.gle/SfqWabaM28FxUYbw8';

export default function JibunVol6() {
return (
<main className="min-h-screen bg-white text-stone-900">
      <JsonLd data={eventJsonLd(6)} />
      <JsonLd data={breadcrumbJsonLd([{ name: '自分で選んだ道', path: '/jibun-de-eranda-michi' }, { name: 'vol.6 亀田憲', path: '/jibun-de-eranda-michi/vol6' }])} />

{/* ヒーローセクション */}
<section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
<div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
<div className="relative z-10 max-w-3xl mx-auto text-center">
<span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
「自分で選んだ道」 vol.6
</span>
<h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
人生カスタマイズ時代を、<br />
<span className="font-normal">どう生きるのか</span>
</h1>
<p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
会社が敷いたレールも、「正解」とされる生き方も、もうどこにもない時代。<br />
自分の価値観を軸に、自由に、しなやかに生きるヒントを一緒に探す。
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
<p className="text-lg font-light">亀田 憲（かめだ けん）</p>
<p>産業能率大学 経営学部 教授／中小企業診断士／MBA（グロービス経営大学院）。</p>
<p>専門は、マーケティング戦略・ブランド戦略・商品開発・消費者行動。実務と理論を行き来する。</p>
<p>東急エージェンシーからはじまり、ディズニー、アディダス、チチカカ、ブランドコンサル、ビデオリサーチ。広告代理店の営業からブランディング、コンサルティング、そしてシンクタンクの所長まで。「マーケティング戦略」と徹底的に、真正面から向き合い続けてきた。</p>
<p>その間に、MBAを取り、中小企業診断士になり、4冊の本を出している。</p>
<p className="pt-4 border-t border-stone-200 text-stone-600 italic">
いつも何かにチャレンジして、自分自身を何度もupdateし続けてきた人。
</p>
<p className="text-stone-500">完成された答えではなく、途中のまま語る、その一夜。</p>
</div>
</div>
</section>

{/* 3つの問い */}
<section className="px-6 py-24">
<div className="max-w-2xl mx-auto">
<span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">QUESTIONS</span>
<h2 className="text-2xl font-light mb-12 tracking-tight">この夜、いっしょに考えたい3つの問い</h2>
<div className="border border-stone-200 divide-y divide-stone-200">
{[
{
no: 'Q1',
title: '自分の「強み」は、どう掛け算するか',
body: 'マーケティング × 診断士 × MBA。複数の武器を重ねて、自分だけの価値をつくる。',
},
{
no: 'Q2',
title: '迷ったとき、何を基準に選ぶか',
body: '転職も挑戦も、軸ではなく戦略で。キャリアの分岐点での意思決定を考える。',
},
{
no: 'Q3',
title: '「updateしつづける」ために必要なもの',
body: '学び直し、資格、出版。自分をアップデートしつづける習慣とは。',
},
].map((q) => (
<div key={q.no} className="flex">
<div className="w-28 md:w-36 px-4 py-6 bg-stone-50 text-sm text-stone-500 flex-shrink-0">{q.no}</div>
<div className="px-4 py-6">
<p className="text-stone-800 mb-2">{q.title}</p>
<p className="text-sm text-stone-500 leading-relaxed">{q.body}</p>
</div>
</div>
))}
</div>
</div>
</section>

{/* ゲストの哲学 */}
<section className="px-6 py-24 bg-stone-50">
<div className="max-w-2xl mx-auto">
<span className="text-xs tracking-[0.3em] text-stone-400 block mb-4">MESSAGE FROM THE GUEST</span>
<h2 className="text-2xl font-light mb-12 tracking-tight">亀田さんの哲学</h2>
<blockquote className="text-xl md:text-2xl font-light leading-relaxed text-stone-800 border-l-2 border-stone-300 pl-6">
“知恵”と“経験”という武器を手に、仲間と冒険をしよう。
</blockquote>
<p className="mt-8 text-stone-600 leading-relaxed">
人生という冒険は、一人で挑むものではありません。失敗なんて怖くない。仲間とともに学び、挑戦し、成長していく。そんな冒険の旅を楽しみましょう。
</p>
<div className="mt-12">
<p className="text-xs tracking-[0.3em] text-stone-400 mb-4">A JOURNEY OF BECOMING</p>
<p className="text-stone-600 leading-relaxed">
東急エージェンシー ／ ディズニー ／ アディダス ／ チチカカ ／ ブランドコンサル ／ ビデオリサーチ
</p>
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
2026年8月5日（水）<br />
開場 19:15 / トーク 19:30〜20:30<br />
懇親会 20:30〜21:30
</div>
</div>
<div className="flex">
<div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">場所</div>
<div className="px-4 py-4 text-stone-800">
神田SDGsコネクションビル 3階<br />
<span className="text-sm text-stone-500">〒101-0054 東京都千代田区神田錦町2-9-15</span>
</div>
</div>
<div className="flex">
<div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">参加費</div>
<div className="px-4 py-4 text-stone-800">
3,000円（税込）<br />
<span className="text-sm text-stone-500">※懇親会費を含みます</span>
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
'キャリアの分岐点に立っている',
'複数の強みを、どう掛け算するか悩んでいる',
'学び直しや資格取得を考えている',
'「正解のない時代」の選び方を知りたい',
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
<p>亀田さんとは、以前の職場で同じチームにいました。</p>
<p>それから何年も経ちますが、会うたびに肩書きが増えています。<br />ディズニー、アディダス、ブランドコンサル、ビデオリサーチ、そして大学教授。<br />その間にMBAを取り、中小企業診断士になり、本を4冊出している。</p>
<p className="py-4 text-stone-600 italic border-l-2 border-stone-300 pl-6">
なぜ、そんなに動き続けられるのか。<br />
実は私も、ちゃんと聞いたことがありません。
</p>
<p>今回、それを聞きます。</p>
<p>会社が敷いたレールも、正解とされる生き方も、もうどこにもない時代です。<br />そのなかで、自分を何度もupdateしてきた人が、何を基準に選んできたのか。</p>
<p>その話を、途中のまま聞かせてもらいます。</p>
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
