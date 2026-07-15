import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error: eslint config exists but is missing from NextConfig types in this version
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@creit-tech/stellar-wallets-kit': '@creit.tech/stellar-wallets-kit',
    };
    return config;
  },
};

export default nextConfig;
