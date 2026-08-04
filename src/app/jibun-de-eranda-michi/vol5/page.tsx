// src/app/jibun-de-eranda-michi/vol5/page.tsx
import Link from 'next/link';

export const metadata = {
title: '第五回 自分で選んだ道 vol.5 | becoming lab',
description: '100億円の事業をつくった鬼木陽一さんが語る、「何でもない自分」のまま生きるということ。2026年7月15日、神田錦町にて開催。',
};

const APPLY_URL = 'https://forms.gle/irNRHhRizpNSZXBAA';

export default function JibunVol5() {
return (
<main className="min-h-screen bg-white text-stone-900">

{/* ヒーローセクション */}
<section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24">
<div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-white pointer-events-none" />
<div className="relative z-10 max-w-3xl mx-auto text-center">
<span className="inline-block text-xs tracking-[0.3em] text-stone-500 mb-8 font-medium">
「自分で選んだ道」 vol.5
</span>
<h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 tracking-tight">
100億円の事業をつくった人が、<br />
<span className="font-normal">それでも「何でもない自分」を、生きている</span>
</h1>
<p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
目立ちたいけれど、勇気も自信もなかった。<br />
いつも「副」のつく人生を歩いてきた人が、<br />
それでもたどりついた、ひとつのこたえ。
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
<p className="text-lg font-light">鬼木 陽一（おにき よういち）</p>
<p>株式会社エスプール 事業戦略推進本部 執行役員。</p>
<p>「何かになりたい」は、ずっとあった。でも、自分には、何もなかった。</p>
<p>水泳は恐怖、サッカーはベンチ、徒競走はビリ。目立ちたいけれど、勇気も自信もない。いつも「副」のつく人生。何かになりたくて、小さな抵抗をくりかえしてきた。</p>
<p>社会人になり、仕事もお金も地位も、それなりに手に入れた。それが、しあわせだと思っていた。けれど2023年、言葉の力で人をしあわせにする親友が、この世を去る。彼が遺したかったものを考えるうちに、人生の折り返しに気づく。</p>
<p>残りの人生は、好きなことを、誰かの役に立つことを。たどりついたこたえは「はたらく」ことから、人をしあわせにしたい。</p>
<p className="pt-4 border-t border-stone-200 text-stone-600 italic">
何ものにもなれないけれど、小さくてもいいから、誰かの力になりたい。何でもない自分が何かになろうとした、ひとつのこたえ。
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
2026年7月15日（水）<br />
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
<div className="flex">
<div className="w-28 md:w-36 px-4 py-4 bg-stone-50 text-sm text-stone-500 flex-shrink-0">定員</div>
<div className="px-4 py-4 text-stone-800">30〜40名</div>
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
'「何かになりたい」と思いながら、まだなれていない',
'成功談ではなく、うまくやれなかった話を聴きたい',
'はたらくことの意味を、問い直したい',
'人生の折り返しについて考えている',
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
<p>鬼木さんの話をはじめて聴いたとき、正直、意外でした。</p>
<p>100億円の事業をつくった人の口から出てきたのが、<br />水泳が怖かった話や、いつも「副」がついていた話だったからです。</p>
<p>2023年に親友を亡くされてから、<br />鬼木さんのなかで何かの順番が入れ替わったのだと思います。<br />好きなことを、誰かの役に立つことを。<br />そのこたえが「はたらくことから、人をしあわせにする」でした。</p>
<p className="py-4 text-stone-600 italic border-l-2 border-stone-300 pl-6">
今日お話しするのは、勉強でも教訓でもありません。<br />
ヒーローとは真逆の、いくつになってもうまくやれない僕の、<br />
情けなくて取り留めのない話です。
</p>
<p>かまえずに、一緒に笑って、少しホッとして。<br />それぞれの胸のうちを、そっと分かち合えたら。</p>
<p>なりかけの自分を、愛せますか。<br />この問いを、持ち帰っていただけたらうれしいです。</p>
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
