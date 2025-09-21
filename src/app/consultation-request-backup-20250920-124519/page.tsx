
'use client';

import Link from 'next/link';

import { useEffect, useReducer, type ChangeEvent, type FormEvent, type JSX, type ReactNode } from 'react';
import {
  ANNUAL_REVENUE_OPTIONS,
  CONSULTATION_FAQ,
  CONSULTATION_TYPE_OPTIONS,
  EMPLOYEE_COUNT_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  type FaqCategory,
  type FaqQuestion,
} from './data';
import styles from './QuickConsultForm.module.css';
import '@/styles/cta-shared.css';
import './page.css';

type ConsultationFormState = {
  name: string;
  phone: string;
  region: string;
  desiredTime: string;
  consultType: string;
  annualRevenue: string;
  employeeCount: string;
  preferredTime: string;
  businessNumber: string;
  email: string;
  message: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
};

type ConsultationFormErrors = Partial<Record<keyof ConsultationFormState, string>>;

const INITIAL_FORM_STATE: ConsultationFormState = {
  name: '',
  phone: '',
  region: '',
  desiredTime: '',
  consultType: '',
  annualRevenue: '',
  employeeCount: '',
  preferredTime: '',
  businessNumber: '',
  email: '',
  message: '',
  privacyConsent: false,
  marketingConsent: false,
};

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const formatBusinessNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
};

const classNames = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const CONSULTATION_TYPE_ICONS: Record<string, JSX.Element> = {
  'policy-fund': (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  grant: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12V22H20V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7C12 7 12 2 7.5 2C7.5 4.5 7.5 7 7.5 7H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7H16.5C16.5 5.5 15.5 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  certification: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  startup: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 16V11.5C20 10 19 8.5 17.5 8C16.5 7.5 15 7 13.5 6.5C10.5 5.5 8 2 8 2C8 2 5.5 5.5 2.5 6.5C1 7 0 8.5 0 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(2, 3)" />
      <circle cx="12" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  other: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8H18V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10H16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};






function ConsultationHero() {
  return (
    <section className="expert-hero layout-hero relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100">
      <div className="layout-container">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
            정책자금 전문 컨시어지
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            정책자금 상담 신청
            <span className="block text-blue-600">맞춤 전문가가 함께합니다</span>
          </h1>
          <p className="mt-6 text-lg leading-7 text-slate-600">
            정책자금 특화 심사관이 기업 상황을 분석하고 최적의 전략을 제안합니다.
            <br />
            무료 상담 신청 시 24시간 이내로 연락드립니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/consultation-request#form-section"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-600"
            >
              <i className="fas fa-headset" aria-hidden="true" /> 무료 상담 신청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}







function FaqAnswer({ answer }: { answer: string }) {
  return (
    <div className="consultation-request__faq-answer">
      {answer
        .split(/\r?\n\r?\n/)
        .filter((line) => line.trim().length > 0)
        .map((line, index) => (
          <p key={index}>{line}</p>
        ))}
    </div>
  );
}

function FaqCard({ category }: { category: FaqCategory }) {
  return (
    <article className="consultation-request__faq-card">
      <header className="consultation-request__faq-card-header">
        <div className="consultation-request__faq-card-icon" style={{ backgroundColor: `${category.color}1a`, color: category.color }}>
          {category.icon}
        </div>
        <div>
          <p className="consultation-request__faq-card-eyebrow">{category.name}</p>
          <p className="consultation-request__faq-card-count">{category.questions.length}개 질문</p>
        </div>
      </header>
      <div className="consultation-request__faq-card-body">
        {category.questions.map((question: FaqQuestion) => (
          <details key={question.id} className="consultation-request__faq-item">
            <summary className="consultation-request__faq-question">
              <span className="consultation-request__faq-question-label">Q</span>
              <span className="consultation-request__faq-question-text">{question.question}</span>
              <span className="consultation-request__faq-toggle" aria-hidden="true" />
            </summary>
            <FaqAnswer answer={question.answer} />
          </details>
        ))}
      </div>
    </article>
  );
}

function FaqSection() {
  return (
    <section className="consultation-request__faq" id="qna-section">
      <div className="layout-container consultation-request__faq-inner">
        <div className="consultation-request__faq-header">
          <span className="consultation-request__faq-badge">정책자금 100문 100답</span>
          <h2 className="consultation-request__faq-title">사업하면서 반드시<br />알아야 하는 100가지 필독!</h2>
          <p className="consultation-request__faq-description">
            정책자금 제도, 자격 조건, 준비 서류까지 한눈에 확인하세요.
            <br />
            필요한 내용을 빠르게 찾을 수 있도록 항목별로 정리했습니다.
          </p>
        </div>
        <div className="consultation-request__faq-grid">
          {CONSULTATION_FAQ.map((category) => (
            <FaqCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FormStep = 'contact' | 'business' | 'details';

const FORM_STEPS: Array<{ id: FormStep; title: string; description: string; helper: string }> = [
  {
    id: 'contact',
    title: '기본 정보',
    description: '연락 가능한 정보를 알려주세요.',
    helper: '필수 항목은 * 표시되어 있습니다.',
  },
  {
    id: 'business',
    title: '상담 조건',
    description: '기업 규모와 원하는 상담 유형을 선택해 주세요.',
    helper: '선택한 정보는 요약 카드에 바로 반영됩니다.',
  },
  {
    id: 'details',
    title: '상세 요청 및 동의',
    description: '필요한 내용을 남겨 주시면 더 정확히 도와드릴 수 있어요.',
    helper: '개인정보 수집 및 이용에 동의해야 상담이 가능합니다.',
  },
];

const STEP_REQUIRED_FIELDS: Record<FormStep, (keyof ConsultationFormState)[]> = {
  contact: ['name', 'phone', 'region', 'desiredTime'],
  business: ['consultType', 'annualRevenue', 'employeeCount', 'preferredTime'],
  details: ['privacyConsent'],
};

const STEP_ALL_FIELDS: Record<FormStep, (keyof ConsultationFormState)[]> = {
  contact: ['name', 'phone', 'region', 'desiredTime', 'email', 'businessNumber'],
  business: ['consultType', 'annualRevenue', 'employeeCount', 'preferredTime'],
  details: ['message', 'privacyConsent', 'marketingConsent'],
};

type QuickConsultState = {
  form: ConsultationFormState;
  errors: ConsultationFormErrors;
  currentStep: FormStep;
  isSubmitting: boolean;
  showSuccess: boolean;
  showPrivacyDetail: boolean;
};

type QuickConsultAction =
  | { type: 'SET_FIELD'; field: keyof ConsultationFormState; value: ConsultationFormState[keyof ConsultationFormState] }
  | { type: 'SET_ERRORS'; errors: ConsultationFormErrors }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: FormStep }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_SUCCESS'; value: boolean }
  | { type: 'TOGGLE_PRIVACY_DETAIL'; value: boolean }
  | { type: 'RESET_FORM' };

const INITIAL_REDUCER_STATE: QuickConsultState = {
  form: INITIAL_FORM_STATE,
  errors: {},
  currentStep: 'contact',
  isSubmitting: false,
  showSuccess: false,
  showPrivacyDetail: false,
};

function quickConsultReducer(state: QuickConsultState, action: QuickConsultAction): QuickConsultState {
  switch (action.type) {
    case 'SET_FIELD': {
      const nextErrors = { ...state.errors };
      delete nextErrors[action.field];
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: nextErrors,
      };
    }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'NEXT_STEP': {
      const currentIndex = FORM_STEPS.findIndex((step) => step.id === state.currentStep);
      const nextIndex = Math.min(currentIndex + 1, FORM_STEPS.length - 1);
      return { ...state, currentStep: FORM_STEPS[nextIndex].id };
    }
    case 'PREV_STEP': {
      const currentIndex = FORM_STEPS.findIndex((step) => step.id === state.currentStep);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { ...state, currentStep: FORM_STEPS[prevIndex].id };
    }
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'SET_SUCCESS':
      return { ...state, showSuccess: action.value };
    case 'TOGGLE_PRIVACY_DETAIL':
      return { ...state, showPrivacyDetail: action.value };
    case 'RESET_FORM':
      return { ...INITIAL_REDUCER_STATE };
    default:
      return state;
  }
}

const PHONE_MIN_LENGTH = 10;

const PRIVACY_DETAIL = [
  '수집 항목: 이름, 연락처, 이메일, 상담 요청 내용',
  '수집 목적: 상담 신청 확인 및 맞춤 상담 제공',
  '보유 기간: 상담 종료 후 3년 보관 후 파기',
  '문의: jjk_naraddon@naver.com / 02-6914-5567',
];

const INFO_BENEFITS = [
  '기업 현황을 진단하고 적합한 정책자금·보증 상품을 추천해 드립니다.',
  '전담 심사관이 1:1로 상담 일정을 조율하고 준비 서류를 안내합니다.',
  '신청 후 24시간 이내에 상담 진행 상황을 안내해 드립니다.',
];

const INFO_HIGHLIGHTS = [
  { label: '운영시간', value: '평일 09:00 ~ 18:00' },
  { label: '응답 약속', value: '신청 후 24시간 이내 연락' },
  { label: '상담 채널', value: '전화 · 방문 · 화상 상담' },
];

function getConsultTypeLabel(value: string) {
  const match = CONSULTATION_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? '미선택';
}

function validateContactStep(form: ConsultationFormState): ConsultationFormErrors {
  const nextErrors: ConsultationFormErrors = {};
  if (!form.name.trim()) {
    nextErrors.name = '이름 또는 회사명을 입력해 주세요.';
  }
  if (!form.region.trim()) {
    nextErrors.region = '활동 지역을 입력해주세요.';
  }
  if (!form.desiredTime.trim()) {
    nextErrors.desiredTime = '상담 희망 시간을 입력해주세요.';
  }
  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!phoneDigits) {
    nextErrors.phone = '연락 가능한 휴대전화 번호를 입력해 주세요.';
  } else if (phoneDigits.length < PHONE_MIN_LENGTH) {
    nextErrors.phone = '올바른 형식의 휴대전화 번호인지 확인해 주세요.';
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    nextErrors.email = '올바른 형식의 이메일 주소인지 확인해 주세요.';
  }
  return nextErrors;
}

function validateBusinessStep(form: ConsultationFormState): ConsultationFormErrors {
  const nextErrors: ConsultationFormErrors = {};
  if (!form.consultType) {
    nextErrors.consultType = '필요한 상담 유형을 선택해 주세요.';
  }
  if (!form.annualRevenue) {
    nextErrors.annualRevenue = '연 매출 규모를 선택해 주세요.';
  }
  if (!form.employeeCount) {
    nextErrors.employeeCount = '직원 수를 선택해 주세요.';
  }
  if (!form.preferredTime) {
    nextErrors.preferredTime = '희망 상담 시기를 선택해 주세요.';
  }
  return nextErrors;
}

function validateDetailsStep(form: ConsultationFormState): ConsultationFormErrors {
  const nextErrors: ConsultationFormErrors = {};
  if (!form.privacyConsent) {
    nextErrors.privacyConsent = '개인정보 수집 및 이용에 동의해 주세요.';
  }
  return nextErrors;
}

function validateStep(step: FormStep, form: ConsultationFormState): ConsultationFormErrors {
  switch (step) {
    case 'contact':
      return validateContactStep(form);
    case 'business':
      return validateBusinessStep(form);
    case 'details':
      return validateDetailsStep(form);
    default:
      return {};
  }
}

function validateAll(form: ConsultationFormState): ConsultationFormErrors {
  return FORM_STEPS.reduce<ConsultationFormErrors>((acc, step) => ({
    ...acc,
    ...validateStep(step.id, form),
  }), {});
}

function focusFirstError() {
  requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>('[data-error-field="true"]');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus?.();
    }
  });
}

type StepProgressProps = {
  currentStep: FormStep;
  onSelectStep: (step: FormStep) => void;
  currentIndex: number;
};

function StepProgress({ currentStep, onSelectStep, currentIndex }: StepProgressProps) {
  const progressRatio = FORM_STEPS.length > 1 ? currentIndex / (FORM_STEPS.length - 1) : 1;
  return (
    <div className={styles.stepProgress}>
      <div className={styles.stepProgressHeader}>
        <span className={styles.stepProgressLabel}>진행 상황</span>
        <span className={styles.stepProgressCount}>
          {currentIndex + 1} / {FORM_STEPS.length}
        </span>
      </div>
      <div className={styles.progressBar} aria-hidden="true">
        <span className={styles.progressIndicator} style={{ width: `${Math.max(0, Math.min(1, progressRatio)) * 100}%` }} />
      </div>
      <ul className={styles.stepPills}>
        {FORM_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;
          const isSelectable = index <= currentIndex;
          return (
            <li key={step.id}>
              <button
                type="button"
                className={classNames(
                  styles.stepPill,
                  isActive && styles.stepPillActive,
                  isCompleted && styles.stepPillCompleted,
                )}
                onClick={() => (isSelectable ? onSelectStep(step.id) : undefined)}
                disabled={!isSelectable}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={styles.stepPillIndex}>{index + 1}</span>
                <span className={styles.stepPillTitle}>{step.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type StepPanelProps = {
  step: (typeof FORM_STEPS)[number];
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  hasError: boolean;
  canSelect: boolean;
  onSelect: (step: FormStep) => void;
  canGoBack: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  children: ReactNode;
};

function StepPanel({
  step,
  index,
  isActive,
  isCompleted,
  hasError,
  canSelect,
  onSelect,
  canGoBack,
  isLastStep,
  isSubmitting,
  onPrev,
  onNext,
  children,
}: StepPanelProps) {
  return (
    <section
      className={classNames(
        styles.stepPanel,
        !isActive && styles.stepPanelInactive,
        isCompleted && styles.stepPanelCompleted,
        hasError && styles.stepPanelError,
      )}
      aria-labelledby={`quick-step-${step.id}`}
    >
      <header className={styles.stepHeader}>
        <button
          type="button"
          onClick={() => (canSelect ? onSelect(step.id) : undefined)}
          className={styles.stepHeaderButton}
          aria-expanded={isActive}
          aria-controls={`quick-step-${step.id}-body`}
        >
          <span className={styles.stepIndexBadge}>{index + 1}</span>
          <span className={styles.stepHeaderText}>
            <span id={`quick-step-${step.id}`} className={styles.stepTitle}>
              {step.title}
            </span>
            <span className={styles.stepDescription}>{step.description}</span>
          </span>
        </button>
        {isCompleted && <span className={styles.stepStatus}>완료</span>}
      </header>
      <p className={styles.stepHelper}>{step.helper}</p>
      {isActive && (
        <>
          <div className={styles.stepBody} id={`quick-step-${step.id}-body`}>
            {children}
          </div>
          <StepActions
            canGoBack={canGoBack}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
            onPrev={onPrev}
            onNext={onNext}
            variant="desktop"
          />
          <StepActions
            canGoBack={canGoBack}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
            onPrev={onPrev}
            onNext={onNext}
            variant="mobile"
          />
        </>
      )}
    </section>
  );
}

type StepActionsProps = {
  canGoBack: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  variant: 'desktop' | 'mobile';
};

function StepActions({ canGoBack, isLastStep, isSubmitting, onPrev, onNext, variant }: StepActionsProps) {
  return (
    <div className={variant === 'desktop' ? styles.stepFooter : styles.mobileActions} data-variant={variant}>
      {canGoBack && (
        <button type="button" className={styles.secondaryButton} onClick={onPrev}>
          이전 단계
        </button>
      )}
      <button
        type={isLastStep ? 'submit' : 'button'}
        className={styles.primaryButton}
        onClick={!isLastStep ? onNext : undefined}
        disabled={isSubmitting}
      >
        {isSubmitting ? '전송 중...' : isLastStep ? '상담 신청 보내기' : '다음 단계'}
      </button>
    </div>
  );
}

type SummaryCardProps = {
  form: ConsultationFormState;
};

function FormSummary({ form }: SummaryCardProps) {
  const summaryItems = [
    { label: '이름 / 회사명', value: form.name || '미입력' },
    { label: '연락처', value: form.phone || '미입력' },
    { label: '지역', value: form.region || '미입력' },
    { label: '상담 희망 시간', value: form.desiredTime || '미입력' },
    { label: '이메일', value: form.email || '미입력' },
    { label: '상담 유형', value: getConsultTypeLabel(form.consultType) },
    { label: '연 매출', value: ANNUAL_REVENUE_OPTIONS.find((item) => item.value === form.annualRevenue)?.label || '미선택' },
    { label: '직원 수', value: EMPLOYEE_COUNT_OPTIONS.find((item) => item.value === form.employeeCount)?.label || '미선택' },
    { label: '상담 희망 시간 (선택)', value: PREFERRED_TIME_OPTIONS.find((item) => item.value === form.preferredTime)?.label || '미선택' },
  ];

  return (
    <aside className={styles.summaryCard} aria-label="상담 신청 요약">
      <span className={styles.summaryEyebrow}>신청 정보 요약</span>
      <h3 className={styles.summaryTitle}>현재 입력 내용</h3>
      <dl className={styles.summaryList}>
        {summaryItems.map((item) => (
          <div key={item.label} className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>{item.label}</dt>
            <dd className={styles.summaryValue}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function InfoCard() {
  return (
    <section className={styles.infoCard} aria-label="상담 안내">
      <span className={styles.summaryEyebrow}>상담 안내</span>
      <h3 className={styles.infoTitle}>전담 상담팀이 도와드립니다</h3>
      <p className={styles.infoDescription}>
        기본 정보를 남겨주시면 전담 매니저가 기업 현황을 확인하고 최적의 실행 전략을 제안합니다.
      </p>
      <ul className={styles.infoList}>
        {INFO_BENEFITS.map((item) => (
          <li key={item} className={styles.infoItem}>
            <i className="fas fa-check" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <dl className={styles.infoMeta}>
        {INFO_HIGHLIGHTS.map((item) => (
          <div key={item.label} className={styles.infoMetaItem}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function QuickConsultForm() {
  const [state, dispatch] = useReducer(quickConsultReducer, INITIAL_REDUCER_STATE);
  const { form, errors, currentStep, isSubmitting, showSuccess, showPrivacyDetail } = state;
  const currentIndex = FORM_STEPS.findIndex((step) => step.id === currentStep);
  const isLastStep = currentIndex === FORM_STEPS.length - 1;

  const handleFieldChange = <T extends keyof ConsultationFormState>(field: T) => (value: ConsultationFormState[T]) => {
    let nextValue = value;
    if (field === 'phone' && typeof value === 'string') {
      nextValue = formatPhoneNumber(value) as ConsultationFormState[T];
    }
    if (field === 'businessNumber' && typeof value === 'string') {
      nextValue = formatBusinessNumber(value) as ConsultationFormState[T];
    }
    dispatch({ type: 'SET_FIELD', field, value: nextValue });
  };

  const handleInputChange = <T extends keyof ConsultationFormState>(field: T) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      handleFieldChange(field)(event.target.value as ConsultationFormState[T]);
    };

  const handleCheckboxChange = (field: keyof ConsultationFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFieldChange(field)(event.target.checked as ConsultationFormState[typeof field]);
    };

  const updateErrorsForStep = (step: FormStep, stepErrors: ConsultationFormErrors) => {
    const nextErrors = { ...errors };
    STEP_ALL_FIELDS[step].forEach((field) => {
      if (stepErrors[field]) {
        nextErrors[field] = stepErrors[field];
      } else {
        delete nextErrors[field];
      }
    });
    dispatch({ type: 'SET_ERRORS', errors: nextErrors });
    return nextErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form);
    updateErrorsForStep(currentStep, stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      focusFirstError();
      return;
    }
    dispatch({ type: 'NEXT_STEP' });
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleSelectStep = (step: FormStep) => {
    const targetIndex = FORM_STEPS.findIndex((item) => item.id === step);
    if (targetIndex === -1) return;
    const currentIndexValue = FORM_STEPS.findIndex((item) => item.id === currentStep);
    if (targetIndex === currentIndexValue) return;
    if (targetIndex > currentIndexValue) {
      const stepErrors = validateStep(currentStep, form);
      updateErrorsForStep(currentStep, stepErrors);
      if (Object.keys(stepErrors).length > 0) {
        focusFirstError();
        return;
      }
    }
    dispatch({ type: 'GO_TO_STEP', step });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const stepErrors = validateStep(currentStep, form);
    updateErrorsForStep(currentStep, stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      focusFirstError();
      return;
    }

    const allErrors = validateAll(form);
    if (Object.keys(allErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: allErrors });
      const firstErrorStep = FORM_STEPS.find((step) => STEP_ALL_FIELDS[step.id].some((field) => allErrors[field]));
      if (firstErrorStep) {
        dispatch({ type: 'GO_TO_STEP', step: firstErrorStep.id });
      }
      focusFirstError();
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', value: true });

    try {
      const response = await fetch('/api/consultation/quick-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      dispatch({ type: 'SET_SUCCESS', value: true });
      dispatch({ type: 'SET_ERRORS', errors: {} });
      setTimeout(() => {
        dispatch({ type: 'RESET_FORM' });
      }, 3200);
    } catch (error) {
      console.error('Submission error:', error);
      window.alert('상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  };

  const renderContactStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="consult-name" className={styles.fieldLabel}>
            이름 / 회사명<span className={styles.requiredMark}>*</span>
          </label>
          <input
            id="consult-name"
            name="name"
            type="text"
            autoComplete="name"
            className={styles.input}
            value={form.name}
            onChange={handleInputChange('name')}
            data-error-field={errors.name ? 'true' : undefined}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'consult-name-error' : undefined}
            placeholder="예: 홍길동 / 나라똔"
          />
          {errors.name && (
            <p id="consult-name-error" className={styles.errorText} role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="consult-phone" className={styles.fieldLabel}>
            휴대전화<span className={styles.requiredMark}>*</span>
          </label>
          <input
            id="consult-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={styles.input}
            value={form.phone}
            onChange={handleInputChange('phone')}
            data-error-field={errors.phone ? 'true' : undefined}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'consult-phone-error' : undefined}
            placeholder="010-0000-0000"
          />
          {errors.phone && (
            <p id="consult-phone-error" className={styles.errorText} role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <div className={styles.fieldLabelRow}>
            <label htmlFor="consult-email" className={styles.fieldLabel}>
              이메일
            </label>
            <span className={styles.optionalBadge}>선택</span>
          </div>
          <input
            id="consult-email"
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            value={form.email}
            onChange={handleInputChange('email')}
            data-error-field={errors.email ? 'true' : undefined}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'consult-email-error' : undefined}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="consult-email-error" className={styles.errorText} role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabelRow}>
            <label htmlFor="consult-business-number" className={styles.fieldLabel}>
              사업자등록번호
            </label>
            <span className={styles.optionalBadge}>선택</span>
          </div>
          <input
            id="consult-business-number"
            name="businessNumber"
            type="text"
            inputMode="numeric"
            className={styles.input}
            value={form.businessNumber}
            onChange={handleInputChange('businessNumber')}
            placeholder="123-45-67890"
          />
        </div>
      </div>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="consult-region" className={styles.fieldLabel}>
            지역<span className={styles.requiredMark}>*</span>
          </label>
          <input
            id="consult-region"
            name="region"
            type="text"
            className={styles.input}
            value={form.region}
            onChange={handleInputChange('region')}
            data-error-field={errors.region ? 'true' : undefined}
            aria-invalid={errors.region ? 'true' : undefined}
            aria-describedby={errors.region ? 'consult-region-error' : undefined}
            placeholder="예: 서울 강남구"
          />
          {errors.region && (
            <p id="consult-region-error" className={styles.errorText} role="alert">
              {errors.region}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="consult-desired-time" className={styles.fieldLabel}>
            상담 희망 시간<span className={styles.requiredMark}>*</span>
          </label>
          <input
            id="consult-desired-time"
            name="desiredTime"
            type="text"
            className={styles.input}
            value={form.desiredTime}
            onChange={handleInputChange('desiredTime')}
            data-error-field={errors.desiredTime ? 'true' : undefined}
            aria-invalid={errors.desiredTime ? 'true' : undefined}
            aria-describedby={errors.desiredTime ? 'consult-desired-time-error' : undefined}
            placeholder="예: 평일 오후 2시 이후"
          />
          {errors.desiredTime && (
            <p id="consult-desired-time-error" className={styles.errorText} role="alert">
              {errors.desiredTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderBusinessStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>필요한 상담 유형<span className={styles.requiredMark}>*</span></span>
        <div
          className={styles.consultTypeGrid}
          role="group"
          aria-labelledby="consult-type-label"
          data-error-field={errors.consultType ? 'true' : undefined}
        >
          {CONSULTATION_TYPE_OPTIONS.map((option) => {
            const isSelected = form.consultType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={classNames(styles.consultTypeOption, isSelected && styles.consultTypeOptionActive)}
                onClick={() => handleFieldChange('consultType')(option.value)}
                aria-pressed={isSelected}
              >
                <span className={styles.consultTypeIcon}>{CONSULTATION_TYPE_ICONS[option.value] ?? '?'}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
        {errors.consultType && (
          <p className={styles.errorText} role="alert">
            {errors.consultType}
          </p>
        )}
      </div>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="consult-annual-revenue" className={styles.fieldLabel}>
            연 매출 규모<span className={styles.requiredMark}>*</span>
          </label>
          <select
            id="consult-annual-revenue"
            className={styles.select}
            value={form.annualRevenue}
            onChange={handleInputChange('annualRevenue')}
            data-error-field={errors.annualRevenue ? 'true' : undefined}
            aria-invalid={errors.annualRevenue ? 'true' : undefined}
          >
            <option value="">선택해 주세요</option>
            {ANNUAL_REVENUE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.annualRevenue && (
            <p className={styles.errorText} role="alert">
              {errors.annualRevenue}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="consult-employee-count" className={styles.fieldLabel}>
            직원 수<span className={styles.requiredMark}>*</span>
          </label>
          <select
            id="consult-employee-count"
            className={styles.select}
            value={form.employeeCount}
            onChange={handleInputChange('employeeCount')}
            data-error-field={errors.employeeCount ? 'true' : undefined}
            aria-invalid={errors.employeeCount ? 'true' : undefined}
          >
            <option value="">선택해 주세요</option>
            {EMPLOYEE_COUNT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.employeeCount && (
            <p className={styles.errorText} role="alert">
              {errors.employeeCount}
            </p>
          )}
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="consult-preferred-time" className={styles.fieldLabel}>
          희망 상담 시기<span className={styles.requiredMark}>*</span>
        </label>
        <select
          id="consult-preferred-time"
          className={styles.select}
          value={form.preferredTime}
          onChange={handleInputChange('preferredTime')}
          data-error-field={errors.preferredTime ? 'true' : undefined}
          aria-invalid={errors.preferredTime ? 'true' : undefined}
        >
          <option value="">선택해 주세요</option>
          {PREFERRED_TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.preferredTime && (
          <p className={styles.errorText} role="alert">
            {errors.preferredTime}
          </p>
        )}
      </div>
    </div>
  );

  const MESSAGE_MAX_LENGTH = 600;

  const renderDetailsStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.field}>
        <div className={styles.fieldLabelRow}>
          <label htmlFor="consult-message" className={styles.fieldLabel}>
            상담 요청 내용
          </label>
          <span className={styles.optionalBadge}>선택</span>
        </div>
        <textarea
          id="consult-message"
          className={styles.textarea}
          rows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          value={form.message}
          onChange={handleInputChange('message')}
          placeholder="필요한 지원이나 궁금한 내용을 자유롭게 작성해 주세요."
        />
        <div className={styles.charCount} aria-live="polite">
          {form.message.length}/{MESSAGE_MAX_LENGTH}
        </div>
      </div>
      <div
        className={classNames(styles.consentCard, errors.privacyConsent && styles.consentCardError)}
        data-error-field={errors.privacyConsent ? 'true' : undefined}
      >
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.privacyConsent}
            onChange={handleCheckboxChange('privacyConsent')}
            aria-invalid={errors.privacyConsent ? 'true' : undefined}
          />
          <span>
            개인정보 수집 및 이용에 동의합니다<span className={styles.requiredMark}>*</span>
          </span>
        </label>
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => dispatch({ type: 'TOGGLE_PRIVACY_DETAIL', value: !showPrivacyDetail })}
          aria-expanded={showPrivacyDetail}
        >
          자세히 보기
        </button>
        {showPrivacyDetail && (
          <div className={styles.privacyDetail}>
            <ul>
              {PRIVACY_DETAIL.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {errors.privacyConsent && (
          <p className={styles.errorText} role="alert">
            {errors.privacyConsent}
          </p>
        )}
      </div>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={form.marketingConsent} onChange={handleCheckboxChange('marketingConsent')} />
        <span>정책 정보와 맞춤 알림을 받아볼게요 (선택)</span>
      </label>
    </div>
  );

  if (showSuccess) {
    return (
      <section id="form-section" className={styles.section}>
        <div className={styles.successContainer}>
          <div className={styles.successCard} role="status">
            <div className={styles.successIcon}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
                <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>상담 신청이 접수되었습니다!</h3>
            <p className={styles.successDescription}>평일 기준 24시간 이내에 담당자가 연락드립니다. 빠르게 도와드릴게요.</p>
            <div className={styles.successActions}>
              <a href="tel:0269145567" className={styles.successButton}>
                <i className="fas fa-phone" aria-hidden="true" /> 바로 전화 연결
              </a>
              <Link href="#qna-section" className={styles.successButtonSecondary}>
                자주 묻는 질문 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="form-section" className={styles.section}>
      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <StepProgress currentStep={currentStep} currentIndex={currentIndex} onSelectStep={handleSelectStep} />
          {FORM_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentIndex;
            const canSelect = isCompleted || index === currentIndex;
            const hasError = STEP_ALL_FIELDS[step.id].some((field) => Boolean(errors[field]));
            let body: ReactNode;
            if (step.id === 'contact') {
              body = renderContactStep();
            } else if (step.id === 'business') {
              body = renderBusinessStep();
            } else {
              body = renderDetailsStep();
            }
            return (
              <StepPanel
                key={step.id}
                step={step}
                index={index}
                isActive={isActive}
                isCompleted={isCompleted}
                hasError={hasError}
                canSelect={canSelect}
                onSelect={handleSelectStep}
                canGoBack={index > 0}
                isLastStep={index === FORM_STEPS.length - 1}
                isSubmitting={isSubmitting}
                onPrev={handlePrev}
                onNext={handleNext}
              >
                {body}
              </StepPanel>
            );
          })}
        </form>
        <div className={styles.sideColumn}>
          <FormSummary form={form} />
          <InfoCard />
        </div>
      </div>
    </section>
  );
}


function CtaSection() {
  return (
    <section className="consultation-request__cta-section" aria-labelledby="consultation-request-cta-title">
      <div className="consultation-request__cta-container">
        <div className="consultation-request__cta">
          <div className="consultation-request__cta-banner">
            <div className="consultation-request__cta-content">
              <p className="consultation-request__cta-eyebrow">정책자금 상담 지원</p>
              <h3 id="consultation-request-cta-title" className="consultation-request__cta-title">
                지금 바로 전문가와
                <br />
                맞춤 전략을 준비하세요
              </h3>
              <p className="consultation-request__cta-subtitle">
                정책자금 전문 심사관이 신청 기업을 1:1로 지원하며 최적의 성공 전략을 설계해 드립니다.
              </p>
            </div>
            <Link href="/consultation-request#form-section" className="consultation-request__cta-button">
              무료 상담 신청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}







export default function ConsultationRequestPage() {
  useEffect(() => {
    const scrollToHashTarget = () => {
      const { hash } = window.location;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    scrollToHashTarget();
    window.addEventListener('hashchange', scrollToHashTarget);
    return () => window.removeEventListener('hashchange', scrollToHashTarget);
  }, []);

  return (
    <div className="consultation-request">
      <ConsultationHero />
      <FaqSection />
      <QuickConsultForm />
      <CtaSection />
    </div>
  );
}



