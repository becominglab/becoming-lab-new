import { permanentRedirect } from "next/navigation";

/** 旧 Philosophy ページ。内容は /concept に統合しました */
export default function PhilosophyPage() {
  permanentRedirect("/concept");
}
