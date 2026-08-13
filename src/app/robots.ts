import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 会員向け・管理用の領域は検索結果に出さない
        disallow: [
          "/api/",
          "/mypage",
          "/mypage/",
          "/login",
          "/sns",
          "/sns/",
          "/profile",
          "/auth/",
          "/s/",
          "/sales-navigator",
          "/mm",
          "/mm/",
          "/body",
          "/body/",
        ],
      },
    ],
    sitemap: "https://becominglab.life/sitemap.xml",
    host: "https://becominglab.life",
  };
}
