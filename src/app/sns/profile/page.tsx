import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileSetupForm from "@/components/sns/ProfileSetupForm";
import ProfileView from "@/components/sns/ProfileView";
import MentorSectionWrapper from "@/components/sns/MentorSectionWrapper";

export default async function SnsProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sns/profile");

  const { data: profile } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="px-4 pt-6">
      {profile ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-stone-900">マイプロフィール</h1>
          </div>
          <ProfileView userId={user.id} currentUserId={user.id} />
          <div className="mt-6">
            <MentorSectionWrapper isMentor={profile.is_mentor ?? false} />
          </div>
          <div className="mt-6 mb-4">
            <h2 className="text-sm font-medium text-stone-700 mb-3">プロフィール編集</h2>
            <ProfileSetupForm initialProfile={profile} />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-lg font-bold text-stone-900 mb-2">プロフィール設定</h1>
          <p className="text-sm text-stone-500 mb-6">
            SNSを始めるためにプロフィールを作成しましょう
          </p>
          <ProfileSetupForm />
        </>
      )}
    </div>
  );
}
