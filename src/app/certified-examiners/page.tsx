'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import '@/styles/cta-shared.css';
import './page.css';

import { ExaminerAdminPanel } from '@/components/examiners/ExaminerAdminPanel';
import type { ExaminerAdminPanelHandle, ExaminerProfile } from '@/components/examiners/examinerTypes';

const INITIAL_VISIBLE_COUNT = 9;

const shuffleArray = <T,>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const CATEGORY_ORDER = ['funding', 'certification', 'export', 'manufacturing', 'startup', 'general'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  all: '전체',
  funding: '정책자금',
  certification: '인증',
  export: '수출',
  manufacturing: '제조혁신',
  startup: '창업',
  general: '기타',
};

const GENERAL_CATEGORY = 'general';

const getCategoryValue = (rawCategory?: string | null) => {
  if (typeof rawCategory === 'string' && rawCategory.trim()) {
    return rawCategory.trim();
  }
  return GENERAL_CATEGORY;
};

export default function CertifiedExaminersPage() {
  const adminPanelRef = useRef<ExaminerAdminPanelHandle | null>(null);
  const [examiners, setExaminers] = useState<ExaminerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchExaminers = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await fetch('/api/expert-services/examiners', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('인증 기업심사관 정보를 불러오지 못했습니다.');
      }
      const data = await response.json().catch(() => null);
      const list = Array.isArray(data?.examiners) ? (data.examiners as ExaminerProfile[]) : [];
      setExaminers(list);
    } catch (error) {
      console.error('[CertifiedExaminers] fetch', error);
      setExaminers([]);
      setFetchError(error instanceof Error ? error.message : '인증 기업심사관 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExaminers();
  }, [fetchExaminers]);

  const randomizedExaminers = useMemo(() => shuffleArray(examiners), [examiners]);

  const categories = useMemo(() => {
    const dataset = Array.from(
      new Set(randomizedExaminers.map((examiner) => getCategoryValue(examiner.category)))
    );
    const ordered = CATEGORY_ORDER.filter((category) => dataset.includes(category));
    const fallback = dataset.filter(
      (category) => !CATEGORY_ORDER.includes(category as (typeof CATEGORY_ORDER)[number])
    );
    return ['all', ...ordered, ...fallback];
  }, [randomizedExaminers]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (activeCategory !== 'all' && !categories.includes(activeCategory)) {
      setActiveCategory('all');
      setExpanded(false);
    }
  }, [activeCategory, categories]);

  const filteredExaminers = useMemo(() => {
    if (activeCategory === 'all') {
      return randomizedExaminers;
    }
    return randomizedExaminers.filter(
      (examiner) => getCategoryValue(examiner.category) === activeCategory
    );
  }, [activeCategory, randomizedExaminers]);

  const visibleExaminers =
    activeCategory === 'all' && !expanded
      ? filteredExaminers.slice(0, INITIAL_VISIBLE_COUNT)
      : filteredExaminers;

  const remainingCount =
    activeCategory === 'all' ? Math.max(filteredExaminers.length - visibleExaminers.length, 0) : 0;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setExpanded(false);
  };

  const handleRefreshPublished = useCallback(async () => {
    await fetchExaminers();
  }, [fetchExaminers]);

  const handleOpenAdminPanel = useCallback(() => {
    adminPanelRef.current?.openModal();
  }, []);

  return (
    <div className="certified-examiners">
      <section className="expert-hero layout-hero relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <div className="layout-container">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">인증 기업심사관</span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              인증 기업심사관과 함께하는
              <span className="block text-blue-600">맞춤형 정책자금 전략</span>
            </h1>
            <p className="mt-6 text-lg leading-7 text-slate-600">
              나라똔에서 100% 보증하는 인증 정책전문가 인증기업심사관이
              <span className="block sm:inline">대표님들의 맞춤 솔루션을 완성합니다.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/consultation-request#form-section"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-600"
              >
                <i className="fas fa-headset" aria-hidden="true" /> 상담 요청하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ExaminerAdminPanel ref={adminPanelRef} onRefreshPublished={handleRefreshPublished} />

      <section className="certified-examiners__directory">
        <div className="certified-examiners__section-container">
          <div className="certified-examiners__directory-header">
            <div className="certified-examiners__directory-intro">
              <p className="certified-examiners__directory-eyebrow">인증기업심사관 네트워크</p>
              <h2 className="certified-examiners__directory-title">인증 기업심사관</h2>
              <p className="certified-examiners__directory-subtitle">
                정책자금·인증·스마트공장 등 분야별 전문가를 확인하세요.
              </p>
            </div>
            <div className="certified-examiners__category-list">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                const label = CATEGORY_LABELS[category] ?? category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={
                      isActive
                        ? 'certified-examiners__category-button is-active'
                        : 'certified-examiners__category-button'
                    }
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-500">
              인증 기업심사관을 불러오는 중입니다...
            </p>
          ) : null}
          {fetchError ? (
            <p className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {fetchError}
            </p>
          ) : null}
          {!isLoading && !fetchError && filteredExaminers.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-500">
              등록된 인증 기업심사관이 없습니다.
            </p>
          ) : null}

          <div className="certified-examiners__directory-grid">
            {visibleExaminers.map((examiner) => {
              const companyLabel = examiner.companyName?.trim();
              const imageUrl = examiner.imageUrl?.trim();
              const hasImage = Boolean(imageUrl);
              const cardKey = examiner._id ?? `${examiner.name}-${companyLabel ?? 'unknown'}`;
              const roleLabel = examiner.position?.trim() || '인증 기업심사관';

              return (
                <article key={cardKey} className="certified-examiners-card">
                  <div className="certified-examiners-card__media">
                    <span className="certified-examiners-card__badge">
                      <i className="fas fa-check" aria-hidden="true" /> 인증된 전문가
                    </span>
                    <div
                      className={
                        hasImage
                          ? 'certified-examiners-card__image'
                          : 'certified-examiners-card__image certified-examiners-card__image--placeholder'
                      }
                    >
                      {hasImage ? (
                        <img
                          src={imageUrl}
                          alt={examiner.imageAlt?.trim() || `${examiner.name} 프로필`}
                          width={220}
                          height={260}
                          className="certified-examiners-card__photo"
                          loading="lazy"
                        />
                      ) : (
                        <i className="fas fa-user-tie" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                  <div className="certified-examiners-card__body">
                    <h3 className="certified-examiners-card__name">
                      {examiner.name}
                      {companyLabel ? (
                        <span className="certified-examiners-card__company"> | {companyLabel}</span>
                      ) : null}
                    </h3>
                    <p className="certified-examiners-card__role">{roleLabel}</p>
                    <Link href="/consultation-request#form-section" className="certified-examiners-card__action">
                      상담 신청하기
                      <i className="fas fa-arrow-right" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="certified-examiners__admin-action">
            <button
              type="button"
              onClick={handleOpenAdminPanel}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
            >
              인증기업심사관 등록하기
            </button>
          </div>

          {activeCategory === 'all' && !expanded && remainingCount > 0 ? (
            <div className="certified-examiners__load-more">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="certified-examiners__load-more-button"
              >
                더 많은 심사관 보기 ({remainingCount})
              </button>
            </div>
          ) : null}

          <div className="certified-examiners__cta">
            <div className="certified-examiners__cta-banner">
              <div className="certified-examiners__cta-content">
                <p className="certified-examiners__cta-eyebrow">상담 준비 완료</p>
                <h3 className="certified-examiners__cta-title">나라똔 100% 인증 기업심사관<br />사업성장의 맞춤 전략을 제안합니다.</h3>
                <p className="certified-examiners__cta-subtitle">상담을 신청하시면 인증 기업심사관이 24시간 이내 연락드립니다.<br />나라똔에서 100% 보증으로 안심하고 상담할 수 있습니다.</p>
              </div>
              <Link href="/consultation-request#form-section" className="certified-examiners__cta-button">
                컨설팅 신청하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}























