import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
          return {
                  beforeFiles: [
                    // diet.becominglab.life → /body ルートへリライト
                    {
                                source: "/:path*",
                                has: [{ type: "host", value: "diet.becominglab.life" }],
                                destination: "/body/:path*",
                    },
                    {
                                source: "/session",
                                destination: "/session.html",
                    },
                          ],
                  afterFiles: [],
                  fallback: [],
          };
    },
};

export default nextConfig;
