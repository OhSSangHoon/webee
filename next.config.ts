/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd96w70pr33mqi.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.webee.sbs',
        port: '',
        pathname: '/**',
      },
      // 개발용 (필요시)
      {
        protocol: 'https',
        hostname: 'cataas.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig