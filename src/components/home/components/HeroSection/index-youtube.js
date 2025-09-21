'use client';

import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [videoError, setVideoError] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="video-section-wrapper">
      {/* 배경 비디오 또는 YouTube iframe */}
      <div className="video-background">
        {/* 옵션 1: YouTube 배경 영상 (무음 자동재생) */}
        {false && ( // YouTube 사용시 true로 변경
          <div className="youtube-background">
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&playsinline=1&playlist=YOUR_VIDEO_ID"
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '100vh',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* 옵션 2: 로컬 영상 (작은 파일) */}
        {!videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            poster="/images/1.png"
          >
            <source src="/videos/naraddon_background_low.mp4" type="video/mp4" />
          </video>
        )}

        {/* 옵션 3: 영상 실패시 이미지 배경 */}
        {videoError && (
          <div
            className="video-fallback-bg"
            style={{
              backgroundImage: 'url(/images/1.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
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

