import { redirect } from "next/navigation";

/**
 * /profile は /mypage に統合されました。
 * 旧URLからのアクセスをリダイレクトします。
 */
export default function ProfileRedirect() {
  redirect("/mypage");
}
