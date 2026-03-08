import Link from "next/link";

export const metadata = {
  title: "コミュニティメンバー",
  description: "becoming labには、それぞれの人生を自分で選び、更新し続けようとしている人たちが集まっています。",
};

const members = [
  {
    slug: "tachikawa",
    name: "立川さん",
    role: "Story Teller / Challenger",
    path: "猟師として生きる道",
    description: "国立大卒・ベンチャー企業のエースから、秩父の猟師へ。24歳が選んだ、自分の志の物語。",
  },
  {
    slug: "yamashiro",
    name: "山岸穂高",
    role: "Story Teller / Challenger",
    path: "アスリートとして世界を目指す道",
    description: "プロトライアスリート。ロングディスタンス日本チャンピオンとして、挑戦し続ける姿をコミュニティに示す。",
  },
];

export default function MembersPage() {
  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">COMMUNITY MEMBERS</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Community Members</h1>
          <p className="text-gray-600 leading-relaxed">
            becoming labには、それぞれの人生を自分で選び、更新し続けようとしている人たちが集まっています。<br />
            ここでは、コミュニティメンバーの「人生の途中の物語」を紹介しています。
          </p>
        </div>
      </section>

      {/* メンバー一覧 */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <div className="space-y-8">
            {members.map((member) => (
              <Link key={member.slug} href={`/members/${member.slug}`} className="block group">
                <div className="border border-stone-200 p-8 hover:border-stone-400 transition-colors duration-300">
                  <p className="text-xs tracking-widest text-stone-400 mb-2">{member.role}</p>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1B6B7A] transition-colors">{member.name}</h2>
                  <p className="text-sm text-stone-500 mb-4">自分で選んだ道：{member.path}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  <p className="text-sm text-[#1B6B7A] mt-4">▶ 詳しく読む</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* フッターCTA */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <p className="text-gray-600 mb-6">あなたも、becoming labの一員として<br />自分の物語を歩みませんか。</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B6B7A] text-white hover:bg-[#155a67] transition-colors duration-300 text-sm">
            <span>▶</span> まず話してみる
          </Link>
        </div>
      </section>
    </>
  );
}
