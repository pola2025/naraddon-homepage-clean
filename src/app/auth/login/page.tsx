'use client';

import type { ReactNode } from 'react';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  LEGAL_BUSINESS_INFO,
  LEGAL_EFFECTIVE_DATE,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
  type LegalModalType,
  type LegalSection,
} from '@/lib/legalContent';

type ProviderId = 'naver' | 'kakao' | 'google';

type SocialProvider = {
  id: ProviderId;
  label: string;
  helper: string;
  className: string;
  icon: ReactNode;
  helperClass: string;
  ctaClass: string;
};


const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: 'naver',
    label: '네이버 로그인',
    helper: '네이버 아이디로 간편하게 시작하세요',
    className:
      'bg-[#03C75A] text-white hover:bg-[#02b351] hover:shadow-[0_12px_40px_rgba(3,199,90,0.35)] focus-visible:ring-[#02b351]',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        role="img"
        aria-hidden="true"
        className="rounded-lg"
      >
        <rect width="28" height="28" rx="6" fill="#03C75A" />
        <path
          fill="#fff"
          d="M8 6.5h4.4l4.4 6.3V6.5h4.9v15h-4.4l-4.4-6.3v6.3H8z"
        />
      </svg>
    ),
    helperClass: 'text-xs text-white/80 sm:text-sm',
    ctaClass: 'text-white/80 group-hover:text-white',
  },
  {
    id: 'kakao',
    label: '카카오 로그인',
    helper: '카카오톡으로 쉽고 빠른 인증',
    className:
      'bg-[#FEE500] text-[#191600] hover:bg-[#f5dc00] hover:shadow-[0_12px_40px_rgba(254,229,0,0.35)] focus-visible:ring-[#3c1e1e] focus-visible:ring-offset-[#fbe403]',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 56 56"
        role="img"
        aria-hidden="true"
        className="rounded-lg"
      >
        <path
          fill="#391B1B"
          d="M28 8C15.85 8 6 16.12 6 26.08c0 6.23 4.24 11.66 10.67 14.62l-2.22 8.15a1 1 0 0 0 1.52 1.09l9.43-6.01a29 29 0 0 0 2.6.12c12.15 0 22-8.11 22-18.95C50 16.12 40.15 8 28 8z"
        />
      </svg>
    ),
    helperClass: 'text-xs text-[#2c2100] sm:text-sm',
    ctaClass: 'text-[#191600]/70 group-hover:text-[#191600]',
  },
  {
    id: 'google',
    label: 'Google 로그인',
    helper: 'Google 계정을 연동해 주세요',
    className:
      'bg-white text-[#3c4043] border border-slate-200 hover:bg-[#f8f9fa] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-visible:ring-[#4285F4] focus-visible:ring-offset-white',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 48 48"
        role="img"
        aria-hidden="true"
        className="rounded-lg border border-[#dadce0] bg-white"
      >
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.84-6.84C35.9 2.42 30.51 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8 6.2C12.33 13.54 17.66 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.73H24v9h12.65c-.54 2.92-2.2 5.4-4.69 7.07l7.35 5.71C43.63 37.22 46.5 31.09 46.5 24z" />
        <path fill="#FBBC05" d="M12.56 26.58a9.04 9.04 0 0 1-.47-2.58c0-.89.17-1.76.47-2.58l-8-6.2A23.88 23.88 0 0 0 0 24c0 3.86.9 7.5 2.56 10.78z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.35-5.71C30.73 38.48 27.59 39.5 24 39.5c-6.34 0-11.67-4.04-13.44-9.5l-8 6.2C6.51 42.62 14.62 48 24 48z" />
      </svg>
    ),
    helperClass: 'text-xs text-slate-500 sm:text-sm',
    ctaClass: 'text-[#3c4043]/70 group-hover:text-[#3c4043]',
  },
];

function LoginForm() {
  const searchParams = useSearchParams();
  const [modalProvider, setModalProvider] = useState<SocialProvider | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType | null>(null);
  const redirect = searchParams.get('redirect') || '/';
  const legalModalSections: LegalSection[] = legalModal
    ? legalModal === 'terms'
      ? TERMS_SECTIONS
      : PRIVACY_SECTIONS
    : [];
  const legalModalTitle =
    legalModal === 'terms'
      ? '나라똔 서비스 이용약관'
      : legalModal === 'privacy'
        ? '나라똔 개인정보 처리방침'
        : '';
  const legalModalDescription =
    legalModal === 'terms'
      ? '나라똔 서비스 이용에 앞서 반드시 확인해야 할 이용약관 전문입니다.'
      : legalModal === 'privacy'
        ? '나라똔이 수집하고 이용하는 개인정보의 처리 기준과 이용자 권리를 안내합니다.'
        : '';
  const handleOpenLegalModal = (type: LegalModalType) => {
    setModalProvider(null);
    setLegalModal(type);
  };
  const handleCloseLegalModal = () => setLegalModal(null);

  const handleSocialLogin = (provider: SocialProvider) => {
    setModalProvider(provider);
    console.info('[login]', provider.id, 'button clicked; redirect target:', redirect);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50 py-16 px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,64,175,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_60%)]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl text-center lg:text-left">
          <span className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
            Naraddon Sign In
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            SNS 계정 하나로
            <span className="block text-blue-600">안전하고 빠르게 로그인하세요</span>
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            별도의 아이디/비밀번호 없이 네이버·카카오·Google 계정으로 바로 이용하실 수 있습니다.
            로그인 후에는 정책자료, 상담내역 등 모든 서비스를 한 곳에서 확인할 수 있어요.
          </p>
        </div>

        <div className="w-full max-w-lg">
          <div className="rounded-3xl bg-white/90 px-8 py-10 shadow-2xl ring-1 ring-slate-100 backdrop-blur-sm sm:px-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">소셜 로그인</h2>
              <p className="mt-2 text-sm text-slate-500">
                사용하고 계신 SNS 계정을 선택해 주세요. 추가 정보 입력 없이 바로 연결됩니다.
              </p>
            </div>

            <div className="space-y-3">
              {SOCIAL_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleSocialLogin(provider)}
                  className={`group flex w-full items-center justify-between rounded-xl px-5 py-4 text-left shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 ${provider.className}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-semibold shadow-sm">
                      {provider.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-base font-semibold sm:text-lg">{provider.label}</span>
                      <span className={provider.helperClass}>{provider.helper}</span>
                    </span>
                  </span>
                  <span className={`text-xs font-medium uppercase tracking-wider ${provider.ctaClass}`}>
                    준비 중
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-slate-400">
              소셜 로그인 시 나라똔 서비스 이용약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => handleOpenLegalModal('terms')}
                className="rounded-full px-2 py-1 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                이용약관
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => handleOpenLegalModal('privacy')}
                className="rounded-full px-2 py-1 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                개인정보 처리방침
              </button>
              <span aria-hidden="true">·</span>
              <Link href="/" className="hover:text-slate-600">
                홈으로 이동
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="login-modal-title" className="text-lg font-semibold text-slate-900">
                서비스 준비 중입니다
              </h2>
              <button
                type="button"
                onClick={() => setModalProvider(null)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="모달 닫기"
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>
            <p id="login-modal-description" className="mt-4 text-sm leading-6 text-slate-600">
              {modalProvider.label} 기능은 현재 준비 중입니다. 정식 오픈 후 다시 안내드릴게요.
              곧 편리한 소셜 로그인을 제공할 예정입니다.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalProvider(null)}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            aria-describedby={legalModalDescription ? 'legal-modal-description' : undefined}
            className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="legal-modal-title" className="text-lg font-semibold text-slate-900">
                  {legalModalTitle}
                </h2>
                {legalModalDescription && (
                  <p id="legal-modal-description" className="mt-1 text-sm text-slate-500">
                    {legalModalDescription}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCloseLegalModal}
                className="self-start rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="모달 닫기"
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 max-h-[70vh] space-y-6 overflow-y-auto pr-1 text-sm leading-6 text-slate-600">
              {legalModalSections.map((section) => (
                <section key={section.title} className="space-y-2">
                  <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                  <p>{section.description}</p>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="list-disc space-y-1 pl-5 text-slate-600">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                <h4 className="font-semibold text-slate-700">사업자 정보</h4>
                <dl className="mt-2 space-y-1">
                  {LEGAL_BUSINESS_INFO.map((item) => (
                    <div key={item.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                      <dt className="font-medium text-slate-600">{item.label}</dt>
                      <dd className="text-slate-500 sm:text-slate-600">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-slate-400">시행일자: {LEGAL_EFFECTIVE_DATE}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseLegalModal}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
