import type { Metadata } from "next";
import "./sales-navigator.css";

export const metadata: Metadata = {
  title: "Sales Navigator | LivingHouse",
  description: "空間時間デザイナーの接客をリアルタイム支援",
};

export default function SalesNavigatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sales-navigator-root" id="sales-navigator-root">
      {children}
    </div>
  );
}
