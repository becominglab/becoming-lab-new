import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndAwardBadges } from "@/lib/sns/badges";

const VALID_TYPES = ["nice_update", "together", "helpful", "keep_going"];

// POST /api/sns/reactions — リアクション追加
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { post_id, reaction_type } = await request.json();

  if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });
  if (!VALID_TYPES.includes(reaction_type)) {
    return NextResponse.json({ error: "invalid reaction_type" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reactions")
    .insert({ post_id, user_id: user.id, reaction_type })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "既にリアクション済みです" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  checkAndAwardBadges(supabase, user.id, ["social"]).catch(() => {});

  // 投稿オーナーを取得してプッシュ通知
  supabase.from("posts").select("user_id").eq("id", post_id).single()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then(async ({ data: postData }: { data: any }) => {
      if (postData && postData.user_id !== user.id) {
        const { sendPushToUser } = await import("@/lib/push");
        const label = reaction_type === "nice_update" ? "いいね！" : reaction_type === "together" ? "一緒に！" : reaction_type === "helpful" ? "参考になった" : "頑張れ！";
        await sendPushToUser(postData.user_id, {
          title: "👍 応援が届きました",
          body: `「${label}」のリアクションをもらいました！`,
          url: `/sns`,
        });
      }
    }).catch(() => {});

  return NextResponse.json({ reaction: data }, { status: 201 });
}

// DELETE /api/sns/reactions?post_id=xxx&type=xxx — リアクション解除
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const postId = request.nextUrl.searchParams.get("post_id");
  const type = request.nextUrl.searchParams.get("type");

  if (!postId || !type) {
    return NextResponse.json({ error: "post_id and type are required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("reactions")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .eq("reaction_type", type);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
