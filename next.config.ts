import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/Lablab' : '',
  assetPrefix: isGithubPages ? '/Lablab/' : '',
};

export default nextConfig;
