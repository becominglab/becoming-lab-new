import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FeedTabs from "@/components/sns/FeedTabs";

export default async function SnsFeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sns");

  // プロフィール未作成の場合はプロフィール設定へリダイレクト
  const { data: profile } = await supabase
    .from("public_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/sns/profile");

  return (
    <div className="pt-4">
      <FeedTabs currentUserId={user.id} />
    </div>
  );
}
