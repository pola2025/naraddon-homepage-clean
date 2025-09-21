import React, { useState, useEffect } from 'react';
import './CertifiedExaminers.css';

const CertifiedExaminers = () => {
  // 기업심사관 데이터
  const inspectors = [
    {
      name: '김민선',
      company: '엠엔에스파트너스',
      image: `/images/examiner1.jpg`,
      field: '의료',
      satisfaction: '98.5%',
    },
    {
      name: '김요엘',
      company: '한걸음비즈니스',
      image: `/images/examiner2.jpg`,
      field: 'M&A',
      satisfaction: '97.2%',
    },
    {
      name: '박민재',
      company: '푸른중소기업경영지원센터',
      image: `/images/examiner3.jpg`,
      field: 'R&D',
      satisfaction: '99.1%',
    },
    {
      name: '신순화',
      company: '바른경영지원센터',
      image: `/images/examiner4.jpg`,
      field: '제조업',
      satisfaction: '96.8%',
    },
    {
      name: '양미진',
      company: '와이제이솔루션',
      image: `/images/examiner5.jpg`,
      field: '법무',
      satisfaction: '98.0%',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % inspectors.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [inspectors.length]);

  const handlePrev = () => {
    setCurrentIndex(currentIndex === 0 ? inspectors.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % inspectors.length);
  };

  return (
    <section className="certified-examiners-section">
      <div className="bg-animation">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>
      <div className="decoration-element decoration-gradient"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="guarantee-badge">
            <span>🏆</span>
            <span>나라똔 기업심사관 보증제</span>
          </div>

          <h1 className="hero-title">
            검증된 기업심사관과 함께
            <br />
            <span className="highlight">정책자금 성공 파트너</span>
          </h1>

          <p className="hero-subtitle">
            정부지원금 사전심사부터 자금 확보까지,
            <br />
            나라똔이 보증하는 전문 기업심사관이 함께합니다
          </p>

          <div className="guarantee-emphasis">
            <p>
              <strong>나라똔 기업심사관 보증제</strong>로 안심하세요!
              <br />
              모든 기업심사관의 업무 과정을 나라똔이 직접 관리하고 보증합니다. 불성실한 업무나 과실
              발생 시 나라똔이 책임지고 보상합니다.
            </p>
          </div>

          <div className="cta-group">
            <a href="/consultation-request" className="cta-button cta-primary">
              <span>📋</span>
              <span>무료 심사 신청</span>
            </a>
            <a href="#guarantee" className="cta-button cta-secondary">
              <span>🛡️</span>
              <span>기업심사관 보증제 안내</span>
            </a>
          </div>
        </div>

        <div className="inspector-showcase">
          <div className="inspector-card active">
            <div className="inspector-image-wrapper">
              <img
                src={inspectors[currentIndex].image}
                alt={`${inspectors[currentIndex].name} 기업심사관`}
                className="inspector-image"
              />
              <div className="certified-badge">
                <span>✓</span>
                <span>인증 심사관</span>
              </div>
            </div>
            <div className="inspector-info">
              <h3 className="inspector-name">{inspectors[currentIndex].name}</h3>
              <p className="inspector-company">{inspectors[currentIndex].company}</p>
              <span className="inspector-title">인증 기업심사관</span>
              <div className="inspector-stats">
                <div className="stat-item">
                  <span className="stat-value">{inspectors[currentIndex].field}</span>
                  <span className="stat-label">전문분야</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{inspectors[currentIndex].satisfaction}</span>
                  <span className="stat-label">기업심사 만족도</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-arrow prev" onClick={handlePrev}>
            <i className="fas fa-chevron-left"></i>
          </div>
          <div className="profile-arrow next" onClick={handleNext}>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>

      {/* 상세 내용 섹션 */}
      <div className="detail-section">
        <DetailContent />
      </div>
    </section>
  );
};

// 상세 내용 컴포넌트
const DetailContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = [`/images/slide1.png`, `/images/slide2.jpg`];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSlideChange = (direction) => {
    setCurrentSlide((prev) => {
      if (direction === 'next') {
        return (prev + 1) % images.length;
      } else {
        return prev === 0 ? images.length - 1 : prev - 1;
      }
    });
  };

  return (
    <section className="detail-hero-section">
      <div className="decoration-1"></div>
      <div className="decoration-2"></div>

      <div className="detail-hero-container">
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">
              대한민국 사업자를 위한
              <br />
              <span className="highlight">정책자금 No.1 플랫폼!</span>
            </h1>
            <p className="hero-subtitle">
              정부지원금의 사전점검부터 검증된 전문가 매칭까지,
              <br />
              기업의 자금 확보를 위한 믿음직한 솔루션
            </p>
          </div>

          <div className="cta-wrapper">
            <a href="/consultation-request" className="cta-button cta-primary">
              <i className="fas fa-comments"></i>
              <span>무료상담신청</span>
            </a>
            <a href="/expert-services" className="cta-button cta-secondary">
              <i className="fas fa-search"></i>
              <span>전문가찾기</span>
            </a>
          </div>
        </div>

        <div className="image-wrapper">
          <div className="image-slider" onClick={() => setIsModalOpen(true)}>
            <div className="slide-container">
              {images.map((image, index) => (
                <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
                  <img src={image} alt={`정책자금 플랫폼 서비스 ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="floating-badge">신규정책소식</div>

            <div className="zoom-icon">
              <i className="fas fa-search-plus"></i>
            </div>

            <div
              className="slide-arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                handleSlideChange('prev');
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </div>
            <div
              className="slide-arrow next"
              onClick={(e) => {
                e.stopPropagation();
                handleSlideChange('next');
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </div>

            <div className="slide-indicators">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 모달 */}
      {isModalOpen && (
        <div className="image-modal show" onClick={() => setIsModalOpen(false)}>
          <span className="modal-close" onClick={() => setIsModalOpen(false)}>
            &times;
          </span>
          <div
            className="modal-arrow prev"
            onClick={(e) => {
              e.stopPropagation();
              handleSlideChange('prev');
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </div>
          <div
            className="modal-arrow next"
            onClick={(e) => {
              e.stopPropagation();
              handleSlideChange('next');
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </div>
          <div className="modal-content">
            <img src={images[currentSlide]} alt="확대 이미지" />
          </div>
        </div>
      )}
    </section>
  );
};

export default CertifiedExaminers;
