'use client';

import React, { useEffect, useState } from 'react';
import './PolicyNews.css';

import boardImage1 from '@/assets/images/board/board_image_01.jpg';
import boardImage2 from '@/assets/images/board/board_image_02.jpg';
import boardImage3 from '@/assets/images/board/board_image_03.jpg';
import boardImage4 from '@/assets/images/board/board_image_04.png';

const fallbackImages = [boardImage1, boardImage2, boardImage3, boardImage4];
const defaultBadges = [
  { label: 'NEW', type: 'new' },
  { label: 'HOT', type: 'hot' },
  { label: '추천', type: 'recommend' },
  { label: 'NEW', type: 'new' },
];

const formatDate = (value?: string) => {
  if (!value) {
    return '작성일 미정';
  }
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '작성일 미정';
    }
    return date.toLocaleDateString('ko-KR');
  } catch (error) {
    return '작성일 미정';
  }
};

interface PolicyNewsItem {
  id: string;
  title: string;
  createdAt?: string;
  thumbnail: string;
  badgeLabel?: string;
  badgeType?: string;
  category?: string;
}

const resolveBadgeType = (badge?: string) => {
  if (!badge) {
    return undefined;
  }
  const lower = badge.toLowerCase();
  if (lower.includes('hot')) {
    return 'hot';
  }
  if (lower.includes('new')) {
    return 'new';
  }
  if (lower.includes('추천') || lower.includes('best') || lower.includes('추천')) {
    return 'recommend';
  }
  return undefined;
};

const PolicyNews = () => {
  const [items, setItems] = useState<PolicyNewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      try {
        const response = await fetch('/api/policy-news?limit=4', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('게시글을 불러오지 못했습니다.');
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        const normalized = (data.posts || []).slice(0, 4).map((post: any, index: number) => {
          const fallback = fallbackImages[index % fallbackImages.length];
          const fallbackSrc = typeof fallback === 'string' ? fallback : fallback.src;
          const badgeLabel = post.badge || (post.isMain ? '추천' : defaultBadges[index % defaultBadges.length].label);
          const badgeType = resolveBadgeType(post.badge) || defaultBadges[index % defaultBadges.length].type;
          return {
            id: post._id || post.id,
            title: post.title || '제목 미정',
            createdAt: post.createdAt,
            thumbnail: post.thumbnail || fallbackSrc,
            badgeLabel,
            badgeType,
            category: post.category || '정책소식',
          };
        });
        setItems(normalized);
      } catch (error) {
        console.warn('[PolicyNews] load error', error);
        setItems([]);
      }
    };

    loadItems();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNewsClick = (id: string) => {
    window.location.href = `/policy-news/${id}`;
  };

  if (items.length === 0) {
    return (
      <section className="policy-news-section">
        <div className="policy-news-container empty">
          <div className="section-header">
            <p className="section-description">현재 표시할 정책소식이 없습니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="policy-news-section">
      <div className="policy-news-container">
        <div className="section-header">
          <p className="section-description">나라똔에서 전하는 최신 정책소식</p>
        </div>

        <div className="policy-news-grid">
          {items.map((item) => (
            <div key={item.id} className="policy-news-item" onClick={() => handleNewsClick(item.id)}>
              {item.badgeLabel && item.badgeType && (
                <div className={`policy-badge badge-${item.badgeType}`}>{item.badgeLabel}</div>
              )}
              <div className="policy-image-container">
                <img src={item.thumbnail} alt={item.title} className="policy-image" />
              </div>
              <div className="policy-overlay">
                <h3 className="policy-title">{item.title}</h3>
                <div className="policy-date">
                  <span>{item.category}</span> {formatDate(item.createdAt)}
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
