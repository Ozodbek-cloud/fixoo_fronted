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
        port: '', // agar standart 443 bo‘lsa bo‘sh qoldiring
        pathname: '/image/**', // barcha image pathlariga ruxsat
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
