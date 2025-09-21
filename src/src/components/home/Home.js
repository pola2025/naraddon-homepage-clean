import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Home.css';
import HeroSection from './components/HeroSection';
import IntroVideo from './components/IntroVideo';
import TrustSection from '../TrustSection';
import PolicyThumbnails from '../PolicyThumbnails';
import SaveSection from '../SaveSection';
import NaraddonTube from '../NaraddonTube';
import EmpathySection from '../EmpathySection';

const CAPTION_FADE_DURATION = 850;

function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showGreenOverlay, setShowGreenOverlay] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const captionRef = useRef('');
  const fadeTimeoutRef = useRef(null);

  // 자막 데이터
  const captions = [
    { time: 0, endTime: 4, text: '솔직히, 사업한다는 게\n매일 전쟁 같죠' },
    { time: 4, endTime: 8, text: '가족을 지키고,\n삶을 이어가려는 값진 땀방울' },
    { time: 8, endTime: 12, text: '결국,\n그 힘이 나라를 살립니다' },
    { time: 12, endTime: 16, text: '사업자가 살아야,\n대한민국이 삽니다' },
    { time: 16, endTime: 20, text: '사업자가 무너지면,\n대한민국도 무너집니다' },
    { time: 20, endTime: 24, text: '그래서 우리는 당신을 응원합니다' },
    { time: 24, endTime: 30, text: '모든 사업자들의\n고민을 해결하는 No.1 플랫폼\n\n나라똔' },
  ];

  // 자막 업데이트
  useEffect(() => {
    if (!showIntro) return;

    const startTime = Date.now();

    const updateCaption = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      const caption = captions.find((cap) => elapsed >= cap.time && elapsed < cap.endTime);

      if (caption) {
        if (caption.text !== captionRef.current) {
          captionRef.current = caption.text;
          setIsCaptionVisible(false);

          if (fadeTimeoutRef.current) {
            clearTimeout(fadeTimeoutRef.current);
          }

          fadeTimeoutRef.current = setTimeout(() => {
            setCurrentCaption(caption.text);
            setIsCaptionVisible(true);
            fadeTimeoutRef.current = null;
          }, CAPTION_FADE_DURATION);
        }
      } else if (captionRef.current) {
        captionRef.current = '';
        setIsCaptionVisible(false);

        if (fadeTimeoutRef.current) {
          clearTimeout(fadeTimeoutRef.current);
        }

        fadeTimeoutRef.current = setTimeout(() => {
          setCurrentCaption('');
          fadeTimeoutRef.current = null;
        }, CAPTION_FADE_DURATION);
      }
    };

    const interval = setInterval(updateCaption, 100);

    return () => {
      clearInterval(interval);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [showIntro]);

  // 시작 버튼 클릭 핸들러
  const handleStartClick = useCallback(() => {
    setShowGreenOverlay(true);

    setTimeout(() => {
      setShowIntro(false);
      setShowStartButton(false);
      setShowGreenOverlay(false);
      document.body.style.overflow = 'auto';
    }, 1000);
  }, []);

  // NaraddonTube 확장 토글
  const handleExpandToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // 초기 스크롤 잠금
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showIntro]);

  return (
    <div className="home-page">
      {/* 인트로 비디오 (전체 화면) */}
      {showIntro && (
        <IntroVideo
          showStartButton={showStartButton}
          currentCaption={currentCaption}
          isCaptionVisible={isCaptionVisible}
          showGreenOverlay={showGreenOverlay}
          onStartClick={handleStartClick}
          videoError={videoError}
          setVideoError={setVideoError}
        />
      )}

      {/* 메인 콘텐츠 (인트로 후 표시) */}
      {!showIntro && (
        <div className="home-main-content">
          {/* 영상 배경 래퍼 */}
          <div className="home-hero-section">
            {/* 배경 영상 */}
            <div className="home-hero-section__background">
              <video autoPlay muted loop playsInline src="/videos/Naraddon_main_2nd.mp4">
                Your browser does not support the video tag.
              </video>
              <div className="home-hero-section__overlay"></div>
            </div>

            {/* 히어로 섹션 */}
            <HeroSection />
          </div>

          {/* 신뢰 보증 섹션 */}
          <TrustSection />

          {/* 정책 썸네일 섹션 */}
          <PolicyThumbnails />

          {/* 나라똔Tube 섹션 */}
          <NaraddonTube isExpanded={isExpanded} onExpandToggle={handleExpandToggle} />

          {/* 계산기 영역 - 푸터 바로 위 */}
          <SaveSection />

          {/* 보라색 CTA 섹션 */}
          <EmpathySection />

          {/* 정부기관 로고 롤링 섹션 - 맨 아래로 이동 */}
          <section className="home-government-logos">
            <div className="home-government-logos__container">
              <div className="home-government-logos__heading">
                <h2 className="home-government-logos__title">
                  함께하는 정부기관
                  <span className="home-government-logos__title-underline"></span>
                </h2>
                <p className="home-government-logos__subtitle">
                  신뢰할 수 있는 정부기관과 함께 성공을 만들어갑니다
                </p>
              </div>
              <div className="home-government-logos__wrapper">
                <div className="home-government-logos__scroller">
                  <div className="home-government-logos__row">
                    {[...Array(17)].map((_, i) => (
                      <div key={i} className="home-government-logos__logo">
                        <img
                          src={`/images/${i + 1}.png`}
                          alt={`정부기관 로고 ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="home-government-logos__row">
                    {[...Array(17)].map((_, i) => (
                      <div key={`dup-${i}`} className="home-government-logos__logo">
                        <img
                          src={`/images/${i + 1}.png`}
                          alt={`정부기관 로고 ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      )}
    </div>
  );
}

export default Home;

