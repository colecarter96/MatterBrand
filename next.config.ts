/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  // Ensure we're using the app directory
  distDir: '.next',
  // Enable static optimization
  poweredByHeader: false,
  // Ensure proper routing
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
