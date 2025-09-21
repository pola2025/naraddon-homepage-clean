'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './PolicyNewsDetail.css';

const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const formatDate = (value) => {
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

const PolicyNewsDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch(`/api/policy-news/${params.id}?countView=true`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error?.message || '게시글을 불러오지 못했습니다.');
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        setPost(data.post);

        const relatedResponse = await fetch('/api/policy-news?limit=6', { cache: 'no-store' });
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const filtered = (relatedData.posts || [])
            .filter((item) => (item._id || item.id) !== (data.post._id || data.post.id))
            .slice(0, 3);
          setRelatedNews(filtered);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleDelete = async () => {
    const password = window.prompt('게시글 비밀번호를 입력해주세요.');
    if (!password) {
      return;
    }
    try {
      const response = await fetch(`/api/policy-news/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result?.message || '삭제에 실패했습니다.');
        return;
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/policy-analysis');
    } catch (error) {
      console.error('게시글 삭제 실패', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: stripHtml(post.excerpt || post.content || ''),
        url: window.location.href,
      });
      return;
    }
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert('링크가 복사되었습니다.'))
      .catch(() => alert('공유 기능을 사용할 수 없습니다.'));
  };

  const plainTags = useMemo(() => (Array.isArray(post?.tags) ? post.tags : []), [post]);

  if (isLoading) {
    return (
      <div className="policy-news-detail">
        <div className="detail-container loading">
          <p>게시글을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="policy-news-detail">
        <div className="detail-container error">
          <p>{errorMessage}</p>
          <button className="back-button" onClick={() => router.push('/policy-analysis')}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const createdDate = formatDate(post.createdAt);
  const views = typeof post.views === 'number' ? post.views : 0;
  const likes = typeof post.likes === 'number' ? post.likes : 0;
  const comments = typeof post.comments === 'number' ? post.comments : 0;
  const excerpt = post.excerpt || stripHtml(post.content || '').slice(0, 120);

  return (
    <div className="policy-news-detail">
      <div className="detail-container">
        <div className="detail-header">
          <div>
            <h1 className="news-title">{post.title}</h1>
            <div className="news-meta">
              <span className="meta-item">
                <i className="far fa-calendar"></i> {createdDate}
              </span>
              <span className="meta-item">
                <i className="far fa-eye"></i> 조회수 {views.toLocaleString()}
              </span>
              <span className="meta-item">
                <i className="far fa-heart"></i> 관심 {likes}
              </span>
              <span className="meta-item">
                <i className="far fa-comment"></i> 댓글 {comments}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button className="delete-btn" onClick={handleDelete}>
              <i className="fas fa-trash"></i> 삭제
            </button>
            <button className="share-btn" onClick={handleShare}>
              <i className="fas fa-share-alt"></i> 공유
            </button>
          </div>
        </div>

        {post.thumbnail && (
          <div className="thumbnail-section">
            <img src={post.thumbnail} alt={post.title} />
          </div>
        )}

        {excerpt && (
          <div className="excerpt-section">
            <p>{excerpt}</p>
          </div>
        )}

        <div className="content-section" dangerouslySetInnerHTML={{ __html: post.content }} />

        {plainTags.length > 0 && (
          <div className="tags-section">
            {plainTags.map((tag) => (
              <span key={tag} className="news-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {relatedNews.length > 0 && (
        <section className="related-news">
          <div className="related-container">
            <h2>다른 정책소식</h2>
            <div className="related-list">
              {relatedNews.map((news) => {
                const relatedId = news._id || news.id;
                const relatedViews = typeof news.views === 'number' ? news.views : 0;
                return (
                  <div
                    key={relatedId}
                    className="related-item"
                    onClick={() => router.push(`/policy-news/${relatedId}`)}
                  >
                    <div className="related-thumbnail">
                      {news.thumbnail ? (
                        <img src={news.thumbnail} alt={news.title || '정책소식'} />
                      ) : (
                        <div className="thumbnail-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="related-content">
                      <span className="related-category">{news.category || '기타'}</span>
                      <h4 className="related-title">{news.title || '제목 미정'}</h4>
                      <div className="related-meta">
                        <span>{formatDate(news.createdAt)}</span>
                        <span>조회 {relatedViews.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="cta-container">
          <h2>정책자금 상담이 필요하신가요?</h2>
          <p>나라똔 전문 상담사가 맞춤형 지원을 도와드립니다.</p>
          <button className="cta-button" onClick={() => router.push('/consultation')}>
            <i className="fas fa-comments"></i> 상담 신청하기
          </button>
        </div>
      </section>
    </div>
  );
};

export default PolicyNewsDetail;
