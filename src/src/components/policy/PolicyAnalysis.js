'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PolicyNewsSection from '../PolicyNewsSection/PolicyNewsSection';
import './PolicyAnalysis.css';

const PolicyAnalysis = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(5); // 5개로 줄여서 높이 맞춤

  // 카테고리 정의
  const categories = [
    { id: 'all', name: '전체', icon: 'fas fa-th' },
    { id: 'government', name: '정부정책자금', icon: 'fas fa-landmark' },
    { id: 'support', name: '정부지원자금', icon: 'fas fa-hand-holding-usd' },
    { id: 'manufacturing', name: '제조업특화자금', icon: 'fas fa-industry' },
    { id: 'other', name: '기타자금', icon: 'fas fa-ellipsis-h' },
  ];

  // Unsplash 이미지 풀
  const unsplashImages = {
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

  // 랜덤 이미지 선택 함수
  const getRandomImage = (category) => {
    const images = unsplashImages[category] || unsplashImages.other;
    return images[Math.floor(Math.random() * images.length)];
  };

  // 샘플 데이터 생성
  const generateSamplePosts = () => {
    const titles = {
      government: [
        '2024년 중소기업 R&D 지원사업 심층 분석',
        '정부 창업지원금 선정 평가 기준 완전 정복',
        '스타트업 육성 정책자금 활용 전략',
        '혁신성장 벤처펀드 투자 유치 가이드',
        '기술보증기금 보증 한도 확대 방안',
      ],
      support: [
        '소상공인 정책자금 대출 심사 통과 전략',
        '코로나19 피해 지원금 신청 완벽 가이드',
        '청년창업 특별자금 200% 활용법',
        '재창업 지원금 선정률 높이는 노하우',
        '여성기업 전용자금 신청 전략',
      ],
      manufacturing: [
        '스마트공장 구축 지원사업 ROI 분석',
        '제조업 디지털 전환 보조금 활용법',
        '친환경 설비 투자 지원금 극대화 전략',
        '자동화 설비 도입 정부 지원 프로그램',
        '품질인증 획득 지원사업 완벽 가이드',
      ],
      other: [
        '수출바우처 사업 200% 활용 전략',
        '해외진출 지원사업 선정 노하우',
        '지식재산권 출원 지원금 활용법',
        '컨설팅 바우처 효과적 활용 방안',
        'ESG 경영 지원사업 신청 가이드',
      ],
    };

    const posts = [];
    let id = 1;

    Object.keys(titles).forEach((category) => {
      titles[category].forEach((title, index) => {
        const authorIndex = Math.floor(Math.random() * 4);
        const titleIndex = Math.floor(Math.random() * 3);
        posts.push({
          id: id++,
          title: title,
          excerpt: `${title}에 대한 전문가 분석 리포트. 선정률을 높이는 핵심 전략과 실무 팁을 제공합니다. 실제 선정 사례와 심사 기준 분석을 통해 성공률을 극대화하는 방법을 제시합니다.`,
          thumbnail: getRandomImage(category),
          author: ['김철수', '이영희', '박민수', '정수진'][authorIndex],
          authorTitle: ['수석 기업심사관', '선임 기업심사관', '책임 기업심사관'][titleIndex],
          date: `2024.03.${String(20 - index).padStart(2, '0')}`,
          views: Math.floor(Math.random() * 5000) + 1000,
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 50) + 5,
          readTime: Math.floor(Math.random() * 10) + 5,
          category: category,
          tags: ['정책자금', '지원사업', '선정전략', '실무가이드'],
        });
      });
    });

    return posts.sort((a, b) => b.views - a.views);
  };

  // 반응형에서도 처리
  useEffect(() => {
    const generatedPosts = generateSamplePosts();
    setPosts(generatedPosts);
    setTopPosts(generatedPosts.slice(0, 7)); // TOP 7로 확장
  }, []);

  // TOP 5 자동 롤링
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTopIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 카테고리 필터링
  const filteredPosts = posts.filter((post) => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    const searchMatch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // 게시글 보기
  const handleViewPost = (postId) => {
    router.push(`/policy-analysis/${postId}`);
  };

  // 더보기
  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 5); // 5개씩 증가
  };

  // 글쓰기 페이지로 이동 (개발 단계에서는 경고 후 이동)
  const handleWriteClick = () => {
    alert('기업심사관 권한이 필요합니다. 관리자에게 문의해주세요.');
    // 개발 단계이므로 경고 후 페이지 이동
    router.push('/policy-analysis/write');
  };

  return (
    <div className="policy-analysis-page">
      {/* 페이지 헤더 (타이틀 섹션) */}
      <div className="page-header">
        <div className="header-content">
          <h1>정책분석</h1>
          <p>최신 정부 정책을 분석하여 사업에 도움을 드립니다</p>
        </div>
      </div>

      {/* 정책뉴스 섹션 추가 */}
      <PolicyNewsSection />

      {/* 구분선 */}
      <div className="section-divider"></div>

      {/* 정책분석 섹션 타이틀 */}
      <div className="analysis-section-header">
        <h2 className="analysis-title">
          <i className="fas fa-chart-line"></i> 정책분석
        </h2>
        <p className="analysis-subtitle">기업심사관이 분석한 정책자금 활용 전략</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="category-section">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* 글쓰기 버튼 */}
        <button className="write-button" onClick={handleWriteClick}>
          <i className="fas fa-pen"></i>
          <span>정책분석 작성</span>
        </button>
      </div>

      {/* 검색 바 */}
      <div className="search-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="정책명, 지원사업명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {/* 왼쪽: TOP 5 정책분석 */}
        <div className="top-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-crown"></i> Best 정책분석 게시글
            </h2>
          </div>

          {/* 메인 롤링 이미지 (1위~5위 순환) */}
          <div className="analysis-main-rolling">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className={`analysis-rolling-slide ${index === currentTopIndex ? 'active' : ''}`}
                onClick={() => handleViewPost(post.id)}
              >
                <div className="analysis-slide-image">
                  <img src={post.thumbnail} alt={post.title} />
                  <div className="analysis-slide-overlay">
                    <span className="rank-badge">TOP {index + 1}</span>
                    <span className="category-badge">
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                  </div>
                </div>
                <div className="analysis-slide-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="analysis-slide-meta">
                    <div className="author-info">
                      <span className="author">
                        <i className="fas fa-user-tie"></i> {post.author}
                      </span>
                      <span className="author-title">{post.authorTitle}</span>
                    </div>
                    <span className="views">
                      <i className="fas fa-eye"></i> {post.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* 인디케이터 */}
            <div className="analysis-rolling-indicators">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTopIndex ? 'active' : ''}`}
                  onClick={() => setCurrentTopIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* 하단 6개 그리드 (2~7위) */}
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
                    <span className="category">
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                    <span className="views">
                      <i className="fas fa-eye"></i> {post.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 게시글 목록 */}
        <div className="list-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-list"></i> 게시글 목록
            </h2>
            <span className="post-count">총 {filteredPosts.length}개</span>
          </div>

          <div className="posts-list">
            {filteredPosts.slice(0, visiblePosts).map((post) => (
              <article key={post.id} className="list-item" onClick={() => handleViewPost(post.id)}>
                <div className="item-thumbnail">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <span className="item-category">
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                    <span className="item-date">{post.date}</span>
                  </div>
                  <h3 className="item-title">{post.title}</h3>
                  <p className="item-excerpt">{post.excerpt}</p>
                  <div className="item-tags">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag">
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

          {/* 더보기 버튼 */}
          {visiblePosts < filteredPosts.length && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              <i className="fas fa-plus"></i> 더보기
            </button>
          )}
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="cta-section">
        <div className="cta-container">
          <h2>인증 기업심사관과 함께 정책자금을 찾아보시겠어요?</h2>
          <p>검증된 정책분석 전문가가 1:1로 맞춤 전략을 제안해드립니다.<br />대표님의 사업에 필요한 정책을 바로 안내해드립니다.</p>
          <div className="cta-stats">
            <div className="stat">
              <strong>93%</strong>
              <span>평균 선정률</span>
            </div>
            <div className="stat">
              <strong>2.3억원</strong>
              <span>평균 지원금</span>
            </div>
            <div className="stat">
              <strong>45%</strong>
              <span>심사기간 단축</span>
            </div>
          </div>
          <a href="/consultation" className="cta-button">
            <i className="fas fa-comments"></i> 무료 상담 신청하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default PolicyAnalysis;




