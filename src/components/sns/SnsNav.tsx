"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Newspaper, Search, Users, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/sns", label: "フィード", icon: Newspaper },
  { href: "/sns/search", label: "さがす", icon: Search },
  { href: "/sns/circles", label: "サークル", icon: Users },
  { href: "/sns/profile", label: "プロフィール", icon: User },
];

export default function SnsNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
      <div className="mx-auto max-w-md flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                active
                  ? "text-gray-900"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
