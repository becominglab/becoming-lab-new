import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
          return {
                  beforeFiles: [
                    {
                                source: "/session",
                                destination: "/session.html",
                    },
                    {
                                source: "/eng2",
                                destination: "https://eng2-ten.vercel.app/eng2",
                    },
                    {
                                source: "/eng2/:path*",
                                destination: "https://eng2-ten.vercel.app/eng2/:path*",
                    },
                          ],
                  afterFiles: [],
                  fallback: [],
          };
    },
};

export default nextConfig;
