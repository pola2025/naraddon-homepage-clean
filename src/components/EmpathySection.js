'use client';

import React from 'react';
import './EmpathySection.css';

function EmpathySection() {
  return (
    <section className="empathy-section-standalone">
      <div className="container">
        <div className="empathy-section">
          {/* CTA 영역만 남김 */}
          <div className="empathy-cta">
            <div className="cta-content">
              <div className="cta-text">
                <h3>지금 바로 시작하세요</h3>
                <p>나라똔과 함께 성공의 길로 나아가세요</p>
              </div>
              <div className="cta-buttons">
                <button className="cta-button primary">
                  <i className="fas fa-comment-dots"></i>
                  무료 상담 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmpathySection;
