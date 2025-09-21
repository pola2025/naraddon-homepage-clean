'use client';

import React, { useState, useEffect } from 'react';
import './ExpertServices.css';

function ExpertServices() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [overlayActive, setOverlayActive] = useState(false);

  // 공감 스토리 카드 데이터 (6개)
  const empathyCards = [
    {
      id: 1,
      icon: 'fa-moon',
      title: '세금 신고 때문에 밤잠 설치셨나요?',
      description: '복잡한 세무 업무, 더 이상 혼자 끙끙대지 마세요.',
      solution: '나라똔 인증 세무사가 맞춤형 절세 전략을 제공합니다',
      color: '#3B82F6',
    },
    {
      id: 2,
      icon: 'fa-file-alt',
      title: '정책자금 서류가 너무 복잡하셨죠?',
      description: '어디서부터 시작해야 할지 막막한 그 마음, 알고 있습니다.',
      solution: '나라똔이 서류 준비부터 제출까지 완벽 대행해드립니다',
      color: '#8B5CF6',
    },
    {
      id: 3,
      icon: 'fa-user-tie',
      title: '혼자서 모든 걸 해결하기 버거우셨죠?',
      description: '사장님은 혼자가 아닙니다. 든든한 파트너가 있습니다.',
      solution: '나라똔 전문가 네트워크가 365일 함께합니다',
      color: '#10B981',
    },
    {
      id: 4,
      icon: 'fa-hand-holding-heart',
      title: '정말 믿고 맡길 수 있을까 고민되셨죠?',
      description: '수많은 약속들 속에서 진짜를 찾기 어려우셨을 겁니다.',
      solution: '나라똔은 계약서에 명시된 100% 책임보증을 약속합니다',
      color: '#F59E0B',
    },
    {
      id: 5,
      icon: 'fa-coins',
      title: '은행대출이나 직접 신청이 더 나을까요?',
      description: '이율과 최대한도에서 손해를 볼 수 있습니다.',
      solution: '나라똔 전문가와 함께 최저이율, 최대한도 실현 가능',
      color: '#EC4899',
    },
    {
      id: 6,
      icon: 'fa-bullseye',
      title: '정말 승인받을 수 있을까요?',
      description: '여러 번 실패한 경험으로 자신감이 떨어지셨나요?',
      solution: '나라똔과 함께라면 승인율 95% 달성 가능',
      color: '#14B8A6',
    },
  ];

  // 전문가 서비스 목록
  const services = [
    {
      title: '정부지원금 컨설팅',
      description: '기업 맞춤형 정부지원금 발굴 및 신청 대행',
      icon: 'fa-coins',
      features: ['지원금 발굴', '신청서 작성', '사후관리'],
    },
    {
      title: 'R&D 과제 기획',
      description: 'R&D 정부과제 기획 및 사업계획서 작성',
      icon: 'fa-flask',
      features: ['과제 기획', '제안서 작성', '평가 대응'],
    },
    {
      title: '경영인증 취득',
      description: '각종 경영인증 취득 컨설팅 및 대행',
      icon: 'fa-certificate',
      features: ['인증 진단', '서류 준비', '심사 대응'],
    },
    {
      title: '세무·회계 자문',
      description: '정부지원금 관련 세무·회계 전문 자문',
      icon: 'fa-calculator',
      features: ['세무 자문', '회계 처리', '정산 지원'],
    },
    {
      title: '법무 지원',
      description: '정부지원사업 관련 법률 자문 및 계약 지원',
      icon: 'fa-gavel',
      features: ['계약 검토', '법률 자문', '분쟁 해결'],
    },
    {
      title: '사업화 전략',
      description: '정부지원사업 연계 사업화 전략 수립',
      icon: 'fa-rocket',
      features: ['시장 분석', '전략 수립', '성과 관리'],
    },
  ];

  useEffect(() => {
    // 페이지 로드 시 카드 순차적으로 표시
    const timer = setTimeout(() => {
      const allCardIds = empathyCards.map((card) => card.id);
      setVisibleCards(allCardIds);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (cardId) => {
    setExpandedCard(cardId);
    setOverlayActive(true);
  };

  const handleCloseCard = () => {
    setExpandedCard(null);
    setOverlayActive(false);
  };

  const handleOverlayClick = () => {
    handleCloseCard();
  };

  return (
    <div className="expert-services-page">
      <div className="page-header">
        <h1>전문가 서비스</h1>
        <p>나라똔 인증 전문가들이 여러분의 고민을 해결해드립니다</p>
      </div>

      {/* 공감카드 섹션 */}
      <section className="empathy-section-standalone">
        <div className="container">
          <div className="empathy-section">
            {/* 헤더 */}
            <div className="empathy-header">
              <h3>사장님의 이런 고민, 우리가 해결해드립니다</h3>

              {/* 신뢰 배지 */}
              <div className="trust-badges">
                <span className="trust-badge">
                  <i className="fas fa-shield-alt"></i>
                  나라똔 100% 책임보증
                </span>
                <span className="trust-badge">
                  <i className="fas fa-certificate"></i>
                  정부인증 전문가
                </span>
                <span className="trust-badge">
                  <i className="fas fa-check-circle"></i>
                  승인율 95%
                </span>
              </div>
            </div>

            {/* 공감 카드 그리드 */}
            <div className="empathy-cards">
              {empathyCards.map((card) => (
                <div
                  key={card.id}
                  className={`empathy-card ${visibleCards.includes(card.id) ? 'visible' : ''} ${expandedCard === card.id ? 'expanded' : ''}`}
                  style={{ '--card-color': card.color }}
                  onClick={() => handleCardClick(card.id)}
                >
                  {expandedCard === card.id && (
                    <button
                      className="close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseCard();
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <div className="card-icon" style={{ color: card.color }}>
                    <i className={`fas ${card.icon}`}></i>
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                  <div className="solution">{card.solution}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오버레이 */}
        <div
          className={`empathy-overlay ${overlayActive ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      </section>

      {/* 기존 서비스 카드 섹션 */}
      <div className="services-container">
        <h2>나라똔 전문가 서비스</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className={`fas ${service.icon}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/consultation-request" className="service-button">
                상담 신청
              </a>
            </div>
          ))}
        </div>

        <div className="service-process">
          <h2>서비스 진행 프로세스</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <h4>무료 상담</h4>
              <p>기업 현황 분석 및 니즈 파악</p>
            </div>
            <div className="process-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <h4>전문가 매칭</h4>
              <p>최적의 전문가 선정 및 매칭</p>
            </div>
            <div className="process-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <h4>서비스 제공</h4>
              <p>맞춤형 컨설팅 서비스 제공</p>
            </div>
            <div className="process-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <h4>사후 관리</h4>
              <p>지속적인 모니터링 및 지원</p>
            </div>
          </div>
        </div>

        <div className="service-cta">
          <h2>전문가와 함께 성공적인 정부지원금을 확보하세요</h2>
          <p>나라똔이 검증한 전문가들이 여러분의 성공을 돕겠습니다.</p>
          <a href="/consultation-request" className="cta-button primary">
            <i className="fas fa-comments"></i>
            무료 상담 신청
          </a>
        </div>
      </div>
    </div>
  );
}

export default ExpertServices;
