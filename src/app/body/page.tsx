import { createClient } from "@/lib/supabase/server";
import BodyHome from "@/components/body/BodyHome";

export default async function BodyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    null;

  return <BodyHome userName={userName} />;
}
