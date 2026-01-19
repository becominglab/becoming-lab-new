import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Becoming Labのブログ。夫婦関係、人生の更新、トライアスロンについて発信しています。",
};

// 仮のブログデータ（実際はCMSやMDXから取得）
const posts = [
  {
    slug: "what-wife-really-wants",
    title: "妻が本当に求めていること—家事の「量」ではなく「気づき」",
    description: "多くの夫が「もっと家事をやらなければ」と考えますが、妻が本当に求めているのは家事の量ではありません。",
    date: "2026.01.15",
    category: "神夫養成講座",
  },
  {
    slug: "letting-go-of-completion",
    title: "「完成」を手放したら、人生が動き出した話",
    description: "完璧を目指すことをやめた時、本当の成長が始まりました。",
    date: "2026.01.10",
    category: "Philosophy",
  },
  {
    slug: "triathlon-continuation",
    title: "トライアスロンが教えてくれた「継続」の本質",
    description: "3種目を続けることで見えてきた、継続の本当の意味とは。",
    date: "2026.01.05",
    category: "Triathlon",
  },
  {
    slug: "morning-routine-husband",
    title: "神夫の朝習慣—1日5分で家庭が変わる",
    description: "たった5分の朝の習慣が、夫婦関係を劇的に変える理由。",
    date: "2026.01.01",
    category: "神夫養成講座",
  },
  {
    slug: "communication-without-anger",
    title: "怒らせないコミュニケーション術—3つのポイント",
    description: "妻を怒らせてしまう会話のパターンと、その改善方法。",
    date: "2025.12.28",
    category: "神夫養成講座",
  },
  {
    slug: "align-face-weave",
    title: "整える・向き合う・つむぐ—Becoming Labの3つの価値観",
    description: "なぜこの3つが人生を変える力を持つのか、詳しく解説します。",
    date: "2025.12.25",
    category: "Philosophy",
  },
];

const categories = ["すべて", "神夫養成講座", "Philosophy", "Triathlon", "Coaching"];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-sm tracking-widest text-accent mb-4">BLOG</p>
            <h1 className="text-4xl md:text-5xl font-display font-black text-primary mb-6">
              更新する人生のための
              <br className="md:hidden" />
              ヒント
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              夫婦関係、人生の哲学、トライアスロンの学び。
              <br />
              日々の気づきを発信しています。
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Featured Post */}
          <article className="mb-16">
            <Link href={`/blog/${posts[0].slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl overflow-hidden flex items-center justify-center">
                  <span className="text-6xl">📝</span>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-4">
                    {posts[0].category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{posts[0].description}</p>
                  <p className="text-sm text-gray-400">{posts[0].date}</p>
                </div>
              </div>
            </Link>
          </article>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden mb-4 group-hover:shadow-lg transition-shadow flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{post.description}</p>
                  <p className="text-xs text-gray-400">{post.date}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
            最新記事をメールでお届け
          </h2>
          <p className="text-gray-600 mb-8">
            週1回、新しい記事やイベント情報をお届けします。
            <br />
            いつでも解除できます。
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="メールアドレス"
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors"
            >
              登録する
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
