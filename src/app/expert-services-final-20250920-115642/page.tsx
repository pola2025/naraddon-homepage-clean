'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import Link from 'next/link';

import { StandardBottomCta } from '@/components/ui/StandardBottomCta';

import type { ExaminerProfile } from '@/components/examiners/examinerTypes';

import {
  consultFields,
  expertServiceCta,
  expertServiceHero,
  privacyNotice,
  successMessage,
  timingOptions,
} from '@/data/expertServices';
import { VERIFIED_EXPERT_PROFILES as VERIFIED_EXPERT_PROFILES_DATA } from '@/data/expertsShowcase';
import './page.css';
const VERIFIED_EXPERT_PROFILES = VERIFIED_EXPERT_PROFILES_DATA;
const ENABLE_DYNAMIC_EXPERT_SOURCE = false;
const MAX_CONTENT_LENGTH = 500;

const defaultFormState = {
  name: '',
  phone: '',
  email: '',
  companyName: '',
  content: '',
};

type FormState = typeof defaultFormState;

type CardSlot = 'left' | 'center' | 'right' | 'hidden';

export default function ExpertServicesPage() {
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [selectedField, setSelectedField] = useState('');
  const [selectedTiming, setSelectedTiming] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);


  const [expertProfiles, setExpertProfiles] = useState<ExaminerProfile[]>(VERIFIED_EXPERT_PROFILES);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [expertsError, setExpertsError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<number | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const fetchExpertProfiles = useCallback(async () => {
    if (!ENABLE_DYNAMIC_EXPERT_SOURCE) {
      setExpertProfiles(VERIFIED_EXPERT_PROFILES);
      setIsLoadingExperts(false);
      setExpertsError(null);
      return;
    }

    try {
      setIsLoadingExperts(true);
      setExpertsError(null);
      const response = await fetch('/api/expert-services/experts', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to load expert profiles.');
      }
      const data = await response.json().catch(() => null);
      const list = Array.isArray(data?.experts) ? data.experts : [];
      const normalized: ExaminerProfile[] = list.map((profile: any, index: number) => {
        const legacyKey =
          typeof profile.legacyKey === 'string' && profile.legacyKey.trim().length > 0
            ? profile.legacyKey.trim()
            : undefined;
        const inferredId =
          (typeof profile.id === 'string' && profile.id.trim()) ||
          (typeof profile._id === 'string' && profile._id.trim()) ||
          legacyKey ||
          profile.name;
        const imageUrl =
          typeof profile.imageUrl === 'string' && profile.imageUrl.trim().length > 0
            ? profile.imageUrl.trim()
            : legacyKey
              ? `/images/examiners/${legacyKey}.png`
              : '';
        const imageAlt =
          typeof profile.imageAlt === 'string' && profile.imageAlt.trim().length > 0
            ? profile.imageAlt.trim()
            : `${profile.name} 전문가`;
        return {
          ...profile,
          _id: inferredId,
          legacyKey: legacyKey ?? inferredId,
          category: profile.category ?? 'expert',
          specialties: Array.isArray(profile.specialties) ? profile.specialties : [],
          imageUrl,
          imageAlt,
          sortOrder: typeof profile.sortOrder === 'number' ? profile.sortOrder : index,
        } satisfies ExaminerProfile;
      });
      const sorted = normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setExpertProfiles(sorted.length > 0 ? sorted : VERIFIED_EXPERT_PROFILES);
    } catch (error) {
      console.error('[ExpertServices] fetchExpertProfiles', error);
      setExpertProfiles(VERIFIED_EXPERT_PROFILES);
      setExpertsError((error as Error).message ?? 'Failed to load expert profiles.');
    } finally {
      setIsLoadingExperts(false);
    }
  }, []);

  useEffect(() => {
    if (ENABLE_DYNAMIC_EXPERT_SOURCE) {
      void fetchExpertProfiles();
    } else {
      setExpertProfiles(VERIFIED_EXPERT_PROFILES);
    }
  }, [fetchExpertProfiles]);

  const displayedExperts = useMemo(() => {
    if (expertProfiles.length === 0) {
      return expertProfiles;
    }

    const seenKeys = new Set<string>();
    const uniqueProfiles = expertProfiles.filter((profile) => {
      const rawKey =
        (typeof profile._id === 'string' && profile._id.trim()) ||
        (profile._id && typeof (profile._id as { toString?: () => string }).toString === 'function'
          ? (profile._id as { toString: () => string }).toString()
          : '') ||
        (typeof (profile as { id?: string | number }).id === 'string'
          ? (profile as { id?: string }).id
          : (profile as { id?: number }).id !== undefined
            ? String((profile as { id?: number }).id)
            : '') ||
        (typeof profile.legacyKey === 'string' && profile.legacyKey.trim()
          ? profile.legacyKey.trim()
          : `${profile.name}-${profile.companyName ?? ''}`);

      const key = rawKey.toLowerCase();
      if (!key) {
        return true;
      }
      if (seenKeys.has(key)) {
        return false;
      }
      seenKeys.add(key);
      return true;
    });

    if (uniqueProfiles.length <= 1) {
      return uniqueProfiles;
    }

    const copy = [...uniqueProfiles];
    const randomIndex = Math.floor(Math.random() * copy.length);
    const [first] = copy.splice(randomIndex, 1);
    return [first, ...copy];
  }, [expertProfiles]);

  const totalExperts = displayedExperts.length;
  const heroSubtitle = useMemo(() => ({ __html: expertServiceHero.subtitleHtml }), []);
  const canNavigate = totalExperts > 1;

  useEffect(() => {
    if (totalExperts === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((previous) => (previous >= totalExperts ? 0 : previous));
  }, [totalExperts]);

  const goToNext = useCallback(() => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev + 1) % totalExperts);
  }, [canNavigate, totalExperts]);

  const goToPrev = useCallback(() => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev - 1 + totalExperts) % totalExperts);
  }, [canNavigate, totalExperts]);

  useEffect(() => {
    if (!isAutoPlaying || !canNavigate) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = window.setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlaying, canNavigate, goToNext]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const getVisibleExperts = useMemo(() => {
    if (totalExperts === 0) return [];
    if (totalExperts === 1) return [displayedExperts[0]];
    if (totalExperts === 2) {
      return [
        displayedExperts[activeIndex],
        displayedExperts[(activeIndex + 1) % 2]
      ];
    }

    const prevIndex = (activeIndex - 1 + totalExperts) % totalExperts;
    const nextIndex = (activeIndex + 1) % totalExperts;

    return [
      displayedExperts[prevIndex],
      displayedExperts[activeIndex],
      displayedExperts[nextIndex]
    ];
  }, [activeIndex, displayedExperts, totalExperts]);

  const handleCardClick = useCallback((expertIndex: number) => {
    const visibleIndex = getVisibleExperts.findIndex(
      expert => expert === displayedExperts[expertIndex]
    );

    if (visibleIndex === 0 && totalExperts > 2) {
      pauseAutoPlay();
      goToPrev();
    } else if (visibleIndex === 2) {
      pauseAutoPlay();
      goToNext();
    }
  }, [displayedExperts, getVisibleExperts, goToNext, goToPrev, pauseAutoPlay, totalExperts]);

  const handleScrollToForm = useCallback(() => {
    const target = document.querySelector('#expert-consultation-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      pauseAutoPlay();
    }
  }, [pauseAutoPlay]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!canNavigate) return;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      // Swiped left - go to next
      pauseAutoPlay();
      goToNext();
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped right - go to previous
      pauseAutoPlay();
      goToPrev();
    }
  }, [canNavigate, goToNext, goToPrev, pauseAutoPlay]);

  const resetForm = () => {
    setForm(defaultFormState);
    setSelectedField('');
    setSelectedTiming('');
    setAgreePrivacy(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.companyName.trim()) {
      window.alert('필수 정보를 모두 입력해 주세요.');
      return;
    }

    if (!selectedField) {
      window.alert('상담이 필요한 분야를 선택해 주세요.');
      return;
    }

    if (!selectedTiming) {
      window.alert('희망 상담 시기를 선택해 주세요.');
      return;
    }

    if (!form.content.trim()) {
      window.alert('상담 요청 내용을 입력해 주세요.');
      return;
    }

    if (!agreePrivacy) {
      window.alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    window.alert(successMessage);
    resetForm();
  };

  const charCount = form.content.length;

  return (
    <div className="expert-services-page bg-slate-50">
      <section className="expert-hero layout-hero relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <div className="layout-container">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
              {expertServiceHero.badge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {expertServiceHero.title}
              <span className="block text-blue-600">{expertServiceHero.highlight}</span>
            </h1>
            <p
              className="mt-6 text-lg leading-7 text-slate-600"
              dangerouslySetInnerHTML={heroSubtitle}
            />
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {expertServiceHero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white px-6 py-4 shadow ring-1 ring-slate-100"
                >
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
              ))}
              <button
                type="button"
                onClick={handleScrollToForm}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-600"
              >
                <i className="fas fa-headset" aria-hidden="true" /> 상담 요청하기
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="expert-services__experts layout-section" id="expert-cards">
        <div className="layout-container">
          <div className="expert-services__experts-header">
            <p className="expert-services__experts-eyebrow">Expert Network</p>
            <h2 className="expert-services__experts-title">검증된 전문가 네트워크</h2>
            <p className="expert-services__experts-description">
              분야별 인증 전문가가 실제 상담 경험을 바탕으로 맞춤형 실행 전략을 제안합니다.
            </p>
          </div>

          {expertsError ? (
            <p className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {expertsError}
            </p>
          ) : null}

          {isLoadingExperts ? (
            <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-3 text-sm text-slate-500">
              전문가 정보를 불러오는 중입니다.
            </p>
          ) : null}

          {!isLoadingExperts && !expertsError && totalExperts === 0 ? (
            <div className="expert-rotator__empty">등록된 전문가가 없습니다.</div>
          ) : null}

          <div
            className="expert-carousel-horizontal"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {displayedExperts.length === 0 ? (
              <div className="expert-carousel__empty">
                {isLoadingExperts
                  ? '전문가 정보를 불러오는 중입니다.'
                  : expertsError ?? '등록된 전문가가 없습니다.'}
              </div>
            ) : (
              <>
                <div className="expert-carousel__track">
                  {getVisibleExperts.map((expert, visibleIndex) => {
                    const expertIndex = displayedExperts.indexOf(expert);
                    const isCenter = visibleIndex === 1 || (totalExperts === 1 && visibleIndex === 0);
                    const imageUrl =
                      typeof expert.imageUrl === 'string' && expert.imageUrl.trim().length > 0
                        ? expert.imageUrl
                        : expert.legacyKey
                          ? `/images/examiners/${expert.legacyKey}.png`
                          : '';
                    const hasImage = Boolean(imageUrl);
                    const fallbackId =
                      'id' in expert && typeof (expert as { id?: string | number }).id !== 'undefined'
                        ? (expert as { id?: string | number }).id
                        : undefined;
                    const stableKey =
                      expert._id ??
                      (typeof fallbackId === 'number' ? String(fallbackId) : fallbackId) ??
                      expert.legacyKey ??
                      `${expert.name}-${expert.companyName ?? 'unknown'}`;

                    return (
                      <article
                        key={stableKey}
                        className="expert-card-horizontal"
                        data-position={isCenter ? 'center' : 'side'}
                        onClick={() => {
                          if (!isCenter && totalExperts > 1) {
                            handleCardClick(expertIndex);
                          }
                        }}
                        tabIndex={isCenter ? 0 : -1}
                      >
                        <div className="card-inner">
                          <div className="card-image-section">
                            {hasImage ? (
                              <img
                                src={imageUrl}
                                alt={expert.imageAlt || `${expert.name} 프로필`}
                                loading="lazy"
                              />
                            ) : (
                              <div className="image-placeholder">
                                <i className="fas fa-user-tie" />
                              </div>
                            )}
                          </div>

                          <div className="card-content-section">
                            <div className="expert-header">
                              <span className="expert-badge">인증 전문가</span>
                              <h3 className="expert-name">{expert.name}</h3>
                              <p className="expert-title">{expert.position}</p>
                              <p className="expert-company">{expert.companyName}</p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleScrollToForm();
                          }}
                          className="consult-cta"
                        >
                          상담 요청하기
                          <i className="fas fa-arrow-right" aria-hidden="true" />
                        </button>
                      </article>
                    );
                  })}
                </div>

                {canNavigate ? (
                  <>
                    <button
                      type="button"
                      className="carousel-control prev"
                      onClick={() => {
                        pauseAutoPlay();
                        goToPrev();
                      }}
                      aria-label="이전 전문가"
                    >
                      <i className="fas fa-chevron-left" />
                    </button>
                    <button
                      type="button"
                      className="carousel-control next"
                      onClick={() => {
                        pauseAutoPlay();
                        goToNext();
                      }}
                      aria-label="다음 전문가"
                    >
                      <i className="fas fa-chevron-right" />
                    </button>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="layout-section" id="expert-consultation-form">
        <div className="layout-container max-w-4xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Consultation
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">전문가 상담 신청서</h2>
            <p className="mt-3 text-slate-600">
              연락 받을 정보를 남겨주시면 하루 이내 맞춤형 전문가를 매칭해 드립니다.
            </p>
          </div>

          <form
            className="mt-12 space-y-10 rounded-3xl bg-white p-8 shadow ring-1 ring-slate-100"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3">
              <h3 className="flex items-center text-lg font-semibold text-slate-900">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                  2
                </span>
                상담이 필요한 분야
              </h3>
              <div className="max-w-md space-y-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    상담 분야 선택 <span className="text-blue-600">*</span>
                  </span>
                  <select
                    value={selectedField}
                    onChange={(event) => setSelectedField(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    required
                  >
                    <option value="">상담이 필요한 분야를 선택해 주세요</option>
                    {consultFields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-xs text-slate-500">
                  복수 분야가 필요하면 아래 상담 요청 내용에 함께 적어 주세요.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold text-slate-900">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                  3
                </span>
                희망 상담 시기
              </h3>
              <div className="grid gap-4 md:grid-cols-4">
                {timingOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      selectedTiming === option.value
                        ? 'border-violet-600 bg-blue-50 text-blue-600 shadow'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultTiming"
                      value={option.value}
                      checked={selectedTiming === option.value}
                      onChange={() => setSelectedTiming(option.value)}
                      className="hidden"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center text-lg font-semibold text-slate-900">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                  4
                </span>
                상담 요청 내용
              </h3>
              <div>
                <textarea
                  value={form.content}
                  onChange={(event) => {
                    const next = event.target.value.slice(0, MAX_CONTENT_LENGTH);
                    setForm((prev) => ({ ...prev, content: next }));
                  }}
                  rows={5}
                  placeholder="필요한 서비스와 현재 상황을 구체적으로 적어주세요."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {charCount}/{MAX_CONTENT_LENGTH}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(event) => setAgreePrivacy(event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-violet-500"
                />
                <span>
                  개인정보 수집 및 이용에 동의합니다.{' '}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="font-semibold text-blue-600 underline-offset-2 hover:underline"
                  >
                    자세히 보기
                  </button>
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={!agreePrivacy}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  상담 요청하기
                </button>
                <Link
                  href="#expert-cards"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:text-blue-600"
                >
                  전문가 소개 다시 보기
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="certified-examiners__cta-section">
        <div className="layout-container">
          <StandardBottomCta
            eyebrow="Ready to Consult"
            title={expertServiceCta.title}
            subtitle={expertServiceCta.subtitle}
            buttonHref="#expert-consultation-form"
            buttonLabel={expertServiceCta.primaryLabel}
            buttonAriaLabel={expertServiceCta.primaryLabel}
          />
        </div>
      </section>

      {isPrivacyOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="absolute right-6 top-6 text-slate-400 transition hover:text-slate-600"
              aria-label="닫기"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
            <h4 className="text-xl font-semibold text-slate-900">개인정보 수집 및 이용 안내</h4>
            <div className="mt-6 space-y-4">
              {privacyNotice.sections.map((section) => (
                <div key={section.title}>
                  <p className="text-sm font-semibold text-slate-800">{section.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{section.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                {privacyNotice.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


























