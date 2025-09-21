'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import './page.css';

// 예시 상세 데이터
const mockStoryDetail = {
  id: '1',
  category: '운영',
  categoryId: 'operation',
  title: '배달앱 수수료 절감 방법 공유합니다',
  content: `
    최근 배달앱 수수료가 너무 올라서 고민이 많으셨죠? 
    저도 처음엔 수수료 때문에 정말 막막했는데, 3년간 운영하면서 터득한 노하우를 공유드립니다.

    **1. 자체 배달 시스템 구축**
    처음엔 투자비용이 들지만, 장기적으로 보면 훨씬 이득입니다.
    - 단골 고객 대상으로 먼저 시작
    - 카카오톡 채널이나 네이버 스마트스토어 활용
    - 배달 직원 1명 채용 (월 250만원 정도)

    **2. 배달앱 복수 이용**
    한 곳에만 의존하지 말고 여러 플랫폼을 활용하세요.
    - 각 플랫폼별 프로모션 기간 활용
    - 수수료율 비교해서 유리한 곳 선택

    **3. 포장 주문 유도**
    포장 할인을 통해 배달앱 의존도를 줄이세요.
    - 포장 10% 할인
    - 포장 주문 시 음료 서비스

    이렇게 하니까 월 매출 5000만원 기준으로 수수료를 200만원 정도 절감할 수 있었습니다.
    다른 사장님들도 한 번 시도해보세요!
  `,
  author: {
    isAnonymous: false,
    businessType: '요식업',
    region: '서울 강남구',
    yearsInBusiness: 3,
    name: '김사장',
  },
  stats: {
    comments: 12,
    likes: 45,
    views: 234,
  },
  createdAt: new Date(Date.now() - 600000),
  comments: [
    {
      id: '1',
      author: '박사장',
      businessType: '카페',
      content: '좋은 정보 감사합니다! 저도 자체 배달 시스템 구축 고민 중이었는데 도움이 되네요.',
      createdAt: new Date(Date.now() - 300000),
      likes: 5,
    },
    {
      id: '2',
      author: '이사장',
      businessType: '치킨집',
      content: '포장 할인은 정말 효과적이더라구요. 저희도 15% 할인하니까 포장 주문이 확 늘었어요.',
      createdAt: new Date(Date.now() - 180000),
      likes: 3,
    },
  ],
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString();
};

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [story] = useState(mockStoryDetail);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 댓글 등록 로직
    setCommentText('');
  };

  return (
    <div className="story-detail-container">
      <div className="story-detail-header">
        <Link href="/ttontok" className="back-button">
          ← 목록으로
        </Link>
      </div>

      <div className="story-detail-content">
        <div className="story-detail-meta">
          <span className="category-badge">{story.category}</span>
          <h1 className="story-detail-title">{story.title}</h1>

          <div className="author-section">
            <div className="author-info">
              {story.author.isAnonymous ? (
                <span className="author-name">익명</span>
              ) : (
                <>
                  <span className="author-name">{story.author.name}</span>
                  <span className="separator">·</span>
                  <span>{story.author.businessType}</span>
                  <span className="separator">·</span>
                  <span>{story.author.region}</span>
                  <span className="separator">·</span>
                  <span>{story.author.yearsInBusiness}년차</span>
                </>
              )}
            </div>
            <div className="post-info">
              <span>{formatTimeAgo(story.createdAt)}</span>
              <span className="separator">·</span>
              <span>조회 {story.stats.views}</span>
            </div>
          </div>
        </div>

        <div className="story-detail-body">
          {story.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={index} className="content-subtitle">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <li key={index} className="content-list-item">
                  {paragraph.substring(2)}
                </li>
              );
            }
            if (paragraph.trim()) {
              return <p key={index}>{paragraph}</p>;
            }
            return null;
          })}
        </div>

        <div className="story-actions">
          <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
            👍 도움이 돼요 ({story.stats.likes + (liked ? 1 : 0)})
          </button>
          <button className="share-button">📤 공유하기</button>
        </div>

        <div className="comments-section">
          <h3 className="comments-title">댓글 {story.comments.length}</h3>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="경험이나 의견을 나눠주세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <button type="submit" disabled={!commentText.trim()}>
              댓글 작성
            </button>
          </form>

          <div className="comments-list">
            {story.comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    <span className="author-name">{comment.author}</span>
                    <span className="business-type">{comment.businessType}</span>
                  </div>
                  <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <button className="comment-like">👍 {comment.likes}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
