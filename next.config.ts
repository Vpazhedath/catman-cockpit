import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/catman-cockpit',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;