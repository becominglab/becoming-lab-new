import { createClient } from "@/lib/supabase/server";
import BecomingOS from "@/components/becoming-os/BecomingOS";

export const metadata = {
  title: "becoming OS | becoming lab",
  description: "人生の編集画面 - becoming lab",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user display name if available
  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || null;

  return <BecomingOS userName={userName} />;
}
