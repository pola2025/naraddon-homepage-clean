import { useEffect } from 'react';

export const useScrollAnimation = (showStartButton, contentVisible, iconSectionVisible) => {
  // 스크롤 기반 요소 표시
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      const checkVisibility = (selector, setState) => {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;

          if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            setState(true);
          }
        }
      };

      if (!showStartButton) {
        // 필요한 경우 다른 섹션 체크 로직 추가
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contentVisible, iconSectionVisible, showStartButton]);

  // 스크롤 방지
  useEffect(() => {
    if (showStartButton) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showStartButton]);
};
