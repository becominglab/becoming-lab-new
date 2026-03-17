import { createClient } from "@/lib/supabase/server";
import MyPageDashboard from "@/components/mypage/MyPageDashboard";

export const metadata = {
  title: "マイページ | becoming lab",
  description: "あなたの挑戦ダッシュボード - becoming lab",
};

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    null;

  return <MyPageDashboard userName={userName} />;
}
