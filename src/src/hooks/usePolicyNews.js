import { useCallback, useEffect, useMemo, useState } from 'react';

import boardImage1 from '@/assets/images/board/board_image_01.jpg';
import boardImage2 from '@/assets/images/board/board_image_02.jpg';
import boardImage3 from '@/assets/images/board/board_image_03.jpg';
import boardImage4 from '@/assets/images/board/board_image_04.png';

const FALLBACK_IMAGES = [boardImage1, boardImage2, boardImage3, boardImage4];

const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const formatDate = (value) => {
  if (!value) {
    return '날짜 미확인';
  }

  const ensureDate = (raw) => {
    if (raw instanceof Date) {
      return raw;
    }

    if (typeof raw === 'string') {
      const trimmed = raw.trim();

      if (/^\d{4}\.\d{2}\.\d{2}$/.test(trimmed)) {
        const [year, month, day] = trimmed.split('.');
        return new Date(Number(year), Number(month) - 1, Number(day));
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return new Date(trimmed);
      }

      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const parsedDate = ensureDate(value);
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
    return '날짜 미확인';
  }

  return parsedDate.toLocaleDateString('ko-KR');
};

const ensureArray = (maybeArray) => (Array.isArray(maybeArray) ? maybeArray : []);

export const normalizePolicyNewsItem = (post, index = 0, fallbackImages = FALLBACK_IMAGES) => {
  const fallbackImage = fallbackImages[index % fallbackImages.length];
  const fallbackSrc = typeof fallbackImage === 'string' ? fallbackImage : fallbackImage?.src;

  const normalizedId = post?._id ?? post?.id ?? `policy-news-${index}`;
  const rawCategory = typeof post?.category === 'string' ? post.category.trim() : '';
  const category = rawCategory.length > 0 ? rawCategory : 'policy';

  const rawThumbnail =
    typeof post?.thumbnail === 'string' && post.thumbnail.trim().length > 0
      ? post.thumbnail.trim()
      : typeof post?.image === 'string' && post.image.trim().length > 0
        ? post.image.trim()
        : fallbackSrc;

  const baseContent = typeof post?.content === 'string' ? post.content : '';
  const primaryExcerpt = typeof post?.excerpt === 'string' ? post.excerpt : '';
  const description =
    typeof post?.description === 'string' && post.description.trim().length > 0
      ? post.description.trim()
      : primaryExcerpt || baseContent;

  const excerptSource = stripHtml(primaryExcerpt || description || baseContent);
  const excerpt = excerptSource.length > 160 ? `${excerptSource.slice(0, 160).trim()}…` : excerptSource;

  const views = typeof post?.views === 'number' ? post.views : Number(post?.viewCount) || 0;
  const likes = typeof post?.likes === 'number' ? post.likes : Number(post?.likeCount) || 0;
  const comments = typeof post?.comments === 'number' ? post.comments : Number(post?.commentCount) || 0;

  const createdAt = post?.createdAt ?? post?.date ?? null;

  return {
    id: String(normalizedId),
    title: typeof post?.title === 'string' && post.title.trim().length > 0 ? post.title.trim() : '정책 소식',
    content: baseContent,
    description: description || '현재 확인 가능한 내용이 없습니다.',
    excerpt,
    category,
    badge: typeof post?.badge === 'string' ? post.badge.trim() : '',
    thumbnail: rawThumbnail || fallbackSrc || '',
    tags: ensureArray(post?.tags),
    isMain: Boolean(post?.isMain),
    isPinned: Boolean(post?.isPinned),
    views,
    likes,
    comments,
    createdAt,
    dateText: formatDate(createdAt),
  };
};

export const usePolicyNews = ({ limit = 12, fallbackImages = FALLBACK_IMAGES } = {}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPolicyNews = useCallback(async () => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/policy-news?limit=${limit}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('정책 소식을 불러오는데 실패했습니다.');
      }

      const payload = await response.json();
      const posts = Array.isArray(payload?.posts) ? payload.posts : [];
      const normalized = posts.map((post, index) => normalizePolicyNewsItem(post, index, fallbackImages));
      setItems(normalized);
      return { controller };
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return { controller };
      }
      console.error(fetchError);
      setError('정책소식 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setItems([]);
      return { controller };
    } finally {
      setIsLoading(false);
    }
  }, [fallbackImages, limit]);

  useEffect(() => {
    let abortController = new AbortController();

    const execute = async () => {
      const { controller } = await fetchPolicyNews();
      abortController = controller;
    };

    execute();

    return () => {
      abortController.abort();
    };
  }, [fetchPolicyNews]);

  const refetch = useCallback(() => {
    return fetchPolicyNews();
  }, [fetchPolicyNews]);

  const meta = useMemo(
    () => ({
      total: items.length,
      pinned: items.filter((item) => item.isPinned).length,
    }),
    [items],
  );

  return {
    items,
    isLoading,
    error,
    refetch,
    meta,
  };
};

export default usePolicyNews;
