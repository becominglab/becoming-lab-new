import { permanentRedirect } from "next/navigation";

/** 旧 About ページ。内容は /concept に統合しました */
export default function AboutPage() {
  permanentRedirect("/concept");
}
