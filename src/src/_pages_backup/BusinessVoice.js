import React, { useState } from 'react';
import './BusinessVoice.css';

const BusinessVoice = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 사업자 목소리 데이터 (CommunitySection에서 가져옴)
  const testimonials = [
    {
      id: 1,
      category: 'R&D지원',
      businessName: '테크스타트',
      ceo: '김○○ 대표',
      title: '나라똔 덕분에 R&D 과제 선정됐어요! 정말 감사합니다',
      content:
        'R&D 과제 신청이 처음이라 막막했는데, 나라똔 전문가분께서 서류 작성부터 면접 준비까지 꼼꼼하게 도와주셨어요. 덕분에 5억원 규모의 과제에 선정될 수 있었습니다.',
      date: '2024-07-25',
      supportAmount: '5억원',
      supportType: 'R&D 지원사업',
      likes: 24,
    },
    {
      id: 2,
      category: '세무상담',
      businessName: '제조업체',
      ceo: '이○○ 사장',
      title: '세무 상담 받고 절세 효과 월 200만원! 완전 대만족',
      content:
        '세무 처리가 복잡해서 고민이 많았는데, 나라똔 세무 전문가와 상담 후 절세 방법을 찾았습니다. 매달 200만원씩 절약하고 있어요.',
      date: '2024-07-24',
      supportAmount: '월 200만원 절세',
      supportType: '세무 컨설팅',
      likes: 18,
    },
    {
      id: 3,
      category: '수출지원',
      businessName: '무역회사',
      ceo: '박○○ 대표',
      title: '수출바우처 신청했는데 3주만에 승인났네요',
      content:
        '수출바우처 신청 절차가 복잡하다고 들어서 걱정했는데, 나라똔에서 제공한 가이드대로 따라하니 3주만에 승인이 났습니다!',
      date: '2024-07-23',
      supportAmount: '수출바우처',
      supportType: '수출바우처 지원사업',
      likes: 15,
    },
    {
      id: 4,
      category: '인증/평가',
      businessName: '소프트웨어',
      ceo: '최○○ 사장',
      title: '벤처기업 인증 받고 세제혜택까지, 일석이조!',
      content:
        '벤처기업 인증 절차를 몰라서 미루고 있었는데, 나라똔 컨설팅을 받고 쉽게 인증받았습니다. 세제혜택도 받게 되어 너무 좋아요.',
      date: '2024-07-22',
      supportAmount: '세제혜택',
      supportType: '벤처기업 인증',
      likes: 12,
    },
    {
      id: 5,
      category: '상담후기',
      businessName: '바이오업체',
      ceo: '정○○ 대표',
      title: '나라똔 전문가 상담 정말 꼼꼼하고 친절해요',
      content:
        '정부지원사업에 대해 아무것도 몰랐는데, 전문가분이 우리 회사에 맞는 사업을 추천해주시고 신청까지 도와주셨어요.',
      date: '2024-07-21',
      supportAmount: '맞춤형 지원',
      supportType: '전문가 상담',
      likes: 9,
    },
    {
      id: 6,
      category: '창업지원',
      businessName: '스타트업',
      ceo: '윤○○ 사장',
      title: '정부지원금 신청 과정이 이렇게 쉬울 줄 몰랐어요',
      content:
        '혼자서는 엄두도 못 냈을 정부지원금 신청을 나라똔과 함께하니 정말 쉽게 진행할 수 있었습니다.',
      date: '2024-07-20',
      supportAmount: '창업지원금',
      supportType: '정부지원금',
      likes: 16,
    },
    {
      id: 7,
      category: '창업지원',
      businessName: 'IT솔루션',
      ceo: '장○○ 대표',
      title: '청년창업지원 받을 수 있을지 몰랐는데 성공했어요',
      content:
        '나이 제한 때문에 포기했던 청년창업지원금을 나라똔 도움으로 받게 되었습니다. 정말 감사합니다!',
      date: '2024-07-19',
      supportAmount: '청년창업지원금',
      supportType: '청년창업사관학교',
      likes: 21,
    },
    {
      id: 8,
      category: '인증/평가',
      businessName: '유통업체',
      ceo: '신○○ 사장',
      title: '인증심사관님이 정말 세심하게 도와주셨어요',
      content:
        '인증 심사 준비하면서 놓친 부분들을 하나하나 짚어주셔서 한 번에 통과할 수 있었습니다.',
      date: '2024-07-18',
      supportAmount: '인증 지원',
      supportType: '인증 컨설팅',
      likes: 14,
    },
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'R&D지원', label: 'R&D지원' },
    { value: '세무상담', label: '세무상담' },
    { value: '수출지원', label: '수출지원' },
    { value: '인증/평가', label: '인증/평가' },
    { value: '창업지원', label: '창업지원' },
    { value: '상담후기', label: '상담후기' },
  ];

  const filteredTestimonials =
    selectedCategory === 'all'
      ? testimonials
      : testimonials.filter((item) => item.category === selectedCategory);

  return (
    <div className="business-voice-container">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>사업자 목소리</h1>
          <p>나라똔과 함께 성장한 기업들의 생생한 이야기</p>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>2,500+</h3>
            <p>지원받은 기업 수</p>
          </div>
          <div className="stat-item">
            <h3>850억원</h3>
            <p>누적 지원금액</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>고객 만족도</p>
          </div>
          <div className="stat-item">
            <h3>3.5일</h3>
            <p>평균 처리 기간</p>
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="filter-section">
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 사례 목록 */}
      <section className="testimonials-section">
        <div className="testimonials-grid">
          {filteredTestimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="card-header">
                <div className="business-info">
                  <h3>{item.businessName}</h3>
                  <span className="ceo-name">{item.ceo}</span>
                </div>
                <span className="support-amount">{item.supportAmount}</span>
              </div>

              <h4 className="testimonial-title">{item.title}</h4>
              <p className="testimonial-content">{item.content}</p>

              <div className="card-footer">
                <span className="support-type">
                  <i className="fas fa-tag"></i> {item.supportType}
                </span>
                <span className="date">
                  <i className="fas fa-calendar"></i> {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>귀사도 정부지원금의 혜택을 받아보세요</h2>
          <p>나라똔 전문가가 맞춤형 지원사업을 찾아드립니다</p>
          <button className="cta-button">무료 상담 신청하기</button>
        </div>
      </section>
    </div>
  );
};

export default BusinessVoice;
