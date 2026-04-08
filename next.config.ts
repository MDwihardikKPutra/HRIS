import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment optimizations
  output: undefined, // default for Vercel
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
