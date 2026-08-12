import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MigrateWizard from "@/components/sns/EventMigrateWizard";

interface PageProps {
  searchParams: Promise<{ vol?: string }>;
}

export default async function MigratePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/jibun-de-eranda-michi/migrate");
  }

  const params = await searchParams;
  const vol = params.vol ?? "2";

  return <MigrateWizard vol={vol} />;
}
