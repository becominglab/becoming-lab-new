"use client";

import Link from "next/link";

interface CommunityMember {
  id: string;
  name: string;
  role: "Challenger" | "Curator";
  path: string;
  latestUpdate: string;
  date: string;
  slug: string | null;
}

const MOCK_MEMBERS: CommunityMember[] = [
  {
    id: "m1",
    name: "立川さん",
    role: "Challenger",
    path: "猟師として生きる道",
    latestUpdate:
      "秩父の山で今朝もシカの足跡を追った。猟師になって1年、まだ迷うこともあるけれど、自分の手で生きることの意味を毎日噛み締めている。",
    date: "2026-03-14",
    slug: "tachikawa",
  },
  {
    id: "m2",
    name: "山岸穂高",
    role: "Challenger",
    path: "アスリートとして世界を目指す道",
    latestUpdate:
      "シーズン開幕まであと2ヶ月。今日のバイク練習で自己ベストを更新。長い冬のトレーニングが少しずつ実を結んでいる。",
    date: "2026-03-12",
    slug: "yamashiro",
  },
  {
    id: "m3",
    name: "大塚さん",
    role: "Curator",
    path: "becoming lab を育てる道",
    latestUpdate:
      "仲間がまた一人増えた。この場が「完成」じゃなくて「更新」を大切にするから、みんな自然体でいられるのかもしれない。",
    date: "2026-03-10",
    slug: null,
  },
];

export default function CommunitySection() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold, #B8A88A)" }}>
          COMMUNITY
        </p>
        <h2 className="text-xl md:text-2xl font-light" style={{ color: "var(--ink, #1A1A1A)" }}>
          仲間の挑戦
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          一人じゃない。同じ時代に、同じように挑んでいる人がいる。
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_MEMBERS.map((member) => {
          const d = new Date(member.date + "T00:00:00");
          return (
            <div
              key={member.id}
              className="p-5 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
                    <span className="text-sm text-stone-400">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {member.name}
                      </span>
                      <span className="text-[9px] tracking-wider text-stone-400 uppercase">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {member.path}
                    </p>
                  </div>
                </div>
                <time className="text-[10px] text-stone-300">
                  {d.toLocaleDateString("ja-JP", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-light line-clamp-2">
                {member.latestUpdate}
              </p>

              {member.slug && (
                <Link
                  href={`/members/${member.slug}`}
                  className="inline-block text-[10px] text-stone-400 hover:text-[#1B6B7A] transition-colors mt-3"
                >
                  この人の物語を読む →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Community Links */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        <Link
          href="/members"
          className="p-4 rounded-xl hover:bg-stone-100/80 transition-colors text-center group"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}
        >
          <p className="text-[10px] tracking-[0.2em] mb-1" style={{ color: "var(--gold, #B8A88A)" }}>
            PEOPLE
          </p>
          <p className="text-sm text-gray-700 group-hover:text-[#1B6B7A] transition-colors">
            挑戦者たち
          </p>
        </Link>
        <Link
          href="/community"
          className="p-4 rounded-xl hover:bg-stone-100/80 transition-colors text-center group"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}
        >
          <p className="text-[10px] tracking-[0.2em] mb-1" style={{ color: "var(--gold, #B8A88A)" }}>
            ABOUT
          </p>
          <p className="text-sm text-gray-700 group-hover:text-[#1B6B7A] transition-colors">
            この場について
          </p>
        </Link>
      </div>
    </section>
  );
}
