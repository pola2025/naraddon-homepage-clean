'use client';

import React from 'react';
import './PolicyComparisonFull.css';

function PolicyComparisonFull() {
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
    <section className="policy-comparison-full-section">
      <div className="container">
        {/* 나라똔 보증 강조 */}
        <div className="guarantee-highlight">
          <i className="fas fa-shield-alt"></i>
          <span>나라똔이 직접 인증한 기업심사관만 배정합니다</span>
        </div>

        {/* 섹션 헤더 */}
        <div className="section-header">
          <h2 className="main-title">정부정책자금, 몰라서 못받는 겁니다</h2>
          <p className="sub-title">중소기업의 90%가 모르는 연 250만원 절약법</p>
        </div>

        {/* 비교 테이블 */}
        <div className="comparison-container">
          <div className="comparison-table">
            {/* 헤더 */}
            <div className="table-header">
              <div className="header-cell category">구분</div>
              <div className="header-cell bank">
                <i className="fas fa-university"></i>
                일반 은행 대출
              </div>
              <div className="header-cell policy">
                <i className="fas fa-landmark"></i>
                <span>정부 정책 자금</span>
                <span className="recommend-badge">추천</span>
              </div>
            </div>

            {/* 비교 항목들 */}
            <div className="table-body">
              <div className="comparison-row">
                <div className="row-title">이자 부담</div>
                <div className="bank-cell">
                  <i className="fas fa-chart-line icon-negative"></i>
                  <div className="cell-content">
                    <strong>연 5~7% (시중금리)</strong>
                    <small>1억 대출 시 연 500~700만원</small>
                  </div>
                </div>
                <div className="policy-cell">
                  <i className="fas fa-chart-line icon-positive"></i>
                  <div className="cell-content">
                    <strong>연 2.5~3.5% (정책금리)</strong>
                    <small>1억 대출 시 연 250~450만원</small>
                  </div>
                </div>
              </div>

              <div className="comparison-row">
                <div className="row-title">상환 압박</div>
                <div className="bank-cell">
                  <i className="fas fa-running icon-negative"></i>
                  <div className="cell-content">
                    <strong>짧고 굵게</strong>
                    <small>(바로 원금 상환)</small>
                  </div>
                </div>
                <div className="policy-cell">
                  <i className="fas fa-walking icon-positive"></i>
                  <div className="cell-content">
                    <strong>길고 가늘게</strong>
                    <small>(이자만 내는 기간도!)</small>
                  </div>
                </div>
              </div>

              <div className="comparison-row">
                <div className="row-title">대출 한도</div>
                <div className="bank-cell">
                  <i className="fas fa-cube icon-negative"></i>
                  <div className="cell-content">
                    <strong>현재 매출과 자산 기준</strong>
                  </div>
                </div>
                <div className="policy-cell">
                  <i className="fas fa-rocket icon-positive"></i>
                  <div className="cell-content">
                    <strong>&apos;미래 성장 가능성&apos;까지 더해서</strong>
                  </div>
                </div>
              </div>

              <div className="comparison-row">
                <div className="row-title">심사 기준</div>
                <div className="bank-cell">
                  <i className="fas fa-search icon-negative"></i>
                  <div className="cell-content">
                    <strong>과거의 실적을 따지는</strong>
                    <small>재무제표</small>
                  </div>
                </div>
                <div className="policy-cell">
                  <i className="fas fa-lightbulb icon-positive"></i>
                  <div className="cell-content">
                    <strong>미래의 가치를 기대하는</strong>
                    <small>사업계획서</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 플랫폼 보증 배지 */}
          <div className="platform-guarantee">
            <div className="guarantee-badge">
              <i className="fas fa-check-circle"></i>
              <span>나라똔 플랫폼 100% 책임보증</span>
            </div>
            <div className="guarantee-text">문제 발생시 나라똔이 책임집니다</div>
          </div>
        </div>

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
              </span>
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

export default PolicyComparisonFull;
