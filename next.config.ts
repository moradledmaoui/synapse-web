import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://116.203.235.44:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
