import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookmarksList from "@/components/sns/BookmarksList";

export const metadata = { title: "ブックマーク — Becoming SNS" };

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/sns/bookmarks");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-stone-100 z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link href="/sns" className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-stone-600" />
          </Link>
          <h1 className="font-bold text-stone-900">ブックマーク</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <BookmarksList currentUserId={user.id} />
      </div>
    </div>
  );
}
