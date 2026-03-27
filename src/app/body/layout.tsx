import type { Metadata } from "next";
import BodyNav from "@/components/body/BodyNav";

export const metadata: Metadata = {
  title: "Becoming Body",
  description: "痩せるんじゃない、更新する。10秒で記録する習慣化アプリ",
};

export default function BodyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-md min-h-screen pb-20">
        {children}
      </div>
      <BodyNav />
    </div>
  );
}
