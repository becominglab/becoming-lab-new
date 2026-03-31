import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import SearchTabs from "@/components/sns/SearchTabs";
import { Loader2 } from "lucide-react";

export default async function SnsSearchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/sns/search");

  return (
    <div className="pt-4">
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-stone-400" /></div>}>
        <SearchTabs />
      </Suspense>
    </div>
  );
}
