import { permanentRedirect } from "next/navigation";

/** 旧スラッグ。/members/yamagishi へ恒久リダイレクトします。 */
export default function LegacyYamashiroPage() {
  permanentRedirect("/members/yamagishi");
}
