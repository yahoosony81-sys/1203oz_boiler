import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  // Vercel Edge Runtime 호환성을 위한 설정
  experimental: {
    serverComponentsExternalPackages: ["@clerk/nextjs"],
  },
};

export default nextConfig;
