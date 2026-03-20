import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
          return {
                  beforeFiles: [
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
