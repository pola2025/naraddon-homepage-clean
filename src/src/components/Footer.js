'use client';

import React from 'react';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left-column">
            <div className="footer-info">
              <div className="footer-logo">
                <span className="footer-logo-text">나라똔</span>
              </div>
              <p className="footer-desc">
                안심하고 맡길 수 있는 100% 인증 기업심사관
                <br />
                대표님의 든든한 자금계획 파트너
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>운영시간: 평일 09:00-18:00</span>
              </div>
            </div>
          </div>

          <div className="footer-menu-wrapper">
            <div className="footer-menu">
              <h4 className="footer-title">서비스</h4>
              <ul className="footer-list">
                <li>
                  <Link href="/">나라똔</Link>
                </li>
                <li>
                  <Link href="/policy-analysis">정책분석</Link>
                </li>
                <li>
                  <Link href="/business-voice">사업자 목소리</Link>
                </li>
                <li>
                  <Link href="/certified-examiners">인증 기업심사관</Link>
                </li>
                <li>
                  <Link href="/expert-services">전문가 서비스</Link>
                </li>
                <li>
                  <Link href="/consultation-request">상담신청</Link>
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
