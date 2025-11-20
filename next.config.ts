import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fixoo.uz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik-1.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
