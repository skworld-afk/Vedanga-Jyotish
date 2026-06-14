/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['koffi'],
  },
  outputFileTracingIncludes: {
    '/**': ['./bin/**/*'],
  },
};

export default nextConfig;