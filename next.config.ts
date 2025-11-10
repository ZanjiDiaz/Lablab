import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages && !isDevelopment ? '/Lablab' : '',
  assetPrefix: isGithubPages && !isDevelopment ? '/Lablab/' : '',
};

export default nextConfig;
