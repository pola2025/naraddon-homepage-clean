'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { StandardBottomCta } from '@/components/ui/StandardBottomCta';

import {
  consultFields,
  expertProfiles,
  expertServiceCta,
  expertServiceHero,
  privacyNotice,
  successMessage,
  timingOptions,
} from '@/data/expertServices';
import './page.css';

const MAX_CONTENT_LENGTH = 500;

const defaultFormState = {
  name: '',
  phone: '',
  email: '',
  companyName: '',
  content: '',
};

type FormState = typeof defaultFormState;

export default function ExpertServicesPage() {
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [selectedField, setSelectedField] = useState('');
  const [selectedTiming, setSelectedTiming] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);

  const heroSubtitle = useMemo(() => ({ __html: expertServiceHero.subtitleHtml }), []);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);

  const updateSlideControls = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) {
      setCanSlidePrev(false);
      setCanSlideNext(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = slider;
    setCanSlidePrev(scrollLeft > 1);
    setCanSlideNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const handleSlide = useCallback(
    (direction: 'prev' | 'next') => {
      const slider = sliderRef.current;
      if (!slider) return;
      const gapValue = parseFloat(
        getComputedStyle(slider).getPropertyValue('--expert-slider-gap') || '24'
      );
      const cardWidth =
        slider.querySelector<HTMLElement>('.expert-card')?.offsetWidth ?? slider.clientWidth;
      const amount = cardWidth + gapValue;
      const delta = direction === 'next' ? amount : -amount;
      slider.scrollBy({ left: delta, behavior: 'smooth' });
      requestAnimationFrame(updateSlideControls);
    },
    [updateSlideControls]
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    updateSlideControls();
    const handleScroll = () => updateSlideControls();
    const handleResize = () => updateSlideControls();
    slider.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      slider.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateSlideControls]);

  const handleScrollToForm = useCallback(() => {
    const target = document.querySelector('#expert-consultation-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

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
            <h2 className="expert-services__experts-title">분야별 인증 전문가를 한 번에</h2>
            <p className="expert-services__experts-description">
              법무·세무·노무·행정 등 복잡한 영역을 각 분야 전문 자격을 갖춘 파트너가 끝까지 동행합니다.
            </p>
          </div>

          <div className="expert-services__slider-shell">
            <button
              type="button"
              className="expert-services__slider-arrow is-prev"
              onClick={() => handleSlide('prev')}
              aria-label="이전 전문가 보기"
              disabled={!canSlidePrev}
            >
              <i className="fas fa-chevron-left" aria-hidden="true" />
            </button>

            <div className="expert-services__slider" ref={sliderRef}>
              {expertProfiles.map((expert) => {
                const hasImage = Boolean(expert.imageKey);
                return (
                  <article key={`${expert.name}-${expert.companyName}`} className="expert-card">
                    <div className="expert-card__media">
                      <span className="expert-card__badge">나라똔 인증</span>
                      <div
                        className={
                          hasImage
                            ? 'expert-card__image'
                            : 'expert-card__image expert-card__image--placeholder'
                        }
                      >
                        {hasImage ? (
                          <Image
                            src={`/images/examiners/${expert.imageKey}.png`}
                            alt={`${expert.name} 프로필`}
                            width={280}
                            height={360}
                            className="expert-card__photo"
                          />
                        ) : (
                          <i className="fas fa-user-tie" aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    <div className="expert-card__body">
                      <h3 className="expert-card__name">
                        {expert.name}
                        {expert.companyName ? (
                          <span className="expert-card__company"> | {expert.companyName}</span>
                        ) : null}
                      </h3>
                      <p className="expert-card__role">{expert.position}</p>

                      <ul className="expert-card__tags">
                        {expert.specialties.map((tag) => (
                          <li key={`${expert.name}-${tag}`}>#{tag}</li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={handleScrollToForm}
                        className="expert-card__cta"
                      >
                        상담 요청하기
                        <i className="fas fa-arrow-right" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              className="expert-services__slider-arrow is-next"
              onClick={() => handleSlide('next')}
              aria-label="다음 전문가 보기"
              disabled={!canSlideNext}
            >
              <i className="fas fa-chevron-right" aria-hidden="true" />
            </button>
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












