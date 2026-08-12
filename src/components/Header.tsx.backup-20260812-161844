"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();

      // 初回ロード時にセッション取得
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user ? { email: user.email ?? undefined } : null);
      }).catch(() => {
        setUser(null);
      });

      // 認証状態の変更を監視
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? { email: session.user.email ?? undefined } : null);
      });

      return () => subscription.unsubscribe();
    } catch {
      // Supabase client initialization failed
      setUser(null);
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { href: "/mypage", label: "マイページ" },
    { href: "/concept", label: "Concept" },
    { href: "/jibun-de-eranda-michi", label: "自分で選んだ道" },
    { href: "/community", label: "Community" },
    { href: "/service", label: "Service" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="becoming lab"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-gray-500 hover:text-[#1B6B7A] transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li suppressHydrationWarning>
            {user ? (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-stone-600 rounded hover:bg-stone-50 transition-colors text-xs disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                {loggingOut ? "..." : "ログアウト"}
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-[#1B6B7A] text-white rounded hover:bg-[#155a67] transition-colors text-xs"
              >
                ログイン
              </Link>
            )}
          </li>
        </ul>

        <button
          className="md:hidden text-gray-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <ul className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-gray-600 hover:text-[#1B6B7A] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li suppressHydrationWarning>
              {user ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-stone-600 rounded hover:bg-stone-50 transition-colors text-sm disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loggingOut ? "..." : "ログアウト"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-[#1B6B7A] text-white rounded hover:bg-[#155a67] transition-colors text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  ログイン
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
