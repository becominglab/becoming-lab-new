import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/sns/ProfileView";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function SnsUserProfilePage({ params }: Props) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sns");

  // 自分のプロフィールの場合はリダイレクト
  if (userId === user.id) redirect("/sns/profile");

  return (
    <div className="px-4 pt-6">
      <ProfileView userId={userId} currentUserId={user.id} />
    </div>
  );
}
