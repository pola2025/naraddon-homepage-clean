'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import './PolicyAnalysisDetail.css';

const fallbackImages = {
  government: [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80',
  ],
  support: [
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&q=80',
    'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80',
  ],
  manufacturing: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
  ],
  other: [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  ],
};

const categoryLabel = (value) => {
  switch (value) {
    case 'government':
      return '정부지원정책';
    case 'support':
      return '중소·창업지원';
    case 'manufacturing':
      return '제조혁신정책';
    case 'other':
    default:
      return '기타정책';
  }
};

const formatDateTime = (value) => {
  if (!value) {
    return '작성일 미확인';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '작성일 미확인';
  }
  return `${date.toLocaleDateString('ko-KR')} ${date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const createSeedFromString = (value) => {
  if (!value) {
    return 0;
  }
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const pickThumbnail = (category, seedSource) => {
  const images = fallbackImages[category] || fallbackImages.other;
  if (!images || images.length === 0) {
    return fallbackImages.other[0];
  }
  const seed = Math.abs(createSeedFromString(seedSource));
  const index = seed % images.length;
  return images[index];
};

const convertMarkdownToHtml = (markdown) => {
  if (!markdown) {
    return '';
  }

  const transformed = markdown
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^-\s+(.*)$/gm, '<li>$1</li>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="content-image-wrapper"><img src="$2" alt="$1" class="content-image" /><span class="image-caption">$1</span></div>');

  const withParagraphs = transformed
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) {
        return '';
      }
      if (trimmed.startsWith('<h1') || trimmed.startsWith('<h2') || trimmed.startsWith('<h3') || trimmed.startsWith('<div')) {
        return trimmed;
      }
      if (trimmed.startsWith('<li>')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return withParagraphs.replace(/(?:<li>.*?<\/li>)+/gs, (match) => `<ul class="markdown-list">${match}</ul>`);
};

const PolicyAnalysisDetail = ({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch(`/api/policy-analysis/${postId}?countView=true`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message || '정책분석 게시글을 불러오지 못했습니다.');
        }

        const data = await response.json();
        if (cancelled) {
          return;
        }

        const rawPost = data.post;
        const id =
          (typeof rawPost._id === 'string' && rawPost._id) ||
          rawPost._id?.toString?.() ||
          rawPost.id ||
          postId;
        const category = rawPost.category || 'other';
        const examinerName = rawPost.examiner?.name || '인증기업심사관';
        const examinerCompany = rawPost.examiner?.companyName || '';
        const sections = Array.isArray(rawPost.sections)
          ? rawPost.sections
              .filter((section) => section && section.title && section.content)
              .map((section) => ({
                id: section.id || section.title,
                title: section.title,
                content: section.content,
              }))
          : [];
        const images = Array.isArray(rawPost.images)
          ? rawPost.images.filter((image) => image && image.url)
          : [];

        const normalizedPost = {
          id,
          title: rawPost.title,
          category,
          content: rawPost.content || '',
          excerpt: rawPost.excerpt || '',
          tags: Array.isArray(rawPost.tags) ? rawPost.tags : [],
          thumbnail: rawPost.thumbnail?.trim() || pickThumbnail(category, id),
          sections,
          images,
          isStructured: rawPost.isStructured !== false && sections.length > 0,
          createdAt: rawPost.createdAt || rawPost.updatedAt || null,
          updatedAt: rawPost.updatedAt || rawPost.createdAt || null,
          views: typeof rawPost.views === 'number' ? rawPost.views : 0,
          likes: typeof rawPost.likes === 'number' ? rawPost.likes : 0,
          comments: typeof rawPost.comments === 'number' ? rawPost.comments : 0,
          examinerName,
          examinerCompany,
        };

        setPost(normalizedPost);

        const relatedResponse = await fetch(
          `/api/policy-analysis?limit=4${category ? `&category=${encodeURIComponent(category)}` : ''}`,
          { cache: 'no-store' }
        );

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          if (!cancelled) {
            const normalizedRelated = Array.isArray(relatedData.posts)
              ? relatedData.posts
                  .filter((item) => {
                    const relatedId =
                      (typeof item._id === 'string' && item._id) ||
                      item._id?.toString?.() ||
                      item.id;
                    return relatedId !== id;
                  })
                  .slice(0, 3)
                  .map((item) => {
                    const relatedId =
                      (typeof item._id === 'string' && item._id) ||
                      item._id?.toString?.() ||
                      item.id ||
                      '';
                    const itemCategory = item.category || 'other';
                    return {
                      id: relatedId,
                      title: item.title,
                      thumbnail: item.thumbnail?.trim() || pickThumbnail(itemCategory, relatedId),
                      category: itemCategory,
                      createdAt: item.createdAt || item.updatedAt || null,
                      views: typeof item.views === 'number' ? item.views : 0,
                      examinerName: item.examiner?.name || '인증기업심사관',
                      examinerCompany: item.examiner?.companyName || '',
                    };
                  })
              : [];
            setRelatedPosts(normalizedRelated);
          }
        } else {
          setRelatedPosts([]);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : '상세 정보를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    if (postId) {
      fetchPost();
    }

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const renderedContent = useMemo(() => convertMarkdownToHtml(post?.content || ''), [post?.content]);

  const handleDelete = async () => {
    const password = window.prompt('게시글 비밀번호를 입력해주세요.');
    if (!password) {
      return;
    }

    try {
      const response = await fetch(`/api/policy-analysis/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result?.message || '게시글 삭제에 실패했습니다.');
        return;
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/policy-analysis');
    } catch (error) {
      console.error('정책분석 삭제 오류', error);
      alert('삭제 처리 중 오류가 발생했습니다.');
    }
  };

  const handleShare = () => {
    if (!post) {
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.title,
        url: window.location.href,
      });
      return;
    }

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert('링크가 복사되었습니다.'))
      .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  if (isLoading) {
    return (
      <div className="policy-analysis-detail">
        <div className="detail-container loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>정책분석 게시글을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="policy-analysis-detail">
        <div className="detail-container error">
          <i className="fas fa-exclamation-circle"></i>
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

  const createdDate = formatDateTime(post.createdAt);
  const updatedDate = post.updatedAt ? formatDateTime(post.updatedAt) : null;

  return (
    <div className="policy-analysis-detail">
      <div className="detail-container">
        <div className="detail-header">
          <div>
            <div className="detail-category">{categoryLabel(post.category)}</div>
            <h1 className="detail-title">{post.title}</h1>
            <div className="detail-meta">
              <span>
                <i className="far fa-calendar"></i> 작성 {createdDate}
              </span>
              {updatedDate && (
                <span>
                  <i className="far fa-edit"></i> 수정 {updatedDate}
                </span>
              )}
              <span>
                <i className="far fa-eye"></i> 조회 {post.views.toLocaleString()}
              </span>
              <span>
                <i className="far fa-heart"></i> 공감 {post.likes}
              </span>
              <span>
                <i className="far fa-comment"></i> 댓글 {post.comments}
              </span>
            </div>
          </div>
          <div className="detail-actions">
            <button className="share-btn" onClick={handleShare}>
              <i className="fas fa-share-alt"></i> 공유
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <i className="fas fa-trash"></i> 삭제
            </button>
          </div>
        </div>

        <div className="detail-author-banner">
          <div className="detail-author-info">
            <span className="detail-author-name">
              <i className="fas fa-shield-alt"></i> {post.examinerName} 인증기업심사관
            </span>
            <span className="detail-author-company">{post.examinerCompany}</span>
          </div>
          <span className="detail-author-badge">Verified</span>
        </div>

        {post.thumbnail && (
          <div className="detail-thumbnail">
            <img src={post.thumbnail} alt={post.title} />
          </div>
        )}

        {post.excerpt && (
          <div className="detail-excerpt">
            <p>{post.excerpt}</p>
          </div>
        )}

        <div className="detail-content">
          {post.isStructured && post.sections.length > 0 ? (
            <div className="sections-grid">
              {post.sections.map((section) => (
                <section key={section.id} className="detail-section">
                  <div className="section-heading">
                    <span className="heading-icon">
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <h2>{section.title}</h2>
                  </div>
                  <div
                    className="section-body"
                    dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(section.content) }}
                  />
                </section>
              ))}
            </div>
          ) : (
            <div className="detail-markdown" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          )}

          {post.images.length > 0 && (
            <div className="detail-gallery">
              {post.images.map((image, index) => (
                <figure key={`${image.url}-${index}`}>
                  <img src={image.url} alt={image.caption || `이미지 ${index + 1}`} />
                  {(image.caption || image.name) && <figcaption>{image.caption || image.name}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="detail-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="detail-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <aside className="related-section">
          <h2>함께 보면 좋은 정책분석</h2>
          <div className="related-list">
            {relatedPosts.map((item) => (
              <article key={item.id} className="related-item" onClick={() => router.push(`/policy-analysis/${item.id}`)}>
                <div className="related-thumbnail">
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <div className="related-content">
                  <span className="related-category">{categoryLabel(item.category)}</span>
                  <h3>{item.title}</h3>
                  <div className="related-meta">
                    <span>{formatDateTime(item.createdAt)}</span>
                    <span>
                      <i className="far fa-eye"></i> {item.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="related-author">
                    <span className="author-name">{item.examinerName} 인증기업심사관</span>
                    <span className="author-company">{item.examinerCompany}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      )}

      <div className="detail-footer-actions">
        <button className="back-button" onClick={() => router.push('/policy-analysis')}>
          <i className="fas fa-list"></i>
          목록으로 돌아가기
        </button>
        <button className="consult-button" onClick={() => router.push('/consultation')}>
          <i className="fas fa-comments"></i>
          전문가 상담 신청하기
        </button>
      </div>
    </div>
  );
};

export default PolicyAnalysisDetail;
