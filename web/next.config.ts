import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
