import { permanentRedirect } from "next/navigation";

/** 旧 トライアスロン×ビジネス ページ。現在の活動一覧 /michi へ案内します */
export default function TriathlonPage() {
  permanentRedirect("/michi");
}
