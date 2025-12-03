import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  // Next.js 15.5+ 업데이트된 설정
  serverExternalPackages: ["@clerk/nextjs", "@clerk/backend"],
};

export default nextConfig;
