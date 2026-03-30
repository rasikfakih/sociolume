/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@sociolume/ui',
    '@sociolume/auth',
    '@sociolume/db',
    '@sociolume/cms',
    '@sociolume/types',
    '@sociolume/utils',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
