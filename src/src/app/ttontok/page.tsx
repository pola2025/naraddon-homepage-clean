'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './page.css';

const TtontokPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // 카테고리 목록
  const categories = ['전체', '창업', '운영', '고충', '네트워킹', '지원', '성공사례', '질문'];

  // 게시물 데이터 (더 많은 데이터)
  const ttontokList = [
    {
      id: 1,
      isHot: true,
      isNew: false,
      category: '창업',
      title: '퇴사 후 6개월, 드디어 오픈했습니다',
      content:
        '30대 중반에 안정적인 직장을 그만두고 창업을 결심했습니다. 주변의 만류도 많았지만 꿈을 위해 도전했고, 드디어 오늘 가게 오픈합니다.',
      author: '김대표',
      business: '요식업',
      location: '서울',
      comments: 12,
      likes: 45,
      views: 234,
      date: '2025-01-09',
      time: '14:30',
    },
    {
      id: 2,
      isHot: false,
      isNew: true,
      category: '운영',
      title: '배달앱 수수료 절감 방법',
      content:
        '배달앱 수수료 때문에 고민이신 분들 많으시죠? 저희 가게는 자체 배달 시스템을 구축해서 월 200만원 이상 절감했습니다.',
      author: '이사장',
      business: '카페',
      location: '경기',
      comments: 8,
      likes: 23,
      views: 156,
      date: '2025-01-09',
      time: '14:00',
    },
    // ... 더 많은 게시물 데이터 추가
  ];

  // 좋아요 토글
  const toggleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // 카테고리 필터링
  const filteredPosts =
    selectedCategory === '전체'
      ? ttontokList
      : ttontokList.filter((post) => post.category === selectedCategory);

  // 정렬
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') return b.id - a.id;
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'views') return b.views - a.views;
    return 0;
  });

  return (
    <div className="ttontok-page">
      {/* 헤더 */}
      <header className="ttontok-header">
        <div className="header-content">
          <h1>💬 똔톡</h1>
          <p>사업자들의 생생한 경험과 노하우를 공유하는 커뮤니티</p>
        </div>
      </header>

      {/* 카테고리 필터 */}
      <div className="category-filter">
        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 및 글쓰기 */}
      <div className="ttontok-controls">
        <div className="sort-options">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="views">조회순</option>
          </select>
        </div>
        <Link href="/ttontok/write" className="write-button">
          ✏️ 글쓰기
        </Link>
      </div>

      {/* 게시물 리스트 */}
      <div className="ttontok-list">
        <table className="ttontok-table">
          <thead>
            <tr>
              <th className="th-category">카테고리</th>
              <th className="th-title">제목</th>
              <th className="th-author">작성자</th>
              <th className="th-stats">추천</th>
              <th className="th-stats">댓글</th>
              <th className="th-stats">조회</th>
              <th className="th-date">작성일</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((post) => (
              <tr key={post.id} className="post-row">
                <td className="td-category">
                  <span className={`category-badge category-${post.category}`}>
                    {post.category}
                  </span>
                </td>
                <td className="td-title">
                  <Link href={`/ttontok/${post.id}`} className="post-link">
                    <span className="post-title">
                      {post.isHot && <span className="badge-hot">🔥</span>}
                      {post.isNew && <span className="badge-new">NEW</span>}
                      {post.title}
                    </span>
                    <span className="post-preview">{post.content}</span>
                  </Link>
                </td>
                <td className="td-author">
                  <div className="author-info">
                    <span className="author-name">{post.author}</span>
                    {post.business && <span className="author-business">{post.business}</span>}
                  </div>
                </td>
                <td className="td-stats">
                  <button
                    className={`like-btn ${likedPosts.includes(post.id) ? 'liked' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    {likedPosts.includes(post.id) ? '❤️' : '🤍'}
                    <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                  </button>
                </td>
                <td className="td-stats">
                  <span className="comment-count">💬 {post.comments}</span>
                </td>
                <td className="td-stats">
                  <span className="view-count">👁 {post.views}</span>
                </td>
                <td className="td-date">
                  <div className="date-info">
                    <span className="date">{post.date}</span>
                    <span className="time">{post.time}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button className="page-btn prev">이전</button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">4</button>
        <button className="page-btn">5</button>
        <button className="page-btn next">다음</button>
      </div>
    </div>
  );
};

export default TtontokPage;
