import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Static export for vibeyard deployment
  basePath: '/catman-cockpit',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;