import Link from "next/link";
import { ArrowLeft, Twitter, Facebook, Share2 } from "lucide-react";
import type { Metadata } from "next";

// 仮のブログデータ
const post = {
  slug: "what-wife-really-wants",
  title: "妻が本当に求めていること—家事の「量」ではなく「気づき」",
  description: "多くの夫が「もっと家事をやらなければ」と考えますが、妻が本当に求めているのは家事の量ではありません。",
  date: "2026年1月15日",
  category: "神夫養成講座",
  author: "Becoming Lab",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage() {
  return (
    <article className="pt-32 pb-16">
      {/* Back Link */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          記事一覧に戻る
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 mb-12">
        <div className="text-center">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-6">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-primary leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-gray-600 text-lg mb-8">{post.description}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>{post.author}</span>
            <span>•</span>
            <time>{post.date}</time>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl overflow-hidden flex items-center justify-center">
          <span className="text-8xl">👨‍👩‍👧‍👦</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-display font-bold text-primary mt-12 mb-6">はじめに</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            「もっと家事を手伝わなければ」
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            そう思って頑張っているのに、なぜか妻は満足してくれない。むしろ、「そうじゃない」と言われてしまう。
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">こんな経験はありませんか？</p>
          <p className="text-gray-600 leading-relaxed mb-6">
            実は、妻が本当に求めているのは家事の「量」ではないのです。
          </p>

          <h2 className="text-2xl font-display font-bold text-primary mt-12 mb-6">
            妻が求めているのは「気づき」
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            神夫養成講座で多くの夫婦と接してきて、一つの共通点に気づきました。
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-primary font-bold">
              妻が本当に求めているのは、「気づいてくれること」です。
            </strong>
          </p>
          <ul className="my-6 space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              ゴミ袋がいっぱいになっていることに気づく
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              子どもが熱を出しそうな兆候に気づく
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              妻が疲れていることに気づく
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            言われる前に気づいて、行動する。これが「神夫」への第一歩です。
          </p>

          <h2 className="text-2xl font-display font-bold text-primary mt-12 mb-6">
            なぜ「気づき」が大切なのか
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            家事を「やる」ことと、「気づいて、やる」ことには大きな違いがあります。
          </p>

          <h3 className="text-xl font-display font-bold text-primary mt-8 mb-4">
            言われてからやる場合
          </h3>
          <ul className="my-6 space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              妻が「指示」を出さなければいけない
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              その度に妻の精神的負担が増える
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              「なんで言わないとわからないの？」というストレス
            </li>
          </ul>

          <h3 className="text-xl font-display font-bold text-primary mt-8 mb-4">
            気づいてやる場合
          </h3>
          <ul className="my-6 space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              妻は「見てくれている」と感じる
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              精神的な安心感が生まれる
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              「一緒にチームとして家庭を回している」という感覚
            </li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-primary mt-12 mb-6">
            「気づき力」を高める3つの習慣
          </h2>

          <h3 className="text-xl font-display font-bold text-primary mt-8 mb-4">
            1. 朝5分の「観察タイム」
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            朝起きたら、家の中を5分だけ見渡してみましょう。ゴミ箱の状態、洗濯物の量、冷蔵庫の中身、子どもの持ち物。これを毎日続けるだけで、「気づき力」は劇的に向上します。
          </p>

          <h3 className="text-xl font-display font-bold text-primary mt-8 mb-4">
            2. 「妻の表情」を見る習慣
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            妻の表情を意識的に見るようにしましょう。疲れている時、イライラしている時、嬉しい時。パターンがわかれば、先回りして対応できるようになります。
          </p>

          <h3 className="text-xl font-display font-bold text-primary mt-8 mb-4">
            3. 「言葉にする」習慣
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            気づいたことを言葉にしましょう。「ゴミ袋、替えておいたよ」ではなく、「ゴミ袋いっぱいになってたから、替えておいたよ」。
            <strong className="text-primary font-bold">気づいたこと自体を伝える</strong>
            ことで、妻は「見てくれている」と感じます。
          </p>

          <h2 className="text-2xl font-display font-bold text-primary mt-12 mb-6">まとめ</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            妻が本当に求めているのは、家事の「量」ではなく「気づき」です。
          </p>
          <ul className="my-6 space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              言われる前に気づく
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              気づいたことを行動に移す
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              気づいたこと自体を言葉にする
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            この3つを意識するだけで、夫婦関係は大きく変わります。
          </p>
          <p className="text-gray-600 leading-relaxed">
            神夫養成講座では、この「気づき力」を高めるための具体的なワークを行っています。興味のある方は、まずは体験セミナーにご参加ください。
          </p>
        </div>

        {/* Share Buttons */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">この記事をシェア</p>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#06C755] hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Author Box */}
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              BL
            </div>
            <div>
              <p className="font-bold text-primary mb-1">Becoming Lab</p>
              <p className="text-sm text-gray-600 mb-4">
                「自分らしく、更新し続ける」をテーマに、人生・仕事・家庭・挑戦を統合的に扱う事業を運営。神夫養成講座、目標達成セッション、コミュニティを通じて、更新を重ねる人生を支援しています。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-24 py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            神夫養成講座で、家庭を変える
          </h2>
          <p className="text-white/80 mb-8">
            この記事で紹介した「気づき力」をさらに深く学べる体験セミナーを開催中。
          </p>
          <Link
            href="/kamiotto#seminar"
            className="inline-block bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-accent/90 transition-all"
          >
            体験セミナーに申し込む
          </Link>
        </div>
      </section>
    </article>
  );
}
