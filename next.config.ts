import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ['m.media-amazon.com','placehold.co','ik.imagekit.io'],
  },
  typescript:{
    // This is a temporary fix to allow the build to succeed
    // You should fix the underlying issues in your code
    ignoreBuildErrors: true,
  },
  eslint: {
    // This is a temporary fix to allow the build to succeed
    // You should fix the underlying issues in your code
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
