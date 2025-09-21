/** @type {import('next').NextConfig} */
const nextConfig = {
  // 출력 타입 설정
  output: 'standalone',

  // ESLint 빌드 시 무시
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript 검사 무시
  typescript: {
    ignoreBuildErrors: true,
  },

  // public 폴더의 영상 파일에 대한 캐시 설정
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
