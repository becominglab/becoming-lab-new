"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/concept", label: "Concept" },
    { href: "/kataribe", label: "語り部の会" },
    { href: "/community", label: "Community" },
    { href: "/service", label: "Service" },
    { href: "/contact", label: "Contact" },
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
          </ul>
        </div>
      )}
    </header>
  );
}
