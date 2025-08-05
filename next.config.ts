/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    formats: ['image/webp', 'image/avif'],
  },
  // 성능 최적화 설정
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // 외부 스크립트 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 번들 분석을 위한 설정
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      // 프로덕션 환경에서 번들 최적화
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          kakao: {
            test: /[\\/]node_modules[\\/](kakao|dapi)[\\/]/,
            name: 'kakao',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig