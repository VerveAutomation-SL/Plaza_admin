import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["plazaone.s3.ap-southeast-1.amazonaws.com"], // ✅ Add your S3 domain here
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
