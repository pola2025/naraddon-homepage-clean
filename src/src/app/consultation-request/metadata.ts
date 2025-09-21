import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 상담신청 | 나라똔 - 정책자금 전문 컨설팅',
  description:
    '나라똔 인증 기업심사관과 1:1 무료 상담. 정책자금 비교분석, 최대 450만원 절약 방법 안내. 100% 책임보증제도로 안심하고 상담받으세요.',
  keywords: '정책자금 상담, 무료상담, 기업심사관, 정부지원금 신청, 중소기업 컨설팅, 나라똔 상담',
  openGraph: {
    title: '무료 상담신청 - 나라똔 정책자금 컨설팅',
    description: '정부정책자금으로 연간 450만원 절약! 나라똔 인증 전문가와 무료 상담하세요.',
    url: 'https://naraddon.com/consultation-request',
    type: 'website',
    images: [
      {
        url: '/images/consultation-og.jpg',
        width: 1200,
        height: 630,
        alt: '나라똔 무료 상담신청',
      },
    ],
  },
  alternates: {
    canonical: '/consultation-request',
  },
};
