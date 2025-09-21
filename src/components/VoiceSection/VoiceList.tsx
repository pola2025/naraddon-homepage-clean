'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VoiceCard from './VoiceCard';
import { VoiceData } from './types';

interface VoiceListProps {
  category: string;
  sortBy: string;
}

// 샘플 데이터
const sampleVoiceData: VoiceData[] = [
  {
    id: '1',
    author: '김철수',
    company: '철수네 치킨',
    rating: 5,
    content:
      '나라똔 플랫폼을 도입한 이후로 매출이 30% 이상 증가했습니다. 특히 주문 관리 시스템이 정말 편리하고, 고객 데이터 분석을 통해 마케팅 전략을 효과적으로 수립할 수 있었어요. 처음에는 새로운 시스템 도입이 부담스러웠지만, 지금은 없어서는 안 될 필수 도구가 되었습니다.',
    date: '2025.01.15',
    tags: ['주문관리', '매출증가', '데이터분석'],
    verified: true,
    helpful: 42,
    category: 'restaurant',
    images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
  },
  {
    id: '2',
    author: '이영희',
    company: '영희네 꽃집',
    rating: 4,
    content:
      '소상공인에게 정말 필요한 기능들이 잘 갖춰져 있어요. 특히 재고 관리와 고객 관리가 한 번에 되는 점이 좋습니다.',
    date: '2025.01.14',
    tags: ['재고관리', '고객관리'],
    verified: true,
    helpful: 28,
    category: 'retail',
  },
  {
    id: '3',
    author: '박민수',
    company: '민수 베이커리',
    rating: 5,
    content:
      '다른 POS 시스템들과 비교해봤는데 나라똔이 가장 직관적이고 사용하기 편했습니다. 직원들도 금방 적응했고, 고객 응대 시간이 단축되어 만족도가 높아졌어요.',
    date: '2025.01.13',
    tags: ['POS시스템', '사용편의성'],
    verified: false,
    helpful: 15,
    category: 'cafe',
  },
  {
    id: '4',
    author: '최지훈',
    company: '지훈이네 술집',
    rating: 5,
    content:
      '야간 영업을 하는 업장인데, 24시간 고객지원이 정말 든든합니다. 문제가 생겼을 때 바로 해결해주셔서 영업에 차질이 없었어요.',
    date: '2025.01.12',
    tags: ['고객지원', '24시간지원'],
    verified: true,
    helpful: 33,
    category: 'restaurant',
  },
  {
    id: '5',
    author: '강미경',
    company: '미경 헤어샵',
    rating: 4,
    content:
      '예약 관리 시스템이 정말 편리해요. 고객들도 온라인으로 쉽게 예약할 수 있어서 좋아하시고, 노쇼도 많이 줄었습니다.',
    date: '2025.01.11',
    tags: ['예약관리', '노쇼방지'],
    verified: true,
    helpful: 21,
    category: 'beauty',
  },
  {
    id: '6',
    author: '송태웅',
    company: '태웅 피트니스',
    rating: 5,
    content:
      '회원 관리부터 결제까지 한 번에 처리할 수 있어서 정말 편합니다. 특히 회원권 만료 알림 기능이 유용해요.',
    date: '2025.01.10',
    tags: ['회원관리', '결제시스템'],
    verified: false,
    helpful: 18,
    category: 'service',
  },
];

const VoiceList = ({ category, sortBy }: VoiceListProps) => {
  const [voices, setVoices] = useState<VoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // 카테고리 필터링
    let filtered =
      category === 'all' ? sampleVoiceData : sampleVoiceData.filter((v) => v.category === category);

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setVoices(sorted);
    setLoading(false);
    setPage(1);
  }, [category, sortBy]);

  const handleHelpful = (id: string) => {
    setVoices((prev) => prev.map((v) => (v.id === id ? { ...v, helpful: v.helpful + 1 } : v)));
  };

  const displayedVoices = voices.slice(0, page * itemsPerPage);
  const hasMore = displayedVoices.length < voices.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (voices.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">리뷰가 없습니다</h3>
          <p className="text-gray-600">선택하신 카테고리에 해당하는 리뷰가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 리뷰 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedVoices.map((voice, index) => (
          <motion.div
            key={voice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <VoiceCard {...voice} onHelpful={handleHelpful} />
          </motion.div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            더 많은 리뷰 보기
          </button>
        </div>
      )}

      {/* 페이지 정보 */}
      <div className="text-center mt-4 text-gray-600 text-sm">
        {displayedVoices.length} / {voices.length} 개의 리뷰
      </div>
    </div>
  );
};

export default VoiceList;
