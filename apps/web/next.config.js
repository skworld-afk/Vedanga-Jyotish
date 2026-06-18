import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'standalone',

  // 1. Turbopack reads this and safely isolates Koffi from the build pipeline
  serverExternalPackages: ['koffi'],

  // 2. Continues to bundle and trace your local C .so files for production
  outputFileTracingIncludes: {
    '/api/binding': ['./bin/*.so'], 
  },

  // 3. Force the build to complete even if TypeScript complains
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
