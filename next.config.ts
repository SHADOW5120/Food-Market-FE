import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "7225",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;