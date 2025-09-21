'use client';

import React from 'react';
import './PolicyComparison.css';

function PolicyComparison() {
  const insights = [
    {
      icon: 'fa-calculator',
      text: '1억 대출 시 연간 250~450만원 절약, 5년이면 2,250만원 차이',
      highlight: '2,250만원',
    },
    {
      icon: 'fa-lightbulb',
      text: '중소기업의 10%만 알고 있는 정부 지원 혜택',
      highlight: '10%만',
    },
    {
      icon: 'fa-check-circle',
      text: '신청서 한 장으로 연 450만원을 절약합니다',
      highlight: '450만원',
    },
  ];

  return (
    <section className="policy-comparison-section">
      <div className="container">
        {/* 인사이트 섹션 */}
        <div className="insights-section">
          <div className="insights-header">
            <h3>
              <span className="certified-icon">💯</span>
              나라똔 인증 기업심사관과 함께하는 최대 450만원 절약!
            </h3>
            <p className="guarantee-sub">나라똔이 보증하니 안심하세요</p>
          </div>

          <div className="insights-numbers">
            <div className="number-card primary">
              <div className="number-value">
                <span className="currency">₩</span>
                <span className="amount">450</span>
                <span className="unit">만원/년</span>
              </div>
              <i className="fas fa-piggy-bank number-icon"></i>
              <div className="number-label">최대 연간 절약</div>
            </div>

            <div className="number-card secondary">
              <div className="number-value">
                <span className="currency">₩</span>
                <span className="amount">2,250</span>
                <span className="unit">만원/5년</span>
              </div>
              <i className="fas fa-coins number-icon"></i>
              <div className="number-label">최대 누적 절약</div>
            </div>

            <div className="number-card alert">
              <div className="number-value">
                <span className="amount">10</span>
                <span className="unit">%만</span>
              </div>
              <i className="fas fa-exclamation-triangle number-icon"></i>
              <div className="number-label">알고 있음</div>
            </div>
          </div>

          <div className="insights-footer">
            <div className="insight-point">
              <i className="fas fa-check-circle"></i>
              <span>
                <span className="vs-left">은행 대출 700만원</span>
                <span className="vs-center"> VS </span>
                <span className="vs-right">정책자금 250만원</span>
                <span className="vs-suffix">(1년 이자)</span>
              </span>
            </div>
            <div className="condition-text">
              <small>
                * 1억원 대출 시 | 은행 대출 연 7.0% vs 정책자금 연 2.5% 기준 (실제 이율은 심사
                결과에 따라 달라질 수 있습니다)
              </small>
            </div>
            <div className="insight-point">
              <i className="fas fa-check-circle"></i>
              <span>중소기업 90%가 모르는 정부 지원</span>
            </div>
            <div className="insight-point">
              <i className="fas fa-check-circle"></i>
              <span>단 1장의 신청서로 시작하는 절약</span>
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="comparison-cta">
          <button className="cta-button primary">
            <span>정책자금 상담 받기</span>
            <i className="fas fa-arrow-right"></i>
          </button>
          <button className="cta-button secondary">
            <span>자격 확인하기</span>
            <i className="fas fa-check-circle"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PolicyComparison;
