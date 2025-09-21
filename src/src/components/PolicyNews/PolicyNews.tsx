'use client';

import React from 'react';
import './PolicyNews.css';

// 정책소식 이미지 import
import boardImage1 from '@/assets/images/board/board_image_01.jpg';
import boardImage2 from '@/assets/images/board/board_image_02.jpg';
import boardImage3 from '@/assets/images/board/board_image_03.jpg';
import boardImage4 from '@/assets/images/board/board_image_04.png';

// 정책소식 데이터
const policyNewsData = [
  {
    id: 1,
    image: boardImage1,
    title: '2025년 중소기업 정책자금 지원사업 공고',
    date: '2025.09.01',
    badge: 'NEW',
    badgeType: 'new',
    link: '/board/policy-analysis',
    alt: '정책소식 1',
  },
  {
    id: 2,
    image: boardImage2,
    title: '소상공인 특별지원 프로그램 안내',
    date: '2025.08.30',
    badge: 'HOT',
    badgeType: 'hot',
    link: '/board/policy-analysis',
    alt: '정책소식 2',
  },
  {
    id: 3,
    image: boardImage3,
    title: '청년창업 지원사업 모집 공고',
    date: '2025.08.28',
    badge: '추천',
    badgeType: 'recommend',
    link: '/board/policy-analysis',
    alt: '정책소식 3',
  },
  {
    id: 4,
    image: boardImage4,
    title: 'R&D 지원사업 신청 안내',
    date: '2025.08.27',
    badge: 'NEW',
    badgeType: 'new',
    link: '/board/policy-analysis',
    alt: '정책소식 4',
  },
];

const PolicyNews = () => {
  const handleNewsClick = (link: string) => {
    // 게시판으로 이동 (백엔드 연동 시 수정)
    window.location.href = link;
  };

  return (
    <section className="policy-news-section">
      <div className="policy-news-container">
        <div className="section-header">
          <p className="section-description">나라똔에서 알려드리는 최신 정책소식</p>
        </div>

        <div className="policy-news-grid">
          {policyNewsData.map((item) => (
            <div
              key={item.id}
              className="policy-news-item"
              onClick={() => handleNewsClick(item.link)}
            >
              <div className={`policy-badge badge-${item.badgeType}`}>{item.badge}</div>
              <div className="policy-image-container">
                <img
                  src={typeof item.image === 'string' ? item.image : item.image.src}
                  alt={item.alt}
                  className="policy-image"
                />
              </div>
              <div className="policy-overlay">
                <h3 className="policy-title">{item.title}</h3>
                <div className="policy-date">
                  <span>📅</span> {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicyNews;
