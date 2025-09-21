import React from 'react';
import './CustomerReviews.css';

const CustomerReviews = () => {
  const testimonials = [
    {
      id: 1,
      name: '김○○ 대표',
      company: '제조업 / 경기도',
      image: `/images/testimonial1.jpg`,
      rating: 5,
      content:
        '처음엔 정책자금이 막막했는데, 나라똔에서 연결해준 기업심사관님 덕분에 <span class="keyword">편리하게</span> 진행할 수 있었습니다. 복잡한 서류 작업도 체계적으로 도와주셔서 정말 <span class="keyword">신뢰</span>가 갔어요.',
    },
    {
      id: 2,
      name: '이○○ 대표',
      company: 'IT 스타트업 / 서울',
      image: `/images/testimonial2.jpg`,
      rating: 5,
      content:
        '나라똔의 <span class="keyword">안심 보증제도</span> 덕분에 믿고 기업심사관을 통해 정책자금을 신청할 수 있었습니다. 기업심사관님의 꼼꼼한 컨설팅 덕분에 어려운 심사도 <span class="keyword">해결</span>할 수 있었고, 나라똔의 보증이 있어서 더욱 <span class="keyword">신뢰</span>할 수 있었어요.',
    },
    {
      id: 3,
      name: '박○○ 대표',
      company: '바이오 기업 / 대전',
      image: `/images/testimonial3.jpg`,
      rating: 5,
      content:
        '여러 곳에서 거절당했던 정책자금을 나라똔과 함께 <span class="keyword">성공적</span>으로 받을 수 있었습니다. 무엇보다 나라똔의 보증제도가 있어서 <span class="keyword">신뢰</span>하고 진행할 수 있었고, 기업심사관님의 노하우가 정말 대단했습니다.',
    },
    {
      id: 4,
      name: '최○○ 대표',
      company: '유통업 / 부산',
      image: `/images/testimonial4.jpg`,
      rating: 5,
      content:
        '나라똔의 사전 심사 시스템이 정말 <span class="keyword">편리</span>했습니다. 우리 회사 상황에 맞는 정책자금을 추천받고, 기업심사관님과 함께 차근차근 준비해서 좋은 결과를 얻었습니다.',
    },
    {
      id: 5,
      name: '한○○ 대표',
      company: '헬스케어 / 대구',
      image: `/images/testimonial5.jpg`,
      rating: 5,
      content:
        '정책자금 신청이 처음이라 걱정이 많았는데, 나라똔의 <span class="keyword">체계적인</span> 시스템과 기업심사관님의 전문적인 도움으로 <span class="keyword">성공적</span>으로 자금을 확보했습니다.',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="highlight">나라똔</span>
            <span className="mobile-break">과 함께</span>
            <span className="mobile-newline">
              <br />
            </span>
            <span className="mobile-break">자금을 확보한 기업들</span>
          </h2>
          <p className="section-subtitle">실제 고객들의 생생한 성공 스토리를 들어보세요</p>
        </div>

        <div className="testimonials-wrapper">
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={`${testimonial.name} 인터뷰`} />
                  <div className="overlay-content">
                    <div className="rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="customer-info">
                      <div className="customer-details">
                        <div className="customer-name">{testimonial.name}</div>
                        <div className="customer-company">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                  <div className="quote-icon">"</div>
                </div>
                <div className="testimonial-body">
                  <div
                    className="testimonial-content"
                    dangerouslySetInnerHTML={{ __html: testimonial.content }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-wrapper">
          <a href="/testimonials" className="cta-button">
            더 많은 고객 후기 보기
          </a>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
