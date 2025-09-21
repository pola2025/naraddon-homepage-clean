'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from './types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    content:
      '나라똔 플랫폼을 통해 우리 카페의 매출이 40% 증가했습니다. 특히 타겟 마케팅 기능이 정말 효과적이었고, 고객 관리가 훨씬 체계적으로 변했어요. 이제는 나라똔 없이는 사업을 생각할 수 없을 정도입니다.',
    author: '김민수',
    company: '블루문 카페',
    position: '대표',
    image: 'https://picsum.photos/80/80?random=1',
  },
  {
    id: '2',
    content:
      '처음에는 반신반의했는데, 실제로 사용해보니 정말 놀라웠습니다. 특히 실시간 주문 관리와 고객 분석 기능이 뛰어나서 운영 효율이 크게 개선되었어요. 다른 사장님들께도 적극 추천하고 있습니다.',
    author: '이지은',
    company: '맛있는 김밥천국',
    position: '점주',
    image: 'https://picsum.photos/80/80?random=2',
  },
  {
    id: '3',
    content:
      '5년째 음식점을 운영하고 있는데, 나라똔을 만나고 나서 비로소 데이터 기반 경영이 무엇인지 알게 되었습니다. 매출 예측과 재고 관리가 자동화되어 시간도 절약되고 손실도 줄었어요.',
    author: '박성호',
    company: '서울 곱창',
    position: '사장님',
    image: 'https://picsum.photos/80/80?random=3',
  },
  {
    id: '4',
    content:
      '나라똔의 가장 큰 장점은 사용이 정말 쉽다는 거예요. 나이가 있어서 디지털 기기가 어려운데도 금방 적응했습니다. 고객센터 직원분들도 정말 친절하게 도와주셔서 감사해요.',
    author: '최영희',
    company: '엄마손 반찬',
    position: '대표',
    image: 'https://picsum.photos/80/80?random=4',
  },
];

const VoiceTestimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying) {
      setProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % testimonials.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isAutoPlaying]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setProgress(0);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setProgress(0);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden relative">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* 섹션 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-semibold text-orange-700">베스트 리뷰</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              이달의 베스트 리뷰
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            나라똔과 함께 성공을 이룬 사장님들의 진심 어린 이야기를 들어보세요
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* 이전/다음 버튼 (데스크톱) */}
          <button
            onClick={handlePrevious}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-14 h-14 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl transition-all z-10 group"
          >
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-14 h-14 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl transition-all z-10 group"
          >
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 lg:p-14 relative overflow-hidden"
            >
              {/* 배경 패턴 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full filter blur-3xl opacity-50"></div>

              {/* 인용 부호 아이콘 */}
              <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* 콘텐츠 */}
              <div className="relative z-10">
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-800 leading-relaxed mb-8 md:mb-10 font-light italic">
                  {testimonials[activeIndex].content}
                </p>

                {/* 작성자 정보 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                        {testimonials[activeIndex].author.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg md:text-xl text-gray-900">
                        {testimonials[activeIndex].author}
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        {testimonials[activeIndex].company} · {testimonials[activeIndex].position}
                      </p>
                    </div>
                  </div>

                  {/* 평점 */}
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-6 h-6 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">5.0 / 5.0 만족도</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 인디케이터 */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button key={index} onClick={() => handleDotClick(index)} className="relative">
                <div
                  className={`transition-all duration-300 ${
                    index === activeIndex ? 'w-12 h-3' : 'w-3 h-3'
                  } rounded-full bg-gray-300 hover:bg-gray-400 overflow-hidden`}
                >
                  {index === activeIndex && (
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1, ease: 'linear' }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* 재생/일시정지 버튼 */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isAutoPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  일시정지
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  자동재생
                </>
              )}
            </button>
          </div>

          {/* 모바일 스와이프 버튼 */}
          <div className="md:hidden flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceTestimonial;
