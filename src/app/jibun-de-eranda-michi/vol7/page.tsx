// src/app/jibun-de-eranda-michi/vol7/page.tsx
import Link from 'next/link';

export const metadata = {
title: '第七回 自分で選んだ道 vol.7 | becoming lab',
description: '一般社団法人学士会・村松健一さんが語る、目標を失って見つけた「人のために」という生き方。2026年9月17日、神田錦町にて開催。',
};

const APPLY_URL = 'https://forms.gle/vniGBrjt6wHem4s9A';

export default function JibunVol7() {
return (
<main className="min-h-screen bg-white text-stone-900">

{/* ヒーローセクション */}
<section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
<div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
<div className="relative z-10 max-w-3xl mx-auto text-center">
<span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
「自分で選んだ道」 vol.7
</span>
<h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
誰のために、<br />
<span className="font-normal">今を歩く。</span>
</h1>
<p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
目標を失って見つけた、<br />
「人のために」という生き方。
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
<p className="text-lg font-light">村松 健一（むらまつ けんいち）</p>
<p>一般社団法人 学士会。</p>
<p>旧帝国大学系の卒業生が集う、百年を超える同窓会コミュニティ。その活性化に取り組み、若手会員のコミュニティ「学士会Yell」を通じて、会員同士を、そして外の挑戦者を、場に招き入れてきた。</p>
<p>歴史ある組織を守ることと、新しい風を通すこと。その両方を引き受ける立場で、村松さんは何を選び続けてきたのか。</p>
<p>ある子ども支援の活動に寄せた文章で、村松さんはこう書いている。物事には、応援してほしいタイミングと、手伝ってほしいタイミングがある。そして、今は後者だと、自ら動いた。</p>
<p className="pt-4 border-t border-stone-200 text-stone-600 italic">
自分を探しても見つからない。誰かと歩いた先に、自分がいた。
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
2026年9月17日（木）<br />
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
'目標を見失って、立ち止まっている',
'「応援したい」と思いながら、動けずにいる',
'コミュニティや場づくりに関わっている',
'すでにある組織を、内側から更新したい',
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
<p>誰かの挑戦を前にしたとき、私たちはよく「応援しています」と言います。<br />嘘ではない。けれど、そこで止まってしまうことも多い。</p>
<p>村松さんは、そこで止まらなかった人です。<br />自分が関わる場の扉を開け、話す機会をつくり、人をつないだ。<br />大きな支援ではなく、いまできる形で、少しだけ順番を前に出す。</p>
<p className="py-4 text-stone-600 italic border-l-2 border-stone-300 pl-6">
自分を探しても見つからない。<br />
誰かと歩いた先に、自分がいた。
</p>
<p>目標を失うことは、たいてい不運として語られます。<br />けれどその先で見つかるものがある、という話を、今回は聴きます。</p>
<p>百年以上続くコミュニティの中で、新しいものを通そうとすること。<br />それは、静かで、根気のいる選択だったはずです。</p>
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
