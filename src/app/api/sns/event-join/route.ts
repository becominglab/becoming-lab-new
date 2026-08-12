import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/sns/event-join
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json();
  const {
    vol,
    nickname,
    declaration,
    tags,
  }: { vol: number; nickname: string; declaration?: string; tags?: string[] } = body;

  if (!nickname?.trim()) {
    return NextResponse.json({ error: "nickname is required" }, { status: 400 });
  }

  // 1. プロフィール作成/更新
  const profileData: Record<string, unknown> = {
    user_id: user.id,
    nickname: nickname.trim(),
    challenge_tags: tags ?? [],
    is_public: true,
    update_phase: "starting",
  };
  if (declaration?.trim()) {
    profileData.bio = declaration.trim().slice(0, 50);
  }

  const { error: profileError } = await supabase
    .from("public_profiles")
    .upsert(profileData, { onConflict: "user_id" });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // 2. 宣言作成
  if (declaration?.trim()) {
    const { data: newDeclaration } = await supabase
      .from("declarations")
      .insert({
        user_id: user.id,
        content: declaration.trim(),
        pinned: false,
      })
      .select()
      .single();

    // SNS宣言ポスト作成
    if (newDeclaration) {
      await supabase.from("posts").insert({
        user_id: user.id,
        post_type: "declaration",
        content: { content: declaration.trim() },
        source_id: newDeclaration.id,
      }).catch(() => {});
    }
  }

  // 3. サークル取得/作成
  const circleName = `自分で選んだ道 vol.${vol}`;

  let circleId: string;

  const { data: existingCircle } = await supabase
    .from("circles")
    .select("id")
    .eq("name", circleName)
    .maybeSingle();

  if (existingCircle) {
    circleId = existingCircle.id;
  } else {
    const { data: newCircle, error: circleError } = await supabase
      .from("circles")
      .insert({
        name: circleName,
        is_public: false,
        max_members: 10,
        theme_tag: "自分で選んだ道",
        event_tag: `jibun-de-eranda-michi-vol${vol}`,
        created_by: user.id,
      })
      .select()
      .single();

    if (circleError || !newCircle) {
      return NextResponse.json({ error: circleError?.message ?? "circle creation failed" }, { status: 500 });
    }
    circleId = newCircle.id;
  }

  // circle_members に参加（既存なら無視）
  await supabase
    .from("circle_members")
    .upsert(
      { circle_id: circleId, user_id: user.id, role: "member" },
      { onConflict: "circle_id,user_id", ignoreDuplicates: true }
    );

  // 4. バッジチェック（非同期）
  import("@/lib/sns/badges").then(({ checkAndAwardBadges }) => {
    checkAndAwardBadges(supabase, user.id, ["challenge", "social"]).catch(() => {});
  }).catch(() => {});

  // 5. ウェルカムプッシュ通知（非同期）
  import("@/lib/push").then(({ sendPushToUser }) => {
    sendPushToUser(user.id, {
      title: "🎉 仲間と繋がりました！",
      body: `自分で選んだ道 vol.${vol}のサークルに参加しました。SNSで仲間の更新を見てみましょう`,
      url: "/sns",
    }).catch(() => {});
  }).catch(() => {});

  return NextResponse.json({ ok: true, circle_id: circleId });
}
