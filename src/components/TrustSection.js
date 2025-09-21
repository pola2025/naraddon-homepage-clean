import React, { useState, useEffect } from 'react';
import './TrustSection.css';

function TrustSection() {
  const [shieldAnimation, setShieldAnimation] = useState(false);

  // 보증 내용 데이터 (간소화)
  const guaranteeItems = [
    {
      icon: 'fa-undo-alt',
      title: '전액 환불',
      description: '서비스 불만족 시 100% 환불',
    },
    {
      icon: 'fa-file-contract',
      title: '계약서 보장',
      description: '법적 효력 있는 문서로 보증',
    },
    {
      icon: 'fa-user-shield',
      title: '전문가 책임',
      description: '실명 전문가가 1:1 전담',
    },
    {
      icon: 'fa-handshake',
      title: '손해 배상',
      description: '과실 발생 시 즉시 보상',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector('.home-trust-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;

      if (isVisible && !shieldAnimation) {
        setShieldAnimation(true);
      }
    };

    // 초기 체크를 위한 지연
    setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="home-trust-section horizontal">
      <div className="container">
        {/* 가로 레이아웃 */}
        <div className="home-trust-content">
          {/* 왼쪽: 타이틀과 방패 */}
          <div className="home-trust-left">
            <div className="shield-title-group">
              <div className={`shield-icon-large ${shieldAnimation ? 'animate' : ''}`}>
                <i className="fas fa-shield-alt"></i>
                <div className="shield-pulse"></div>
                <div className="guarantee-badge-large">100%</div>
              </div>
              <div className="title-group">
                <h2 className="guarantee-title-compact">
                  나라똔이 보증하는
                  <br />
                  인증 기업심사관이
                  <br />
                  <span className="highlight">
                    최대한도 자금 끝까지
                    <br />
                    책임집니다.
                  </span>
                </h2>
                <p className="guarantee-subtitle-compact">
                  <span className="brand-name">나라똔</span>{' '}
                  <span className="system-text">100% 책임보증 시스템</span>
                </p>
              </div>
            </div>
          </div>

          {/* 중앙: 3개 특징 */}
          <div className="home-trust-center">
            <div className="guarantee-features-horizontal">
              <div className="feature-item-horizontal">
                <i className="fas fa-users"></i>
                <span>혼자가 아닙니다, 함께합니다</span>
              </div>
              <div className="feature-item-horizontal">
                <i className="fas fa-hand-holding-usd"></i>
                <span>안 되면 돈 안 받습니다</span>
              </div>
              <div className="feature-item-horizontal">
                <i className="fas fa-redo"></i>
                <span>될 때까지 도와드립니다</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 4개 배지 */}
          <div className="home-trust-right">
            <div className="guarantee-items-horizontal">
              {guaranteeItems.map((item, index) => (
                <div key={index} className="guarantee-item-horizontal">
                  <i className={`fas ${item.icon}`}></i>
                  <div className="item-text">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className="guarantee-note-horizontal">*나라똔 표준계약서에 근거한 보증제도</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;

