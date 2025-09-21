import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '사업자 목소리 | 나라똔',
  description: '나라똔과 함께 성장한 사업자님들의 생생한 후기와 성공 스토리를 확인해보세요.',
  keywords: '나라똔, 사업자 후기, 고객 리뷰, 성공 사례, 사용 후기',
  openGraph: {
    title: '사업자 목소리 | 나라똔',
    description: '나라똔과 함께 성장한 사업자님들의 생생한 후기와 성공 스토리',
    type: 'website',
  },
};

export default function VoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
