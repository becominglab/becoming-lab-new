import type { Metadata } from "next";

/** ログイン画面は検索・AIの参照対象にしない */
export const metadata: Metadata = {
  title: "ログイン",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
