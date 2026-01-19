import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Becoming Labへのお問い合わせ。体験セミナー、無料相談、企業研修などお気軽にご連絡ください。",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
