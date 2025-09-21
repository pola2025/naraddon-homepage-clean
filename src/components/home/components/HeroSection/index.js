'use client';

import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`hero-section-container ${contentVisible ? 'visible' : ''}`}>
      <div className="hero-text-container">
        <h1 className="hero-main-title">
          기업이 살아야, 나라가 산다
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
    </div>
  );
};

export default HeroSection;

