import type { MetadataRoute } from "next";
import { events } from "@/content/events";

const BASE = "https://becominglab.life";

/** 更新頻度が高い順に並べる。優先度は相対値 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/michi", priority: 0.9, freq: "weekly" },
    { path: "/michi/au", priority: 0.8, freq: "monthly" },
    { path: "/michi/kakomu", priority: 0.8, freq: "monthly" },
    { path: "/jibun-de-eranda-michi", priority: 0.9, freq: "monthly" },
    { path: "/jibun-de-eranda-michi/archive", priority: 0.8, freq: "monthly" },
    { path: "/concept", priority: 0.8, freq: "monthly" },
    { path: "/community", priority: 0.8, freq: "monthly" },
    { path: "/members", priority: 0.8, freq: "monthly" },
    { path: "/blog", priority: 0.7, freq: "weekly" },
    { path: "/service", priority: 0.7, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "yearly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
  ];

  const volPages = events
    .filter((e) => e.href)
    .map((e) => ({
      url: `${BASE}${e.href}`,
      lastModified: e.date ? new Date(e.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const profilePages = events
    .filter((e) => e.profile)
    .map((e) => ({
      url: `${BASE}${e.profile}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    ...statics.map((s) => ({
      url: `${BASE}${s.path}`,
      lastModified: now,
      changeFrequency: s.freq,
      priority: s.priority,
    })),
    ...volPages,
    ...profilePages,
  ];
}
