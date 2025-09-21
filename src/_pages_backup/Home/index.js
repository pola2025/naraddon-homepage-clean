import React, { useState, useCallback, useEffect } from 'react';
import '../Home.css';
import '../../styles/floating-cards.css';

// Components
import IntroVideo from './components/IntroVideo';
import HeroSection from './components/HeroSection';
import TrustSection from '../../components/TrustSection';
import PolicyThumbnails from '../../components/PolicyThumbnails';
import SaveSection from '../../components/SaveSection';
import NaraddonTube from '../../components/NaraddonTube';
import EmpathySection from '../../components/EmpathySection';

// Hooks
import { useCaptions } from './hooks/useCaptions';
import { useScrollAnimation } from './hooks/useScrollAnimation';

// Constants
import { captions } from './constants/captions';

function Home() {
  const [videoError, setVideoError] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [iconSectionVisible, setIconSectionVisible] = useState(false);
  const [showGreenOverlay, setShowGreenOverlay] = useState(false);

  // 자막 훅 사용
  const { currentCaption, currentSubCaption, isCaptionVisible } = useCaptions(
    showStartButton,
    captions
  );

  // 스크롤 애니메이션 훅 사용
  useScrollAnimation(showStartButton, contentVisible, iconSectionVisible);

  // 시작 버튼 클릭 핸들러
  const handleStartClick = useCallback(() => {
    console.log('버튼 클릭됨');

    setShowGreenOverlay(true);

    setTimeout(() => {
      setShowStartButton(false);
      setContentVisible(true);
      setIconSectionVisible(true);
      setShowGreenOverlay(false);

      setTimeout(() => {
        const heroSection = document.querySelector('.hero-section-main');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 300);
  }, []);

  // 사용자 인터랙션 감지
  useEffect(() => {
    let isTriggered = false;

    const handleScrollTrigger = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (showStartButton && !isTriggered && scrollY > 0) {
        isTriggered = true;
        handleStartClick();
      }
    };

    const handleKeyDown = (e) => {
      if (showStartButton && !isTriggered && e.key !== 'Tab') {
        isTriggered = true;
        handleStartClick();
      }
    };

    let scrollTimeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollTrigger, 10);
    };

    window.addEventListener('scroll', debouncedScroll);
    window.addEventListener('wheel', debouncedScroll);
    window.addEventListener('touchstart', handleScrollTrigger);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      window.removeEventListener('wheel', debouncedScroll);
      window.removeEventListener('touchstart', handleScrollTrigger);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollTimeout);
    };
  }, [showStartButton, handleStartClick]);

  return (
    <>
      {/* 인트로 영상 섹션 */}
      <IntroVideo
        showStartButton={showStartButton}
        currentCaption={currentCaption}
        currentSubCaption={currentSubCaption}
        isCaptionVisible={isCaptionVisible}
        showGreenOverlay={showGreenOverlay}
        onStartClick={handleStartClick}
        videoError={videoError}
        setVideoError={setVideoError}
      />

      {/* 메인 콘텐츠 영역 */}
      {!showStartButton && (
        <div className="main-content-area">
          {/* 영상 배경 래퍼 */}
          <div className="video-section-wrapper">
            {/* 배경 영상 */}
            <div className="video-background">
              <video autoPlay muted loop playsInline src="/videos/Naraddon_main_2nd.mp4">
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>

            {/* 히어로 섹션 */}
            <HeroSection contentVisible={contentVisible} />
          </div>

          {/* 신뢰 보증 섹션 */}
          <TrustSection />

          {/* 정책 썸네일 섹션 */}
          <PolicyThumbnails />

          {/* 나라똔Tube 섹션 */}
          <NaraddonTube />

          {/* 절약 섹션 */}
          <SaveSection />

          {/* 공감 스토리 카드 섹션 (CTA) */}
          <EmpathySection />

          {/* 정부기관 로고 롤링 섹션 */}
          <section className="government-logos-section">
            <div className="container">
              <h2 className="section-title">함께하는 정부기관</h2>
              <div className="government-logos-wrapper">
                <div className="government-logos">
                  <div className="logos-track">
                    {[...Array(17)].map((_, i) => (
                      <a
                        key={i}
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="government-logo"
                      >
                        <img src={`/images/${i + 1}.png`} alt={`정부기관 로고 ${i + 1}`} />
                      </a>
                    ))}
                  </div>
                  <div className="logos-track">
                    {[...Array(17)].map((_, i) => (
                      <a
                        key={`dup-${i}`}
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="government-logo"
                      >
                        <img src={`/images/${i + 1}.png`} alt={`정부기관 로고 ${i + 1}`} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Home;
