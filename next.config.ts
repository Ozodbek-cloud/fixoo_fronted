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
        hostname: 'fixoo-backend.onrender.com',
        pathname: '/uploads/**', // <-- to‘g‘ri yo‘l
      },
      {
        protocol: 'https',
        hostname: 'ik-1.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pravatar.cc',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
