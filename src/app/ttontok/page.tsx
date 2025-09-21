'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import './page.css';
import './qa-section.css';

type SortOption = 'latest' | 'popular' | 'views';

type TtontokPost = {
  _id: string;
  category: string;
  title: string;
  content: string;
  nickname: string;
  isAnonymous: boolean;
  businessType?: string;
  region?: string;
  yearsInBusiness?: number | null;
  likes: number;
  comments: number;
  views: number;
  createdAt?: string | null;
};

const CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'startup', label: '창업' },
  { value: 'operation', label: '운영' },
  { value: 'trouble', label: '고충' },
  { value: 'network', label: '네트워킹' },
  { value: 'support', label: '지원' },
  { value: 'success', label: '성공사례' },
  { value: 'question', label: '질문' },
];

const CATEGORY_LABELS: Record<string, string> = CATEGORY_OPTIONS.filter((item) => item.value !== 'all').reduce(
  (acc, item) => {
    acc[item.value] = item.label;
    return acc;
  },
  {} as Record<string, string>
);

const SORT_LABELS: Record<SortOption, string> = {
  latest: '최신순',
  popular: '공감순',
  views: '조회순',
};

function formatDateParts(isoDate?: string | null) {
  if (!isoDate) {
    return { date: '-', time: '' };
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '-', time: '' };
  }

  const date = parsed.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const time = parsed.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return { date, time };
}

const CATEGORY_CLASS_PREFIX = 'category-';

const TtontokPage: React.FC = () => {
  const [posts, setPosts] = useState<TtontokPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ttontok/posts', {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('게시글을 불러오는 중 문제가 발생했습니다.');
        }

        const data = await response.json();
        if (!isMounted) {
          return;
        }
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted && isMounted) {
          console.error(err);
          setError('게시글을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts;
    }
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const sortedPosts = useMemo(() => {
    const items = [...filteredPosts];
    switch (sortBy) {
      case 'popular':
        return items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'views':
        return items.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'latest':
      default:
        return items.sort((a, b) => {
          const dateB = new Date(b.createdAt ?? 0).getTime();
          const dateA = new Date(a.createdAt ?? 0).getTime();
          return dateB - dateA;
        });
    }
  }, [filteredPosts, sortBy]);

  const toggleLike = (postId: string) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const renderCategoryButtons = () => (
    <div className="filter-container">
      {CATEGORY_OPTIONS.map((category) => (
        <button
          key={category.value}
          type="button"
          className={category.value === selectedCategory ? 'category-btn active' : 'category-btn'}
          onClick={() => setSelectedCategory(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="ttontok-page">
      <header className="ttontok-header">
        <div className="header-content">
          <h1>똔톡 광장</h1>
          <p>사업자들의 생생한 이야기와 고민을 나누는 커뮤니티입니다.</p>
        </div>
      </header>

      <div className="category-filter">{renderCategoryButtons()}</div>

      <div className="ttontok-controls">
        <div className="sort-options">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="sort-select"
            aria-label="게시글 정렬 기준"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Link href="/ttontok/write" className="write-button">
          ✍ 글쓰기
        </Link>
      </div>

      {/* 실시간 인기 Q&A 섹션 */}
      <div className="qa-top-section">
        <div className="section-header">
          <h3>🔥 지금 가장 뜨거운 질문</h3>
          <div className="section-badge">실시간 인기 Q&A</div>
        </div>

        {/* 인기 질문과 답변 */}
        <div className="qa-container">
          {/* 질문 1 */}
          <div className="qa-item">
            <div className="qa-question">
              <div className="qa-question-header">
                <div className="qa-question-meta">
                  <span className="qa-rank">🥇 1위</span>
                  <span className="category-badge category-수수료">수수료</span>
                  <span className="qa-author">예비창업자</span>
                  <span className="qa-time">10분 전</span>
                </div>
                <div className="qa-stats">
                  <span>👁 523</span>
                  <span>💬 5</span>
                </div>
              </div>
              <h3 className="qa-question-title">
                <span className="badge-hot">🔥</span>
                배달앱 수수료가 너무 비싸서 힘들어요
              </h3>
              <p className="qa-question-content">
                저는 치킨집을 운영하고 있는데요, 배달앱 수수료가 정말 너무 비싸서 힘듭니다.
                배민, 쿠팡이츠, 요기요 다 사용하고 있는데 수수료가 15~20%나 되네요.
                거기에 광고비까지 내면 거의 남는게 없어요. 다른 사장님들은 어떻게 하고 계신가요?
              </p>
            </div>

            <div className="qa-answers">
              <div className="qa-answer best-answer">
                <div className="answer-header">
                  <span className="answerer">카페사장</span>
                  <span className="answer-badge">✓ 베스트</span>
                  <span className="answer-time">5분 전</span>
                </div>
                <p className="answer-content">
                  저도 같은 고민 많이 했었는데요, 자체 배달 시스템을 만드세요.
                  인스타그램이나 네이버 스마트스토어로 주문받고 직접 배달하면 수수료를 크게 줄일 수 있습니다.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 23</button>
                </div>
              </div>

              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer">치킨집10년차</span>
                  <span className="answer-time">8분 전</span>
                </div>
                <p className="answer-content">
                  배달앱 완전히 끊기는 어렵지만, 비중을 줄이는게 답입니다.
                  네이버 스마트플레이스 활용하면 수수료 3.3%밖에 안됩니다.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 15</button>
                </div>
              </div>

              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer">소상공인5년</span>
                  <span className="answer-time">9분 전</span>
                </div>
                <p className="answer-content">
                  포장 할인 20% 주고 직접 픽업 유도하세요. 배달앱보다 이익이 더 많이 남습니다.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 8</button>
                </div>
              </div>
            </div>
          </div>

          {/* 질문 2 */}
          <div className="qa-item">
            <div className="qa-question">
              <div className="qa-question-header">
                <div className="qa-question-meta">
                  <span className="qa-rank">🥈 2위</span>
                  <span className="category-badge category-세무">세무</span>
                  <span className="qa-author">카페사장</span>
                  <span className="qa-time">1시간 전</span>
                </div>
                <div className="qa-stats">
                  <span>👁 412</span>
                  <span>💬 8</span>
                </div>
              </div>
              <h3 className="qa-question-title">
                세무 신고 혼자서도 가능한가요?
              </h3>
              <p className="qa-question-content">
                카페 운영 3개월차입니다. 세무사 비용이 부담되는데 혼자서 신고해도 될까요?
                부가세 신고랑 종합소득세 신고가 걱정됩니다.
              </p>
            </div>

            <div className="qa-answers">
              <div className="qa-answer best-answer">
                <div className="answer-header">
                  <span className="answerer">세무사사무실직원</span>
                  <span className="answer-badge">✓ 베스트</span>
                  <span className="answer-time">30분 전</span>
                </div>
                <p className="answer-content">
                  간단한 사업은 국세청 홈택스에서 직접 가능합니다.
                  하지만 첫해는 세무사 도움받아서 기초를 잡는걸 추천드려요.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 45</button>
                </div>
              </div>

              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer">10년차사장</span>
                  <span className="answer-time">45분 전</span>
                </div>
                <p className="answer-content">
                  홈택스 전자신고 시스템이 많이 좋아졌어요. 유튜브에 교육 영상도 많습니다.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 12</button>
                </div>
              </div>
            </div>
          </div>

          {/* 질문 3 */}
          <div className="qa-item">
            <div className="qa-question">
              <div className="qa-question-header">
                <div className="qa-question-meta">
                  <span className="qa-rank">🥉 3위</span>
                  <span className="category-badge category-인사">인사</span>
                  <span className="qa-author">소매업3년</span>
                  <span className="qa-time">2시간 전</span>
                </div>
                <div className="qa-stats">
                  <span>👁 389</span>
                  <span>💬 15</span>
                </div>
              </div>
              <h3 className="qa-question-title">
                직원 채용시 주의사항은?
              </h3>
              <p className="qa-question-content">
                처음으로 직원을 채용하려고 합니다. 근로계약서나 4대보험 처리 등 꼭 알아야 할 사항들이 뭐가 있을까요?
              </p>
            </div>

            <div className="qa-answers">
              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer">노무사</span>
                  <span className="answer-time">1시간 전</span>
                </div>
                <p className="answer-content">
                  근로계약서는 필수입니다. 고용노동부 홈페이지에 표준 근로계약서 양식이 있어요.
                  4대보험은 채용 후 14일 이내에 신고해야 합니다.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 67</button>
                </div>
              </div>

              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer">편의점사장</span>
                  <span className="answer-time">1시간 30분 전</span>
                </div>
                <p className="answer-content">
                  최저임금, 주휴수당 꼭 체크하세요. 실수하면 과태료 나옵니다.
                </p>
                <div className="answer-actions">
                  <button className="btn-helpful">👍 23</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="qa-more-actions">
          <Link href="/ttontok/write" className="btn-write-question">
            ❓ 질문하기
          </Link>
          <Link href="/ttontok" className="btn-view-all-qa">
            모든 Q&A 보기 →
          </Link>
        </div>
      </div>

      <div className="ttontok-list">
        {loading ? (
          <div className="ttontok-empty">게시글을 불러오는 중입니다…</div>
        ) : error ? (
          <div className="ttontok-empty">{error}</div>
        ) : sortedPosts.length === 0 ? (
          <div className="ttontok-empty">아직 등록된 게시글이 없습니다.</div>
        ) : (
          <table className="ttontok-table">
            <thead>
              <tr>
                <th className="th-category">카테고리</th>
                <th className="th-title">제목</th>
                <th className="th-author">작성자</th>
                <th className="th-stats">공감</th>
                <th className="th-stats">댓글</th>
                <th className="th-stats">조회</th>
                <th className="th-date">작성일</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => {
                const isLiked = likedPostIds.includes(post._id);
                const likeDisplay = (post.likes || 0) + (isLiked ? 1 : 0);
                const categoryLabel = CATEGORY_LABELS[post.category] ?? '기타';
                const categoryClass = `${CATEGORY_CLASS_PREFIX}${post.category}`;
                const { date, time } = formatDateParts(post.createdAt);
                const nickname = post.isAnonymous ? '익명' : post.nickname;
                const businessInfo = post.isAnonymous
                  ? '비공개'
                  : [post.region, post.businessType].filter(Boolean).join(' · ') || '사업 정보 미입력';
                const preview = post.content.length > 120 ? `${post.content.slice(0, 120)}…` : post.content;

                return (
                  <tr key={post._id} className="post-row">
                    <td className="td-category">
                      <span className={category-badge }>{categoryLabel}</span>
                    </td>
                    <td className="td-title">
                      <Link href={/ttontok/} className="post-link">
                        <span className="post-title">
                          {categoryLabel === '고충' && <span className="badge-hot">🔥</span>}
                          {post.title}
                        </span>
                        <span className="post-preview">{preview}</span>
                      </Link>
                    </td>
                    <td className="td-author">
                      <div className="author-info">
                        <span className="author-name">{nickname}</span>
                        <span className="author-business">{businessInfo}</span>
                      </div>
                    </td>
                    <td className="td-stats">
                      <button
                        type="button"
                        className={like-btn }
                        onClick={() => toggleLike(post._id)}
                        aria-label="공감"
                      >
                        {isLiked ? '❤️' : '🤍'}
                        <span>{likeDisplay}</span>
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
                        <span className="date">{date}</span>
                        <span className="time">{time}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button type="button" className="page-btn prev" disabled>
          이전
        </button>
        <button type="button" className="page-btn active">
          1
        </button>
        <button type="button" className="page-btn" disabled>
          다음
        </button>
      </div>
    </div>
  );
};

export default TtontokPage;

