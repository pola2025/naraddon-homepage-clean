import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Home.css';
import HeroSection from './components/HeroSection';
import IntroVideo from './components/IntroVideo';
import TrustSection from '../TrustSection';
import PolicyThumbnails from '../PolicyThumbnails';
import SaveSection from '../SaveSection';
import NaraddonTube from '../NaraddonTube/NaraddonTube';
import EmpathySection from '../EmpathySection';
import { captions } from './constants/captions';

const CAPTION_FADE_DURATION = 850;

function Home() {
  useEffect(() => {
    document.body.classList.add('page-home');
    return () => document.body.classList.remove('page-home');
  }, []);
  const [showIntro, setShowIntro] = useState(true);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showGreenOverlay, setShowGreenOverlay] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const captionRef = useRef('');
  const fadeTimeoutRef = useRef(null);

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
              <video
                autoPlay
                muted
                loop
                playsInline
                onError={(e) => {
                  console.error('메인 페이지 배경 영상 로드 실패:', e);
                  // 영상 로드 실패 시 대체 배경
                  const videoElement = e.target;
                  if (videoElement && videoElement.parentElement) {
                    videoElement.style.display = 'none';
                    videoElement.parentElement.style.background =
                      'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                  }
                }}
                onLoadedData={() => {
                  console.log('✅ 메인 페이지 배경 영상 로드 성공');
                }}
              >
                <source src="/videos/Naraddon_main_2nd.mp4" type="video/mp4" />
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

