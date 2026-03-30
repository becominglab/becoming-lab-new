import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SearchTabs from "@/components/sns/SearchTabs";

export default async function SnsSearchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sns/search");

  return (
    <div className="pt-4">
      <SearchTabs />
    </div>
  );
}
