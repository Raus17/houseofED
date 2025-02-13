import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Allow Google profile images
    unoptimized: true, // ✅ Disable Next.js image optimization
  },
  output: "standalone", // ✅ Prevent additional build optimizations
  experimental: {
    optimizeCss: false, // ✅ Disable CSS optimization
    serverActions: false, // ✅ Disable server actions optimization
  },
  swcMinify: false, // ✅ Disable SWC minification
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint during production build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skips TypeScript errors during build
  },

};

export default nextConfig;
