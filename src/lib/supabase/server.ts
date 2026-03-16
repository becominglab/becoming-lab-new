import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Supabase が設定済みかどうか */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function createClient() {
  if (!isSupabaseConfigured()) {
    // 未設定時はダミークライアントを返す
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), data: [], error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
      }),
    } as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options as Record<string, unknown>);
          }
        },
      },
    }
  );
}
