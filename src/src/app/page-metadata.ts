import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나라똔(NARADDON) | 대한민국 1위 정책자금 플랫폼',
  description:
    '중소기업 90%가 모르는 정부정책자금! 나라똔 인증 기업심사관과 함께 연간 450만원 절약하세요. 100% 책임보증, 무료상담 가능',
  keywords:
    '나라똔, NARADDON, 정책자금, 정부지원금, 중소기업지원, R&D자금, 수출바우처, 창업지원금, 기업심사관',
  openGraph: {
    title: '나라똔 - 정책자금 성공의 시작',
    description: '인증 기업심사관과 함께하는 맞춤형 정책자금 컨설팅. 지금 무료 상담 받으세요!',
    url: 'https://naraddon.com',
    type: 'website',
    images: [
      {
        url: '/images/main-og.jpg',
        width: 1200,
        height: 630,
        alt: '나라똔 - 정책자금 전문 플랫폼',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
};
