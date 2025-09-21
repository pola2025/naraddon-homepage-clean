'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PolicyNewsSection from '../PolicyNewsSection/PolicyNewsSection';
import './PolicyAnalysis.css';

const categories = [
  { id: 'all', name: '전체', icon: 'fas fa-th' },
  { id: 'government', name: '정부지원정책', icon: 'fas fa-landmark' },
  { id: 'support', name: '창업·경영지원', icon: 'fas fa-hand-holding-usd' },
  { id: 'manufacturing', name: '제조혁신', icon: 'fas fa-industry' },
  { id: 'other', name: '기타정책', icon: 'fas fa-ellipsis-h' },
];

const fallbackThumbnails = {
  government: [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
  ],
  support: [
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
    'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  ],
  manufacturing: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  ],
  other: [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  ],
};

const CATEGORY_KEYS = ['government', 'support', 'manufacturing', 'other'];

const stripHtml = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const formatDate = (value) => {
  if (!value) {
    return '게시일 미확인';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '게시일 미확인';
  }
  return date.toLocaleDateString('ko-KR');
};

const estimateReadTime = (content) => {
  const plain = stripHtml(content);
  if (!plain) {
    return 5;
  }
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const normalizeTags = (tags) =>
  Array.isArray(tags)
    ? tags
        .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
        .filter((tag) => tag.length > 0)
    : [];

const normalizeCategory = (value) => {
  if (!value) {
    return 'other';
  }
  const trimmed = value.toString().trim();
  const lower = trimmed.toLowerCase();
  if (CATEGORY_KEYS.includes(lower)) {
    return lower;
  }
  if (lower.startsWith('gov') || lower.includes('정부')) {
    return 'government';
  }
  if (lower.startsWith('supp') || lower.includes('지원')) {
    return 'support';
  }
  if (lower.startsWith('manu') || lower.includes('제조')) {
    return 'manufacturing';
  }
  return 'other';
};

const getFallbackThumbnail = (category, index = 0) => {
  const pool = fallbackThumbnails[category] || fallbackThumbnails.other;
  if (!pool || pool.length === 0) {
    return '';
  }
  return pool[index % pool.length];
};

const normalizePost = (rawPost, index) => {
  const normalizedCategory = normalizeCategory(rawPost?.category);
  const categoryMeta =
    categories.find((item) => item.id === normalizedCategory) ||
    categories.find((item) => item.id === 'other');

  const plainExcerpt = stripHtml(rawPost?.excerpt);
  const plainContent = stripHtml(rawPost?.content);
  const baseExcerpt = plainExcerpt || plainContent;
  const excerpt =
    baseExcerpt && baseExcerpt.length > 0
      ? baseExcerpt.length > 160
        ? `${baseExcerpt.slice(0, 160).trim()}...`
        : baseExcerpt
      : '상세 내용을 확인해 주세요.';

  const createdAtValue = rawPost?.createdAt ?? rawPost?.updatedAt ?? null;
  const createdAtTimestamp = createdAtValue ? new Date(createdAtValue).getTime() : null;

  const authorName =
    typeof rawPost?.examiner?.name === 'string' && rawPost.examiner.name.trim().length > 0
      ? rawPost.examiner.name.trim()
      : '정책 전문가';

  const authorCompany =
    typeof rawPost?.examiner?.companyName === 'string' &&
    rawPost.examiner.companyName.trim().length > 0
      ? rawPost.examiner.companyName.trim()
      : '정책분석센터';

  const title =
    typeof rawPost?.title === 'string' && rawPost.title.trim().length > 0
      ? rawPost.title.trim()
      : '정책분석 자료';

  const thumbnail =
    typeof rawPost?.thumbnail === 'string' && rawPost.thumbnail.trim().length > 0
      ? rawPost.thumbnail.trim()
      : getFallbackThumbnail(normalizedCategory, index);

  const tags = normalizeTags(rawPost?.tags);
  const readTime = estimateReadTime(rawPost?.content);

  const searchSource = [title, excerpt, authorName, authorCompany, tags.join(' ')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return {
    id: String(rawPost?._id ?? rawPost?.id ?? index),
    title,
    excerpt,
    content: rawPost?.content ?? '',
    thumbnail,
    author: authorName,
    authorTitle: authorCompany,
    date: formatDate(createdAtValue),
    category: normalizedCategory,
    categoryLabel: categoryMeta?.name ?? '기타정책',
    tags,
    views: typeof rawPost?.views === 'number' ? rawPost.views : 0,
    likes: typeof rawPost?.likes === 'number' ? rawPost.likes : 0,
    comments: typeof rawPost?.comments === 'number' ? rawPost.comments : 0,
    readTime,
    createdAtTimestamp,
    searchText: searchSource,
  };
};

const PolicyAnalysis = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadPosts = async () => {
      setIsLoading(true);
      setFetchError('');

      try {
        const response = await fetch('/api/policy-analysis?sort=views', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('정책분석 글을 불러오지 못했습니다.');
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload?.posts)
          ? payload.posts.map((item, index) => normalizePost(item, index))
          : [];

        if (isMounted) {
          setPosts(normalized);
        }
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }
        console.error('[PolicyAnalysis] fetch error', error);
        if (isMounted) {
          setPosts([]);
          setFetchError('정책분석 글을 불러오는 동안 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (posts.length === 0) {
      setTopPosts([]);
      return;
    }

    const sorted = [...posts].sort((a, b) => {
      if (b.views !== a.views) {
        return b.views - a.views;
      }
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }
      const timeA = a.createdAtTimestamp ?? 0;
      const timeB = b.createdAtTimestamp ?? 0;
      return timeB - timeA;
    });

    setTopPosts(sorted.slice(0, 7));
  }, [posts]);

  useEffect(() => {
    const limit = Math.min(5, topPosts.length);
    if (currentTopIndex >= limit && limit > 0) {
      setCurrentTopIndex(0);
    }
  }, [topPosts, currentTopIndex]);

  useEffect(() => {
    const limit = Math.min(5, topPosts.length);
    if (limit < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentTopIndex((prev) => ((prev + 1) % limit));
    }, 5000);

    return () => clearInterval(timer);
  }, [topPosts]);

  useEffect(() => {
    setVisiblePosts(5);
  }, [posts.length]);

  useEffect(() => {
    setVisiblePosts(5);
  }, [selectedCategory, searchTerm]);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return posts.filter((post) => {
      const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
      if (!categoryMatch) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      return post.searchText.includes(normalizedSearch);
    });
  }, [posts, searchTerm, selectedCategory]);

  const mainTopPosts = useMemo(() => topPosts.slice(0, 5), [topPosts]);
  const indicatorCount = mainTopPosts.length;

  const handleViewPost = (postId) => {
    router.push(`/policy-analysis/${postId}`);
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 5, filteredPosts.length));
  };

  const handleWriteClick = () => {
    alert('검증된 담당자만 접근할 수 있습니다. 관리자에게 문의해주세요.');
    router.push('/policy-analysis/write');
  };

  return (
    <div className="policy-analysis-page">
      <section className="expert-hero layout-hero relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <div className="layout-container">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">인증 기업심사관</span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              정책분석
              <span className="block text-blue-600">데이터 인사이트</span>
            </h1>
            <p className="mt-6 text-lg leading-7 text-slate-600">
              최신 정책 동향과 지원사업 데이터를 분석해 사업에 필요한 정보를 제공합니다.
              <span className="block sm:inline">신속한 정책 매칭과 실행 전략을 안내합니다.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/consultation-request#form-section"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-600"
              >
                <i className="fas fa-headset" aria-hidden="true" /> 현장 상담 신청
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="policy-analysis__news-section">
        <PolicyNewsSection />
      </section>

      <div className="section-divider"></div>

      <div className="analysis-section-header">
        <h2 className="analysis-title">
          <i className="fas fa-chart-line"></i> 정책분석
        </h2>
        <p className="analysis-subtitle">전문가가 분석한 정책 데이터를 한눈에 확인하세요.</p>
      </div>

      {fetchError && (
        <div className="policy-analysis__feedback policy-analysis__feedback--error" role="alert">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{fetchError}</span>
        </div>
      )}

      <div className="category-section">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              type="button"
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <button className="write-button" onClick={handleWriteClick} type="button">
          <i className="fas fa-pen"></i>
          <span>정책분석 작성</span>
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="제목, 정책명, 담당자를 검색하세요."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="main-content">
        <div className="top-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-crown"></i> Best 정책분석 게시글
            </h2>
          </div>

          {isLoading && posts.length === 0 ? (
            <div className="policy-analysis__feedback policy-analysis__feedback--loading">
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              <span>정책분석 글을 불러오는 중입니다...</span>
            </div>
          ) : mainTopPosts.length === 0 ? (
            <div className="policy-analysis__feedback policy-analysis__feedback--empty">
              <i className="fas fa-info-circle" aria-hidden="true"></i>
              <span>표시할 인기 정책분석 글이 없습니다.</span>
            </div>
          ) : (
            <>
              <div className="analysis-main-rolling">
                {mainTopPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`analysis-main-item ${index === currentTopIndex ? 'active' : ''}`}
                    onClick={() => handleViewPost(post.id)}
                  >
                    <div className="analysis-image">
                      <img src={post.thumbnail} alt={post.title} />
                      <span className="ranking-badge">TOP {index + 1}</span>
                    </div>
                    <div className="analysis-content">
                      <div className="analysis-meta">
                        <span className="category-badge">{post.categoryLabel}</span>
                        <span className="date">{post.date}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="analysis-stats">
                        <span>
                          <i className="fas fa-eye"></i> {post.views.toLocaleString()}
                        </span>
                        <span>
                          <i className="fas fa-heart"></i> {post.likes}
                        </span>
                        <span>
                          <i className="fas fa-comment"></i> {post.comments}
                        </span>
                        <span>
                          <i className="fas fa-clock"></i> {post.readTime}분
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {indicatorCount > 1 && (
                  <div className="analysis-indicators">
                    {Array.from({ length: indicatorCount }).map((_, index) => (
                      <button
                        key={`indicator-${index}`}
                        type="button"
                        className={`indicator ${index === currentTopIndex ? 'active' : ''}`}
                        onClick={() => setCurrentTopIndex(index)}
                        aria-label={`TOP ${index + 1} 게시글 보기`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="top-grid">
                {topPosts.slice(1, 7).map((post, index) => (
                  <div key={post.id} className="grid-item" onClick={() => handleViewPost(post.id)}>
                    <div className="grid-image">
                      <img src={post.thumbnail} alt={post.title} />
                      <span className="grid-rank">TOP {index + 2}</span>
                    </div>
                    <div className="grid-content">
                      <h4>{post.title}</h4>
                      <div className="grid-meta">
                        <span className="category">{post.categoryLabel}</span>
                        <span className="views">
                          <i className="fas fa-eye"></i> {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="list-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-list"></i> 게시글 목록
            </h2>
            <span className="post-count">총 {filteredPosts.length}건</span>
          </div>

          {isLoading && posts.length === 0 ? (
            <div className="policy-analysis__feedback policy-analysis__feedback--loading">
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              <span>정책분석 글을 불러오는 중입니다...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="policy-analysis__feedback policy-analysis__feedback--empty">
              <i className="fas fa-info-circle" aria-hidden="true"></i>
              <span>조건에 맞는 정책분석 글이 없습니다.</span>
            </div>
          ) : (
            <>
              <div className="posts-list">
                {filteredPosts.slice(0, visiblePosts).map((post) => (
                  <article key={post.id} className="list-item" onClick={() => handleViewPost(post.id)}>
                    <div className="item-thumbnail">
                      <img src={post.thumbnail} alt={post.title} />
                    </div>
                    <div className="item-content">
                      <div className="item-header">
                        <span className="item-category">{post.categoryLabel}</span>
                        <span className="item-date">{post.date}</span>
                      </div>
                      <h3 className="item-title">{post.title}</h3>
                      <p className="item-excerpt">{post.excerpt}</p>
                      <div className="item-tags">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={`${post.id}-tag-${idx}`} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="item-meta">
                        <div className="item-author-info">
                          <span className="item-author">
                            <i className="fas fa-user-tie"></i> {post.author}
                          </span>
                          <span className="author-title">{post.authorTitle}</span>
                        </div>
                        <span className="item-stats">
                          <span>
                            <i className="fas fa-eye"></i> {post.views.toLocaleString()}
                          </span>
                          <span>
                            <i className="fas fa-heart"></i> {post.likes}
                          </span>
                          <span>
                            <i className="fas fa-comment"></i> {post.comments}
                          </span>
                          <span>
                            <i className="fas fa-clock"></i> {post.readTime}분
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {visiblePosts < filteredPosts.length && (
                <button className="load-more-btn" onClick={handleLoadMore} type="button">
                  <i className="fas fa-plus"></i> 더보기
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <section className="policy-analysis__cta-section" aria-labelledby="policy-analysis-cta-title">
        <div className="policy-analysis__cta-container">
          <div className="policy-analysis__cta-banner">
            <div className="policy-analysis__cta-content">
              <p className="policy-analysis__cta-eyebrow">Policy Analysis</p>
              <h2 id="policy-analysis-cta-title" className="policy-analysis__cta-title">
                우리 전문가와 함께 정책자금을
                <br className="policy-analysis__cta-break" />
                찾아보시겠어요?
              </h2>
              <p className="policy-analysis__cta-description">
                검증된 정책분석 전문가가 1:1로 맞춤 전략을 제안해드립니다.
              </p>
            </div>
            <Link href="/consultation-request#form-section" className="policy-analysis__cta-button">
              상담 예약하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PolicyAnalysis;





