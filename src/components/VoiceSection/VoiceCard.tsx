'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceData } from './types';

interface VoiceCardProps extends VoiceData {
  onHelpful?: (id: string) => void;
}

const VoiceCard = ({
  id,
  author,
  company,
  rating,
  content,
  tags,
  verified,
  date,
  helpful,
  images,
  category,
  onHelpful,
}: VoiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      onHelpful?.(id);
    }
  };

  // 카테고리별 색상 매핑
  const categoryColors: { [key: string]: string } = {
    restaurant: 'from-orange-500 to-red-500',
    cafe: 'from-brown-500 to-amber-600',
    retail: 'from-green-500 to-teal-500',
    service: 'from-blue-500 to-indigo-500',
    education: 'from-purple-500 to-pink-500',
    beauty: 'from-pink-500 to-rose-500',
  };

  const categoryColor = categoryColors[category] || 'from-gray-500 to-gray-600';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-5 md:p-7 border border-gray-100 overflow-hidden group"
    >
      {/* 호버 시 배경 그라데이션 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* 카테고리 리본 */}
      <div
        className={`absolute top-0 right-0 bg-gradient-to-r ${categoryColor} text-white text-xs px-4 py-1 rounded-bl-2xl font-semibold shadow-md`}
      >
        {category === 'restaurant' && '음식점'}
        {category === 'cafe' && '카페'}
        {category === 'retail' && '소매업'}
        {category === 'service' && '서비스'}
        {category === 'education' && '교육'}
        {category === 'beauty' && '뷰티'}
      </div>

      {/* 헤더 영역 */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${categoryColor} flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg`}
          >
            {author.charAt(0)}
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base md:text-lg">
              {author}
              {verified && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full"
                  title="인증된 사업자"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.span>
              )}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{company}</p>
          </div>
        </div>

        {/* 평점 표시 */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'} fill-current`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-semibold">{rating}.0 / 5.0</span>
        </div>
      </div>

      {/* 이미지 갤러리 (있을 경우) */}
      {images && images.length > 0 && (
        <div className="mb-5">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt=""
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-52 md:h-72 object-cover"
              />
            </AnimatePresence>

            {/* 이미지 오버레이 정보 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* 썸네일 */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? 'border-blue-500 scale-110 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className="mb-5">
        <AnimatePresence>
          <motion.div layout className="relative">
            <p className={`text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {isExpanded ? (
                <>
                  <span className="text-4xl text-gray-300 mr-1">"</span>
                  {content}
                  <span className="text-4xl text-gray-300 ml-1">"</span>
                </>
              ) : (
                content
              )}
            </p>
          </motion.div>
        </AnimatePresence>

        {content.length > 150 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                접기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                더 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* 태그 영역 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 text-xs font-medium rounded-full transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
          >
            #{tag}
          </motion.span>
        ))}
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">{date}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHelpful}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
            isHelpful
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
          }`}
        >
          <motion.svg
            animate={{ scale: isHelpful ? [1, 1.3, 1] : 1 }}
            className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </motion.svg>
          <span className="font-semibold">
            도움이 돼요 {helpful > 0 && `(${helpful + (isHelpful ? 1 : 0)})`}
          </span>
        </motion.button>
      </div>
    </motion.article>
  );
};

export default VoiceCard;
