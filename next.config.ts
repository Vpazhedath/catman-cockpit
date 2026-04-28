import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes for BigQuery
  basePath: '/catman-cockpit',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;