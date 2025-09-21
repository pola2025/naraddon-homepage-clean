import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [videoError, setVideoError] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 콘텐츠 표시
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoError = () => {
    console.log('비디오 로드 실패 - 대체 배경 사용');
    setVideoError(true);
  };

  return (
    <div className="video-section-wrapper">
      {/* 배경 비디오 */}
      <div className="video-background">
        {!videoError ? (
          <video autoPlay muted loop playsInline onError={handleVideoError}>
            <source src="/videos/Naraddon_main_2nd.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="video-fallback-bg"></div>
        )}
        <div className="video-overlay"></div>
      </div>

      {/* 히어로 콘텐츠 */}
      <div className={`video-content ${contentVisible ? 'visible' : ''}`}>
        <section className={`hero-section-main ${contentVisible ? 'visible' : ''}`}>
          <div className="hero-text-container">
            <h1 className="hero-main-title">
              대한민국 1,000만 사장님의 성공!
              <span className="highlight">가장 믿음직한 동행, 나라똔이 함께합니다.</span>
            </h1>

            {/* 버튼과 검색을 감싸는 컨테이너 */}
            <div className="hero-action-wrapper">
              <div className="hero-buttons">
                <a href="/consultation-request" className="hero-btn hero-btn-primary">
                  <i className="fas fa-comments"></i>
                  <span>무료상담신청</span>
                </a>
                <a href="/consultation-request#qna-section" className="hero-btn hero-btn-secondary">
                  <i className="fas fa-question-circle"></i>
                  <span>사업하면서 반드시 알아야 하는 100가지 Q&A</span>
                </a>
              </div>

              {/* 검색 섹션 */}
              <div className="hero-search-container">
                <div className="search-wrapper">
                  <h2 className="search-title">무엇을 도와드릴까요?</h2>
                  <div className="search-input-container">
                    <input
                      type="text"
                      placeholder="정책자금, 인증심사, 전문가 상담 등 검색해보세요"
                      className="search-input-main"
                      disabled
                    />
                    <button className="search-button-main" disabled>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeroSection;

