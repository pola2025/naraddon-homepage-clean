'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

const CATEGORY_LABELS: Record<string, string> = {
  startup: '창업',
  operation: '운영',
  trouble: '고충',
  network: '네트워킹',
  support: '지원',
  success: '성공사례',
  question: '질문',
};

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
  views: number;
  createdAt?: string | null;
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

export default function TtontokDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<TtontokPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ttontok/posts/${params.id}`, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('게시글을 불러오지 못했습니다.');
        }

        const data = await response.json();
        if (!isMounted) {
          return;
        }

        setPost(data.post);
        setError(null);

        void fetch(`/api/ttontok/posts/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incrementViews: true }),
        }).catch(() => undefined);
      } catch (err) {
        if (!controller.signal.aborted && isMounted) {
          console.error(err);
          setError('게시글을 찾을 수 없습니다.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [params.id]);

  const handleBack = () => {
    router.push('/ttontok');
  };

  if (loading) {
    return (
      <div className="ttontok-detail-page">
        <div className="ttontok-detail-container">
          <div className="ttontok-detail-message">게시글을 불러오는 중입니다…</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="ttontok-detail-page">
        <div className="ttontok-detail-container">
          <div className="ttontok-detail-message">{error ?? '게시글을 찾을 수 없습니다.'}</div>
          <button type="button" className="ttontok-detail-back" onClick={handleBack}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[post.category] ?? '기타';
  const { date, time } = formatDateParts(post.createdAt);
  const nickname = post.isAnonymous ? '익명' : post.nickname;
  const businessInfo = post.isAnonymous
    ? '비공개'
    : [post.region, post.businessType].filter(Boolean).join(' · ') || '사업 정보 미입력';

  return (
    <div className="ttontok-detail-page">
      <div className="ttontok-detail-container">
        <div className="ttontok-detail-header">
          <button type="button" className="ttontok-detail-back" onClick={handleBack}>
            ← 똔톡 목록으로
          </button>
        </div>

        <article className="ttontok-detail-card">
          <div className="ttontok-detail-meta">
            <span className={`category-badge category-${post.category}`}>{categoryLabel}</span>
            <span className="ttontok-detail-views">👁 {post.views}</span>
          </div>

          <h1 className="ttontok-detail-title">{post.title}</h1>

          <div className="ttontok-detail-author">
            <div>
              <p className="ttontok-detail-author-name">{nickname}</p>
              <p className="ttontok-detail-author-info">{businessInfo}</p>
            </div>
            <div className="ttontok-detail-date">
              <span>{date}</span>
              <span>{time}</span>
            </div>
          </div>

          <div className="ttontok-detail-content">
            {post.content.split('\n').map((line, index) => (
              <p key={index}>{line.trim() === '' ? '\u00A0' : line}</p>
            ))}
          </div>
        </article>

        <div className="ttontok-detail-actions">
          <Link href="/ttontok" className="ttontok-detail-back">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
