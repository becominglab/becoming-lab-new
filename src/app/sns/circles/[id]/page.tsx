import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CircleDetailView from "@/components/sns/CircleDetailView";

export default async function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/sns/circles/${id}`);

  return <CircleDetailView circleId={id} currentUserId={user.id} />;
}
