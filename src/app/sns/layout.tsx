import type { Metadata } from "next";
import SnsNav from "@/components/sns/SnsNav";

export const metadata: Metadata = {
  title: "Becoming SNS — 更新をつなぐ",
  description: "変わろうとしている仲間とつながる、更新のためのSNS",
};

export default function SnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-md min-h-screen pb-20">
        {children}
      </div>
      <SnsNav />
    </div>
  );
}
