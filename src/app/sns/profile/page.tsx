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
          <div id="profile-edit" className="mt-6 mb-4">
            <h2 className="text-sm font-medium text-stone-700 mb-3">プロフィール編集</h2>
            <ProfileSetupForm initialProfile={profile} />
          </div>
        </>
      ) : (
        <>
          {/* オンボーディングヘッダー */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🌱</div>
            <h1 className="text-xl font-bold text-stone-900 mb-1.5">ようこそ、becoming へ！</h1>
            <p className="text-sm text-stone-500 leading-relaxed">
              挑戦タグを設定すると、同じ目標を持つ仲間が<br />
              自動でマッチングされます
            </p>
          </div>

          {/* 仕組みのヒント */}
          <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl px-3 py-3 mb-6">
            <span className="text-lg shrink-0">✨</span>
            <p className="text-xs text-teal-700 leading-relaxed">
              <span className="font-semibold">挑戦タグ・更新フェーズ・求めていること</span>を入力するほど、
              ぴったりな仲間と出会えます
            </p>
          </div>

          <ProfileSetupForm />
        </>
      )}
    </div>
  );
}
