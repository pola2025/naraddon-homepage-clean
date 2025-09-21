import type { Metadata } from 'next';
import './globals.css';
import '../App.css';
import '../styles/components.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: '나라똔(NARADDON) - 정부정책자금 전문 컨설팅 | 중소기업 지원금 플랫폼',
  description:
    '나라똔은 인증 기업심사관과 함께 정책자금, R&D지원금, 수출바우처 등 정부지원사업을 연결하는 대한민국 1위 플랫폼입니다. 연간 450만원 절약, 100% 책임보증제도',
  keywords:
    '정책자금, 정부지원금, 중소기업지원, R&D자금, 수출바우처, 창업지원금, 나라똔, NARADDON, 기업심사관, 정부보조금, 사업자대출',
  authors: [{ name: '나라똔' }],
  creator: '나라똔',
  publisher: '나라똔',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://naraddon.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '나라똔(NARADDON) - 정부정책자금 전문 컨설팅',
    description: '인증 기업심사관과 함께하는 정책자금 성공 파트너. 연간 450만원 절약!',
    url: 'https://naraddon.com',
    siteName: '나라똔',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '나라똔 - 정책자금 전문 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '나라똔(NARADDON) - 정부정책자금 전문 컨설팅',
    description: '인증 기업심사관과 함께하는 정책자금 성공 파트너',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'google-site-verification-code',
    naver: 'naver-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* SEO 최적화 메타 태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />

        {/* CSRF 토큰 메타 태그 (보안 강화) */}
        <meta name="csrf-token" content="" />

        {/* 추가 SEO 메타 태그 */}
        <meta name="theme-color" content="#4CAF50" />
        <meta name="msapplication-TileColor" content="#4CAF50" />
        <meta name="format-detection" content="telephone=no" />

        {/* 구조화된 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: '나라똔',
              alternateName: 'NARADDON',
              url: 'https://naraddon.com',
              logo: 'https://naraddon.com/logo.png',
              description: '정부정책자금 전문 컨설팅 플랫폼',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'KR',
                addressLocality: '서울특별시',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+82-1588-0000',
                contactType: 'customer service',
                availableLanguage: ['Korean'],
              },
              sameAs: [
                'https://www.youtube.com/@naraddon',
                'https://www.instagram.com/naraddon',
                'https://blog.naver.com/naraddon',
              ],
            }),
          }}
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="App">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
