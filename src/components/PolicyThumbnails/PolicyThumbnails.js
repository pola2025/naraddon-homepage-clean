import React, { useMemo } from 'react';
import Link from 'next/link';
import usePolicyNews from '@/hooks/usePolicyNews';
import './PolicyThumbnails.css';

const badgeClassMap = {
  NEW: 'new',
  HOT: 'hot',
  추천: 'recommend',
  중요: 'important',
};

const categoryIconMap = {
  funding: '💰',
  support: '🤝',
  startup: '🚀',
  rnd: '🔬',
  policy: '📑',
};

const categoryLabelMap = {
  funding: '정책자금',
  support: '지원사업',
  startup: '창업지원',
  rnd: 'R&D',
  policy: '정책해설',
};

const PolicyThumbnails = () => {
  const { items, isLoading, error, refetch } = usePolicyNews({ limit: 8 });
  const thumbnails = useMemo(() => items.slice(0, 4), [items]);

  const renderGrid = () => {
    if (isLoading && thumbnails.length === 0) {
      return (
        <div className="thumbnails-status">
          <p>정책 소식을 불러오는 중입니다...</p>
        </div>
      );
    }

    if (error && thumbnails.length === 0) {
      return (
        <div className="thumbnails-status thumbnails-status--error">
          <p>{error}</p>
          <button type="button" className="thumbnails-status__retry" onClick={() => refetch()}>
            다시 시도하기
          </button>
        </div>
      );
    }

    if (thumbnails.length === 0) {
      return (
        <div className="thumbnails-status">
          <p>표시할 정책 소식이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="thumbnails-grid">
        {thumbnails.map((item) => (
          <Link key={item.id} href={`/policy-analysis?id=${item.id}`} className="thumbnail-item">
            <div className="thumbnail-image-wrapper">
              <img src={item.thumbnail} alt={item.title} className="thumbnail-image" />
              {item.isPinned ? (
                <div className="pinned-badge">
                  <i className="fas fa-thumbtack" />
                </div>
              ) : null}
              {item.badge ? (
                <div className={`thumbnail-badge badge-${badgeClassMap[item.badge] || 'default'}`}>
                  {item.badge}
                </div>
              ) : null}
              <div className="thumbnail-overlay">
                <p className="overlay-description">{item.description || item.excerpt}</p>
                <span className="read-more">자세히 보기 →</span>
              </div>
            </div>

            <div className="thumbnail-info">
              <div className="category-tag">
                <span className="category-icon">{categoryIconMap[item.category] || '📌'}</span>
                <span className="category-name">{categoryLabelMap[item.category] || '정책정보'}</span>
              </div>

              <h3 className="thumbnail-title">{item.title}</h3>

              <div className="thumbnail-meta">
                <span className="thumbnail-date">
                  <i className="far fa-calendar" /> {item.dateText || item.createdAt}
                </span>
                <span className="thumbnail-views">
                  <i className="far fa-eye" /> {item.views?.toLocaleString?.() ?? item.views ?? 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <section className="policy-thumbnails-section">
      <div className="container">
        <div className="thumbnails-header">
          <div className="thumbnails-heading">
            <span className="thumbnails-eyebrow">나라똔에서 전해드리는</span>
            <h3 className="thumbnails-title">정책소식</h3>
            <p className="thumbnails-subtitle">
              최신 정책과 지원사업 소식을 인증 심사관 시선으로 빠르게 전해드립니다
            </p>
          </div>
          <Link href="/policy-analysis" className="thumbnails-action">
            <span>전체보기</span>
            <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {renderGrid()}

        <div className="thumbnails-footer" />
      </div>
    </section>
  );
};

export default PolicyThumbnails;
