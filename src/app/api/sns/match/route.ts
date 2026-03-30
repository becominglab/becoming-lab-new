import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sns/match — あなたにおすすめのユーザーを返す (スコアリングベース)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // 自分のプロフィール取得
  const { data: myProfile } = await supabase
    .from("public_profiles")
    .select("challenge_tags, update_phase, seeking")
    .eq("user_id", user.id)
    .maybeSingle();

  // 公開プロフィールを最大100件取得（自分・既フォロー除外）
  const { data: myFollows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const followingIds = new Set<string>((myFollows || []).map((f: any) => f.following_id));

  const { data: candidates } = await supabase
    .from("public_profiles")
    .select("user_id, nickname, avatar_url, bio, challenge_tags, update_phase, seeking")
    .eq("is_public", true)
    .neq("user_id", user.id)
    .limit(100);

  if (!candidates?.length) return NextResponse.json({ matches: [] });

  // スコアリング
  const myTags: string[] = myProfile?.challenge_tags || [];
  const mySeeking: string = myProfile?.seeking || "";
  const myPhase: string = myProfile?.update_phase || "";

  // seekingの相性テーブル
  const seekingCompat: Record<string, string[]> = {
    accountability: ["accountability", "companionship"],
    inspiration: ["inspiration", "advice"],
    advice: ["inspiration", "advice"],
    companionship: ["accountability", "companionship"],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scored = (candidates as any[])
    .filter((c) => !followingIds.has(c.user_id))
    .map((c) => {
      let score = 0;
      const reasons: string[] = [];

      // タグ重複スコア (最大50点)
      const theirTags: string[] = c.challenge_tags || [];
      const overlap = myTags.filter((t) => theirTags.includes(t));
      if (overlap.length > 0) {
        score += Math.min(overlap.length * 15, 50);
        reasons.push(`「${overlap[0]}」に取り組んでいる`);
      }

      // seeking相性スコア (20点)
      if (mySeeking && c.seeking) {
        const compatList = seekingCompat[mySeeking] || [];
        if (compatList.includes(c.seeking)) {
          score += 20;
          const seekingLabel: Record<string, string> = {
            accountability: "継続仲間",
            inspiration: "刺激を求めている",
            advice: "アドバイスを求めている",
            companionship: "共に歩む仲間",
          };
          if (!reasons.length) reasons.push(seekingLabel[c.seeking] || "");
        }
      }

      // フェーズスコア (10点) — 同フェーズは共感しやすい
      if (myPhase && c.update_phase === myPhase) {
        score += 10;
      }

      // フォローされていない場合は少し加点 (新鮮さ)
      score += Math.floor(Math.random() * 5); // 同スコアの多様性

      return {
        ...c,
        match_score: score,
        match_reason: reasons[0] || "同じ挑戦者",
        is_following: false,
      };
    })
    .filter((c) => c.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 20);

  return NextResponse.json({ matches: scored });
}
