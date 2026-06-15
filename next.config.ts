import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable React Strict Mode to prevent double animation triggers in development
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "7225",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;