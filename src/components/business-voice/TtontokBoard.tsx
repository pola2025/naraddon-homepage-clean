"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import './ttontok-board.css';

const CATEGORY_LABELS: Record<string, string> = {
  funding: '자금',
  tax: '세무',
  hr: '노무',
  marketing: '마케팅',
  strategy: '전략',
  tech: '기술',
  legal: '법무',
  etc: '기타',
};

interface TtontokPostSummary {
  id: string;
  title: string;
  category: string;
  nickname: string;
  tags: string[];
  replyCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

interface TtontokReplyItem {
  id: string;
  content: string;
  nickname: string;
  role: 'general' | 'certified_examiner' | 'expert';
  isAccepted: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TtontokPostDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  nickname: string;
  tags: string[];
  replyCount: number;
  likeCount: number;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
  replies?: TtontokReplyItem[];
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const TtontokBoard = () => {
  const [posts, setPosts] = useState<TtontokPostSummary[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<TtontokPostDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    category: 'funding',
    title: '',
    nickname: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      setPostsError(null);
      const response = await fetch('/api/business-voice/ttontok?limit=12');
      if (!response.ok) {
        throw new Error('게시글을 불러오지 못했습니다.');
      }
      const data = await response.json();
      setPosts(data.items ?? []);
      if (!selectedPostId && data.items?.length) {
        setSelectedPostId(data.items[0].id);
      }
    } catch (error) {
      console.error('[ttontok] failed to load posts', error);
      setPostsError('게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchPostDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      setDetailError(null);
      const response = await fetch(`/api/business-voice/ttontok/${id}?includeReplies=true&replyLimit=20`);
      if (!response.ok) {
        throw new Error('게시글 상세를 불러오지 못했습니다.');
      }
      const data = await response.json();
      setSelectedPost(data as TtontokPostDetail);
    } catch (error) {
      console.error('[ttontok] failed to load detail', error);
      setDetailError('게시글 상세를 불러오지 못했습니다.');
      setSelectedPost(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPostId) {
      void fetchPostDetail(selectedPostId);
    }
  }, [selectedPostId]);

  const bestPosts = useMemo(() => posts.filter((post) => post.replyCount > 0).slice(0, 2), [posts]);
  const latestPosts = useMemo(() => posts.slice(0, 6), [posts]);

  const handleFormChange = (field: 'category' | 'title' | 'nickname' | 'content', value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formState.title.trim() || !formState.content.trim() || !formState.nickname.trim()) {
      setSubmitMessage('제목, 닉네임, 내용을 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const response = await fetch('/api/business-voice/ttontok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formState.category,
          title: formState.title,
          content: formState.content,
          nickname: formState.nickname,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? '게시글을 등록하지 못했습니다.');
      }

      setFormState((prev) => ({ ...prev, title: '', content: '' }));
      setSubmitMessage('게시글이 등록되었습니다. 검토 후 노출됩니다.');
      await fetchPosts();
    } catch (error) {
      console.error('[ttontok] failed to submit', error);
      setSubmitMessage((error as Error).message ?? '게시글을 등록하지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ttontok-section" className="ttontok-board">
      <div className="section-header">
        <h2>똔톡 커뮤니티</h2>
        <p>실제 사업자들의 질문과 인증 전문가의 답변을 확인해 보세요.</p>
      </div>

      <div className="ttontok-content">
        <div className="ttontok-latest">
          <div className="ttontok-panel-header">
            <h3>최신 똔톡</h3>
            <Link href="/ttontok" className="panel-link">
              전체 보기
            </Link>
          </div>
          {loadingPosts ? (
            <ul className="ttontok-latest-list ttontok-latest-list--loading">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={index} className="ttontok-latest-item skeleton" />
              ))}
            </ul>
          ) : postsError ? (
            <p className="ttontok-error">{postsError}</p>
          ) : (
            <ul className="ttontok-latest-list">
              {latestPosts.map((post) => (
                <li
                  key={post.id}
                  className={`ttontok-latest-item${selectedPostId === post.id ? ' active' : ''}`}
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <div className="ttontok-latest-meta">
                    <span className={`ttontok-category-badge category-${post.category}`}>
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span className="ttontok-meta-text">{formatDateTime(post.createdAt)}</span>
                  </div>
                  <p className="ttontok-latest-title">{post.title}</p>
                  <div className="ttontok-latest-stats">
                    <span>댓글 {post.replyCount}</span>
                    <span>조회 {post.viewCount}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ttontok-detail">
          <div className="ttontok-panel-header">
            <h3>상세 보기</h3>
          </div>
          {loadingDetail ? (
            <div className="ttontok-detail-skeleton">로딩 중...</div>
          ) : detailError ? (
            <p className="ttontok-error">{detailError}</p>
          ) : selectedPost ? (
            <article className="ttontok-detail-card">
              <header className="ttontok-detail-header">
                <span className={`ttontok-category-badge category-${selectedPost.category}`}>
                  {CATEGORY_LABELS[selectedPost.category] ?? selectedPost.category}
                </span>
                <h4>{selectedPost.title}</h4>
                <div className="ttontok-detail-meta">
                  <span className="nickname">{selectedPost.nickname}</span>
                  <span>{formatDateTime(selectedPost.createdAt)}</span>
                  <span>댓글 {selectedPost.replyCount}</span>
                </div>
              </header>
              <p className="ttontok-detail-content">{selectedPost.content}</p>

              <section className="ttontok-replies">
                <h5>답변</h5>
                {selectedPost.replies && selectedPost.replies.length > 0 ? (
                  <ul className="ttontok-reply-list">
                    {selectedPost.replies.map((reply) => (
                      <li
                        key={reply.id}
                        className={`ttontok-reply-card role-${reply.role}${reply.isAccepted ? ' is-accepted' : ''}`}
                      >
                        <div className="ttontok-reply-header">
                          <span className="ttontok-reply-nickname">{reply.nickname}</span>
                          {reply.role !== 'general' ? (
                            <span className={`ttontok-reply-badge badge-${reply.role}`}>
                              {reply.role === 'certified_examiner' ? '인증 기업심사관' : '전문가'}
                            </span>
                          ) : null}
                          {reply.isAccepted ? <span className="ttontok-reply-badge badge-accepted">채택</span> : null}
                        </div>
                        <p className="ttontok-reply-content">{reply.content}</p>
                        <div className="ttontok-reply-footer">
                          <span>{formatDateTime(reply.createdAt)}</span>
                          <span>공감 {reply.likeCount}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ttontok-empty">등록된 답변이 없습니다.</p>
                )}
              </section>
            </article>
          ) : (
            <p className="ttontok-empty">게시글을 선택해 주세요.</p>
          )}
        </div>
      </div>

      <div className="ttontok-compose">
        <h3>똔톡에 질문 남기기</h3>
        <div className="ttontok-compose-grid">
          <label className="ttontok-compose-field">
            <span>카테고리</span>
            <select
              value={formState.category}
              onChange={(event) => handleFormChange('category', event.target.value)}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="ttontok-compose-field">
            <span>닉네임</span>
            <input
              type="text"
              value={formState.nickname}
              onChange={(event) => handleFormChange('nickname', event.target.value)}
              placeholder="커뮤니티 닉네임"
              maxLength={24}
            />
          </label>

          <label className="ttontok-compose-field ttontok-compose-title">
            <span>제목</span>
            <input
              type="text"
              value={formState.title}
              onChange={(event) => handleFormChange('title', event.target.value)}
              placeholder="질문 제목을 입력해 주세요"
              maxLength={200}
            />
          </label>
        </div>

        <label className="ttontok-compose-field ttontok-compose-content">
          <span>내용</span>
          <textarea
            rows={4}
            value={formState.content}
            onChange={(event) => handleFormChange('content', event.target.value)}
            placeholder="상황과 궁금한 점을 구체적으로 작성해 주세요"
            maxLength={5000}
          />
        </label>

        {submitMessage ? <p className="ttontok-submit-message">{submitMessage}</p> : null}

        <div className="ttontok-compose-actions">
          <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '질문 등록하기'}
          </button>
        </div>
      </div>

      {bestPosts.length > 0 ? (
        <div className="ttontok-best">
          <div className="ttontok-panel-header">
            <h3>답변이 활발한 질문</h3>
          </div>
          <div className="ttontok-best-grid">
            {bestPosts.map((post) => (
              <article key={post.id} className="ttontok-best-card" onClick={() => setSelectedPostId(post.id)}>
                <div className="ttontok-best-header">
                  <span className={`ttontok-category-badge category-${post.category}`}>
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                  <span className="ttontok-meta-text">댓글 {post.replyCount}</span>
                </div>
                <h4>{post.title}</h4>
                <p>작성자 {post.nickname}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default TtontokBoard;