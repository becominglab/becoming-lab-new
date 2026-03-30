"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

function IconFeed({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <rect x="3" y="4" width="18" height="3" rx="1.5" fill="currentColor" />
          <rect x="3" y="10.5" width="18" height="3" rx="1.5" fill="currentColor" />
          <rect x="3" y="17" width="12" height="3" rx="1.5" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="3" y="10.5" width="18" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="3" y="17" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

function IconSearch({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
      />
      <line
        x1="15.5"
        y1="15.5"
        x2="20.5"
        y2="20.5"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCircles({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <circle cx="9" cy="10" r="5" fill="currentColor" />
          <circle cx="16" cy="10" r="5" fill="currentColor" fillOpacity="0.6" />
          <path d="M9 17c-3.5 0-6.5 1.5-7 4h14c-.5-2.5-3.5-4-7-4z" fill="currentColor" />
        </>
      ) : (
        <>
          <circle cx="9" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 17c-3.5 0-6.5 1.5-7 4h14c-.5-2.5-3.5-4-7-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

function IconProfile({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" fillOpacity="0.8" />
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/sns", label: "フィード", Icon: IconFeed },
  { href: "/sns/search", label: "さがす", Icon: IconSearch },
  { href: "/sns/circles", label: "サークル", Icon: IconCircles },
  { href: "/sns/profile", label: "プロフィール", Icon: IconProfile },
];

export default function SnsNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
      <div className="mx-auto max-w-md flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active =
            pathname === href || (href !== "/sns" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                active ? "text-teal-600" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon active={active} />
              <span className={`text-[10px] tracking-wide ${active ? "font-medium" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
