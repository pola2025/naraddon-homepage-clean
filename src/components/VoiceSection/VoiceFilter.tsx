'use client';

import { useState, useEffect } from 'react';
import { Category } from './types';

interface VoiceFilterProps {
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

const categories: Category[] = [
  { id: 'all', label: '전체', count: 847 },
  { id: 'restaurant', label: '음식점', count: 234 },
  { id: 'cafe', label: '카페', count: 189 },
  { id: 'retail', label: '소매업', count: 156 },
  { id: 'service', label: '서비스업', count: 142 },
  { id: 'education', label: '교육', count: 89 },
  { id: 'beauty', label: '뷰티', count: 37 },
];

const VoiceFilter = ({ onCategoryChange, onSortChange }: VoiceFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isSticky ? 'sticky top-0 z-20 bg-white/95 backdrop-blur-md shadow-md' : 'relative bg-white'
      } border-b`}
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-start md:items-center">
          {/* 카테고리 필터 */}
          <div className="w-full md:w-auto overflow-x-auto">
            <div className="flex gap-2 pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full whitespace-nowrap transition-all text-sm md:text-base ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                  <span className="ml-1 md:ml-2 text-xs opacity-80">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 및 추가 필터 */}
          <div className="flex gap-2 md:gap-3 items-center">
            {/* 검색 입력 */}
            <div className="relative">
              <input
                type="text"
                placeholder="검색..."
                className="pl-8 pr-3 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 md:w-40"
              />
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* 정렬 옵션 */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="recent">최신순</option>
              <option value="rating">평점순</option>
              <option value="helpful">도움순</option>
              <option value="popular">인기순</option>
            </select>

            {/* 필터 버튼 (모바일) */}
            <button className="md:hidden p-2 border rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 활성 필터 태그 (선택사항) */}
        {selectedCategory !== 'all' && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">선택된 필터:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {categories.find((c) => c.id === selectedCategory)?.label}
              <button
                onClick={() => handleCategoryChange('all')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceFilter;
