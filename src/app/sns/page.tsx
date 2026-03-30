import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import FeedTabs from "@/components/sns/FeedTabs";
import { Loader2 } from "lucide-react";

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
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-stone-400" />
        </div>
      }>
        <FeedTabs currentUserId={user.id} />
      </Suspense>
    </div>
  );
}
