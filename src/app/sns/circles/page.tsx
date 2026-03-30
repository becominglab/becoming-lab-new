import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CirclesView from "@/components/sns/CirclesView";

export default async function SnsCirclesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sns/circles");

  return (
    <div className="pt-4">
      <CirclesView />
    </div>
  );
}
