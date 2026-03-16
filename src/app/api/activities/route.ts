import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 統合アクティビティ一覧（手動 + Strava）
 * GET /api/activities?page=1&per_page=20&type=Run&from=2026-01-01&to=2026-03-16
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = Math.min(
    parseInt(searchParams.get("per_page") ?? "20", 10),
    50
  );
  const typeFilter = searchParams.get("type");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const sourceFilter = searchParams.get("source");

  const offset = (page - 1) * perPage;

  // クエリ構築
  let query = supabase
    .from("activity_logs")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (typeFilter) {
    query = query.eq("activity_type", typeFilter);
  }
  if (fromDate) {
    query = query.gte("date", fromDate);
  }
  if (toDate) {
    query = query.lte("date", toDate);
  }
  if (sourceFilter) {
    query = query.eq("source", sourceFilter);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    activities: data ?? [],
    total: count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((count ?? 0) / perPage),
  });
}
