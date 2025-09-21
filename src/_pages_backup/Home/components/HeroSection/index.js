import React from 'react';
import './HeroSection.css';

const HeroSection = ({ contentVisible }) => {
  return (
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
              <a href="/consultation" className="hero-btn hero-btn-primary">
                <i className="fas fa-comments"></i>
                <span>무료상담신청</span>
              </a>
              <a href="/qna" className="hero-btn hero-btn-secondary">
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
  );
};

export default HeroSection;
