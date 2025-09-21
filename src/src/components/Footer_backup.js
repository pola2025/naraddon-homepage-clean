'use client';

import React from 'react';
import './Footer.css';

const Footer = () => {
  // 정부기관 목록
  const governmentAgencies = [
    '중소벤처기업부',
    '산업통상자원부',
    '과학기술정보통신부',
    '고용노동부',
    '환경부',
    '국토교통부',
    '농림축산식품부',
    '해양수산부',
    '보건복지부',
    '문화체육관광부',
    '교육부',
    '기획재정부',
    '금융위원회',
    '특허청',
    '중소벤처기업진흥공단',
    '한국산업기술진흥원',
    '정보통신산업진흥원',
  ];

  return (
    <footer className="footer-wrapper">
      {/* 정부기관 롤링 배너 - 푸터 최상단 */}
      <div className="footer-gov-banner">
        <div className="gov-banner-highlight"></div>
        <div className="gov-banner-track">
          {/* 첫 번째 세트 */}
          {governmentAgencies.map((agency, index) => (
            <span
              key={`first-${index}`}
              className="gov-agency-name"
              style={{ animationDelay: `${index * 2.65}s` }}
            >
              {agency}
            </span>
          ))}
          {/* 두 번째 세트 (무한 롤링용) */}
          {governmentAgencies.map((agency, index) => (
            <span
              key={`second-${index}`}
              className="gov-agency-name"
              style={{ animationDelay: `${(index + governmentAgencies.length) * 2.65}s` }}
            >
              {agency}
            </span>
          ))}
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left-column">
            <div className="footer-info">
              <div className="footer-logo">
                <span className="footer-logo-text">나라똔</span>
              </div>
              <p className="footer-desc">
                나라똔은 정책자금 전문 컨설팅으로
                <br />
                중소기업의 성공적인 성장과 발전을 지원합니다
              </p>
            </div>

            <div className="footer-contact">
              <h4 className="footer-title">회사정보</h4>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <path d="M20 8v6"></path>
                  <path d="M23 11h-6"></path>
                </svg>
                <span>대표: 이서영</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>사업자등록번호: 203-28-65630</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>주소: 경기도 광명시 일직로 43, B동 14층 1402호, 1403호</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M12 12l8-5H4l8 5z"></path>
                </svg>
                <span>이메일: jjk_naraddon@naver.com</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>운영시간: 평일 09:00-18:00</span>
              </div>

              {/* JJK 업무협약 */}
              <div className="partnership-link">
                <a href="https://www.jjk-biz.com/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://cdn.imweb.me/upload/S2025072970f03c9c7eca7/ac036acf8a029.png"
                    alt="JJK 업무협약"
                    className="partnership-icon"
                  />
                  <span>업무협약 | 나라똔</span>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-menu-wrapper">
            <div className="footer-menu">
              <h4 className="footer-title">서비스</h4>
              <ul className="footer-list">
                <li>
                  <a href="/">나라똔</a>
                </li>
                <li>
                  <a href="/policy-analysis">정책분석</a>
                </li>
                <li>
                  <a href="/business-voice">사업자 목소리</a>
                </li>
                <li>
                  <a href="/certified-examiners">인증 기업심사관</a>
                </li>
                <li>
                  <a href="/expert-services">전문가 서비스</a>
                </li>
                <li>
                  <a href="/consultation-request">상담신청</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2025 나라똔. All rights reserved.</p>
          <div className="footer-links">
            <a href="/terms">이용약관</a>
            <span className="divider">|</span>
            <a href="/privacy">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
