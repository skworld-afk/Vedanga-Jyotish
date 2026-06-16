/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // 1. Turbopack reads this and safely isolates Koffi from the build pipeline
  serverExternalPackages: ['koffi'],

  // 2. Continues to bundle and trace your local C .so files for production
  outputFileTracingIncludes: {
    '/api/binding': ['./bin/*.so'], 
  },
};

export default nextConfig;
