import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostDetailClient from "./PostDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("content, public_profiles!inner(nickname)")
    .eq("id", id)
    .single();

  if (!post) return { title: "投稿 — Becoming SNS" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = post.content as any;
  const nickname = (post.public_profiles as { nickname: string }).nickname;
  const did = content?.did || content?.content || "";

  return {
    title: `${nickname}の更新 — Becoming SNS`,
    description: did ? did.slice(0, 100) : `${nickname}の更新投稿`,
    openGraph: {
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "becoming lab" }],
      title: `${nickname}の更新 — Becoming SNS`,
      description: did ? did.slice(0, 100) : `${nickname}の更新投稿`,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin?next=/sns/posts/" + id);

  return <PostDetailClient postId={id} currentUserId={user.id} />;
}
