'use client';

import { useState } from 'react';
import {
  VoiceHero,
  VoiceFilter,
  VoiceList,
  VoiceTestimonial,
  VoiceCTA,
} from '@/components/VoiceSection';

export default function VoicePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <VoiceHero />

      {/* 베스트 리뷰 섹션 */}
      <VoiceTestimonial />

      {/* 필터 섹션 */}
      <VoiceFilter onCategoryChange={setSelectedCategory} onSortChange={setSortBy} />

      {/* 리뷰 리스트 */}
      <VoiceList category={selectedCategory} sortBy={sortBy} />

      {/* CTA 섹션 */}
      <VoiceCTA />
    </main>
  );
}
