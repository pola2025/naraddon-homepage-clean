'use client';



import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';

import './PolicyNewsSection.css';



import usePolicyNews from '@/hooks/usePolicyNews';



const PolicyNewsSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: posts, isLoading, error, refetch } = usePolicyNews({ limit: 12 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [writePassword, setWritePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const mobileListRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // 관리자 권한 설정 (향후 인증 연동 예정)
  const isAdmin = true;

  useEffect(() => {
    if (posts.length > 0) {
      setSelectedNewsId((prev) => (prev ?? posts[0].id));
      setCurrentSlide(0);
    } else {
      setSelectedNewsId(null);
      setCurrentSlide(0);
    }
  }, [posts]);


  const mainNewsList = useMemo(() => {
    if (posts.length === 0) {
      return [];
    }
    const prioritized = [...posts].sort((a, b) => {
      if (a.isMain !== b.isMain) {
        return a.isMain ? -1 : 1;
      }
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    return prioritized.slice(0, 5);
  }, [posts]);

  const latestNewsList = useMemo(() => posts.slice(0, 6), [posts]);

  useEffect(() => {
    const candidateId = searchParams.get('news') ?? searchParams.get('id');
    if (!candidateId || posts.length === 0) {
      return;
    }

    const exists = posts.some((post) => String(post.id) === String(candidateId));
    if (!exists) {
      return;
    }

    setSelectedNewsId(candidateId);

    const mainIndex = mainNewsList.findIndex((item) => String(item.id) === String(candidateId));
    if (mainIndex >= 0) {
      setCurrentSlide(mainIndex);
    }
  }, [searchParams, posts, mainNewsList]);

  useEffect(() => {
    const container = mobileListRef.current;
    if (!container) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;
      setCanScrollPrev(scrollLeft > 8);
      setCanScrollNext(scrollLeft < maxScrollLeft - 8);
    };

    updateScrollState();

    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [latestNewsList.length]);

  useEffect(() => {
    if (mainNewsList.length < 2) {
      return undefined;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainNewsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mainNewsList.length]);

  useEffect(() => {
    if (mainNewsList.length > 0 && !selectedNewsId) {
      setSelectedNewsId(mainNewsList[0].id);
    }
  }, [mainNewsList, selectedNewsId]);

  const handleNewsClick = (id) => {
    setSelectedNewsId(id);
    router.push(`/policy-news/${id}`);
  };

  const handleMoreClick = () => {
    router.push('/policy-news');
  };

  const scrollMobileNews = (direction) => {
    const container = mobileListRef.current;
    if (!container) {
      return;
    }

    const firstCard = container.firstElementChild;
    const fallbackWidth = container.clientWidth || 0;
    let scrollAmount = fallbackWidth;

    if (typeof window !== 'undefined') {
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
      const styles = window.getComputedStyle(container);
      const gapValue = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      scrollAmount = (cardWidth || fallbackWidth) + gapValue;
    }

    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScrollLeft = scrollWidth - clientWidth;
        setCanScrollPrev(scrollLeft > 8);
        setCanScrollNext(scrollLeft < maxScrollLeft - 8);
      });
    }
  };

  const handleWriteClick = () => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('policyNewsAuthorized');
      if (cached === 'true') {
        router.push('/policy-news/write');
        return;
      }
    }

    setWritePassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (isVerifyingPassword) {
      return;
    }
    setShowPasswordModal(false);
    setWritePassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const trimmed = writePassword.trim();
    if (!trimmed) {
      setPasswordError('비밀번호를 입력해 주세요.');
      return;
    }

    setIsVerifyingPassword(true);
    setPasswordError('');

    try {
      const response = await fetch('/api/policy-news/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: trimmed }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || '비밀번호 확인에 실패했습니다.');
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('policyNewsAuthorized', 'true');
      }

      setShowPasswordModal(false);
      setWritePassword('');
      setPasswordError('');
      router.push('/policy-news/write');
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : '비밀번호 확인 중 오류가 발생했습니다.',
      );
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="policy-news-section">
        <div className="policy-news-container loading">
          <p>게시글을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policy-news-section">
        <div className="policy-news-container error">
          <p>{error}</p>
          <button type="button" className="policy-news__retry-button" onClick={() => refetch()}>
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="policy-news-section">
        <div className="policy-news-container empty">
          <div className="policy-news-empty">
            <div className="policy-news__section-header policy-news__section-header--empty">
              <div className="policy-news__section-heading">
                <h2 className="policy-news__section-title">
                  <i className="fas fa-newspaper"></i> 정책소식
                </h2>
                <p className="policy-news__section-subtitle">최신 정책 동향과 정부 지원사업을 가장 빠르게 안내드립니다.</p>
                <p className="policy-news__section-caption">나라똔에서 최신 정부정책 소식을 전달합니다.</p>
              </div>
              <div className="policy-news__section-actions">
                <button className="policy-news__write-button" onClick={handleWriteClick}>
                  <i className="fas fa-pen"></i>
                  <span>정책소식 작성</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="policy-news-section">
      <div className="policy-news-container">
        <div className="policy-news__section-header">
          <div className="policy-news__section-heading">
            <h2 className="policy-news__section-title">
              <i className="fas fa-newspaper"></i> 정책소식
            </h2>
            <p className="policy-news__section-subtitle">
              나라똔에서 최신 정부정책 소식을 전달합니다.
            </p>
          </div>
          {isAdmin && (
            <div className="policy-news__section-actions">
              <button className="policy-news__write-button" onClick={handleWriteClick}>
                <i className="fas fa-pen"></i>
                <span>정책소식 작성</span>
              </button>
            </div>
          )}
        </div>

        <div className="news-content-wrapper">
          {mainNewsList.length > 0 && (
            <div className="main-news-slider">
              <div className="slider-container">
                {mainNewsList.map((news, index) => (
                  <div
                    key={news.id}
                    className={`slide-item ${index === currentSlide ? 'active' : ''} ${news.id === selectedNewsId ? 'highlighted' : ''}`}
                    onClick={() => handleNewsClick(news.id)}
                  >
                    <div className="slide-image">
                      <div className="slide-image-wrapper">
                        <Image
                          src={news.thumbnail}
                          alt={news.title}
                          width={400}
                          height={750}
                          unoptimized
                        />
                      </div>
                      <div className="slide-overlay">
                        {news.isPinned && (
                          <span className="news-badge pinned">
                            <i className="fas fa-thumbtack"></i> 고정
                          </span>
                        )}
                        {news.badge && <span className="news-badge info">{news.badge}</span>}
                        <span className="news-category">{news.category}</span>
                      </div>
                    </div>
                    <div className="slide-content">
                      <h3 className="slide-title">{news.title}</h3>
                      <p className="slide-excerpt">{news.excerpt}</p>
                      <div className="slide-meta">
                        <span className="news-date">
                          <i className="far fa-calendar"></i> {news.dateText}
                        </span>
                        <div className="news-stats">
                          <span>
                            <i className="far fa-eye"></i> {news.views.toLocaleString()}
                          </span>
                          <span>
                            <i className="far fa-heart"></i> {news.likes}
                          </span>
                          <span>
                            <i className="far fa-comment"></i> {news.comments}
                          </span>
                        </div>
                      </div>
                      {news.tags.length > 0 && (
                        <div className="slide-tags">
                          {news.tags.slice(0, 5).map((tag) => (
                            <span key={tag} className="news-tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {mainNewsList.length > 1 && (
                <>
                  <button
                    className="slider-control prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev - 1 + mainNewsList.length) % mainNewsList.length);
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="slider-control next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev + 1) % mainNewsList.length);
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
          )}

          <div className="news-list">
            <div className="list-header">
              <h3>최근 게시글</h3>
              <button className="more-btn" onClick={handleMoreClick}>
                전체보기 <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className="news-items-wrapper">
              <button
                type="button"
                className="news-items-control news-items-control--prev"
                onClick={() => scrollMobileNews('prev')}
                aria-label="이전 정책 소식 보기"
                disabled={!canScrollPrev}
              >
                <i className="fas fa-caret-left" aria-hidden="true" />
              </button>
              <div className="news-items" ref={mobileListRef}>
                {latestNewsList.map((news) => (
                  <div key={news.id} className="news-item" onClick={() => handleNewsClick(news.id)}>
                    <div className="news-item-thumbnail">
                      <Image src={news.thumbnail} alt={news.title} width={80} height={60} unoptimized />
                      {news.isPinned && (
                        <div className="pinned-icon">
                          <i className="fas fa-thumbtack"></i>
                        </div>
                      )}
                    </div>
                    <div className="news-item-content">
                      <div className="news-item-header">
                        <span className="news-item-category">{news.category}</span>
                        <span className="news-item-date">{news.dateText}</span>
                      </div>
                      <h4 className="news-item-title">{news.title}</h4>
                      <div className="news-item-meta">
                        <div className="news-item-stats">
                          <span>
                            <i className="far fa-eye"></i> {news.views.toLocaleString()}
                          </span>
                          <span>
                            <i className="far fa-heart"></i> {news.likes}
                          </span>
                          <span>
                            <i className="far fa-comment"></i> {news.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="news-items-control news-items-control--next"
                onClick={() => scrollMobileNews('next')}
                aria-label="다음 정책 소식 보기"
                disabled={!canScrollNext}
              >
                <i className="fas fa-caret-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      {showPasswordModal && (
        <div className="write-modal-overlay">
          <div className="write-modal">
            <div className="modal-header">
              <h2>정책소식 작성 인증</h2>
              <button
                type="button"
                className="modal-close"
                onClick={closePasswordModal}
                aria-label="닫기"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="modal-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="policy-news-password">
                  <i className="fas fa-lock"></i> 비밀번호 <span className="required">*</span>
                </label>
                <input
                  id="policy-news-password"
                  type="password"
                  value={writePassword}
                  onChange={(event) => {
                    setWritePassword(event.target.value);
                    if (passwordError) {
                      setPasswordError('');
                    }
                  }}
                  placeholder="관리자에게 발급받은 비밀번호를 입력하세요"
                  autoFocus
                />
              </div>
              {passwordError && <p className="password-error-text">{passwordError}</p>}
              <div className="form-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closePasswordModal}
                  disabled={isVerifyingPassword}
                >
                  <i className="fas fa-arrow-left"></i>
                  취소
                </button>
                <button type="submit" className="btn-submit" disabled={isVerifyingPassword}>
                  <i className="fas fa-check"></i>
                  {isVerifyingPassword ? '확인 중...' : '인증 후 작성하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default PolicyNewsSection;







