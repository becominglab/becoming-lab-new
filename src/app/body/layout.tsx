import type { Metadata, Viewport } from "next";
import BodyNav from "@/components/body/BodyNav";

export const metadata: Metadata = {
  title: "Becoming Body",
  description: "痩せるんじゃない、更新する。10秒で記録する習慣化アプリ",
  manifest: "/body-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Becoming Body",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1917",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
