'use client';

import React, { useState } from 'react';
import './ConsultationRequest.css';
import PolicyComparisonFull from '../components/PolicyComparisonFull';

const ConsultationRequest = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    businessType: '',
    consultationType: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 폼 제출 로직 추가
    console.log('Form submitted:', formData);
    alert('상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
  };

  return (
    <div className="consultation-request-page">
      <div className="page-header">
        <h1>상담신청</h1>
        <p>전문가와 함께 정부지원금 성공 전략을 수립하세요</p>
      </div>

      {/* 정책자금 비교표 및 450만원 절약 섹션 추가 */}
      <PolicyComparisonFull />

      <div className="consultation-container">
        <div className="consultation-benefits">
          <h2>왜 나라똔과 함께해야 할까요?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4>검증된 전문가</h4>
              <p>나라똔이 인증한 각 분야별 최고의 전문가들이 함께합니다</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h4>높은 성공률</h4>
              <p>체계적인 컨설팅으로 업계 최고 수준의 선정률을 자랑합니다</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h4>무료 상담</h4>
              <p>부담 없이 먼저 상담받고 결정하세요</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h4>전담 지원</h4>
              <p>신청부터 사후관리까지 전담 매니저가 1:1로 지원합니다</p>
            </div>
          </div>
        </div>

        <div className="consultation-form-section">
          <div className="form-header">
            <h2>무료 상담 신청</h2>
            <p>아래 정보를 입력하시면 전문가가 직접 연락드립니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="consultation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">
                  기업명 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="기업명을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactName">
                  담당자명 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="담당자 성함을 입력하세요"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  연락처 <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="010-0000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  이메일 <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@company.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessType">
                  업종 <span className="required">*</span>
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                >
                  <option value="">업종을 선택하세요</option>
                  <option value="manufacturing">제조업</option>
                  <option value="it">IT/소프트웨어</option>
                  <option value="service">서비스업</option>
                  <option value="medical">의료/바이오</option>
                  <option value="distribution">유통/물류</option>
                  <option value="construction">건설/건축</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="consultationType">
                  상담 분야 <span className="required">*</span>
                </label>
                <select
                  id="consultationType"
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  required
                >
                  <option value="">상담 분야를 선택하세요</option>
                  <option value="funding">정부지원금 컨설팅</option>
                  <option value="rnd">R&D 과제</option>
                  <option value="certification">인증 취득</option>
                  <option value="tax">세무/회계</option>
                  <option value="legal">법무 지원</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">상담 내용</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="구체적인 상담 내용을 입력해주시면 더 정확한 답변을 드릴 수 있습니다."
              />
            </div>

            <div className="form-agreement">
              <label>
                <input type="checkbox" required />
                <span>개인정보 수집 및 이용에 동의합니다.</span>
              </label>
            </div>

            <button type="submit" className="submit-button">
              <i className="fas fa-paper-plane"></i>
              상담 신청하기
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h3>직접 문의하기</h3>
          <div className="contact-methods">
            <div className="contact-method">
              <i className="fas fa-phone"></i>
              <div>
                <h4>전화 상담</h4>
                <p>1588-0000</p>
                <span>평일 09:00 - 18:00</span>
              </div>
            </div>
            <div className="contact-method">
              <i className="fas fa-envelope"></i>
              <div>
                <h4>이메일 문의</h4>
                <p>contact@naraddon.com</p>
                <span>24시간 접수 가능</span>
              </div>
            </div>
            <div className="contact-method">
              <i className="fas fa-comments"></i>
              <div>
                <h4>카카오톡 상담</h4>
                <p>@나라똔</p>
                <span>실시간 상담 가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRequest;
