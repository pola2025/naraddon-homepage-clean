export type ExpertServiceHero = {
  badge: string;
  title: string;
  highlight: string;
  subtitleHtml: string;
  stats: Array<{ label: string; value: string }>;
};

export type ConsultField = {
  id: string;
  label: string;
  icon: string;
};

export type TimingOption = {
  value: string;
  label: string;
};

export type ExpertServiceCta = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type PrivacyNotice = {
  sections: Array<{ title: string; body: string }>;
  confirmLabel: string;
};

export const expertServiceHero: ExpertServiceHero = {
  badge: 'EXPERT SERVICE',
  title: '전문가와 함께합니다',
  highlight: '맞춤형 성장 전략',
  subtitleHtml:
    '세무·재무·정책자금 분야 인증 전문가가 필요한 전략을 <br />사례별로 분석하고 행동 계획까지 제시해드립니다.',
  stats: [],
} as const;

export type ExpertProfile = {
  name: string;
  position: string;
  companyName: string;
  specialties: string[];
  imageKey: string;
};

export const expertProfiles: ExpertProfile[] = [
  {
    name: '\ubc31\uacbd\uc6b0',
    position: '\ubcc0\ub9ac\uc0ac',
    companyName: '\ubc31\uacbd\ud2b9\ud5c8\ubc95\ub960\uc0ac\ubb34\uc18c',
    specialties: ['\ud2b9\ud5c8', '\uc0c1\ud45c', '\ub514\uc790\uc778', '\ubca4\ucc98\uc778\uc99d', '\uae30\uc5c5\uc778\uc99d'],
    imageKey: 'baek-kyung-woo',
  },
  {
    name: '\uc131\ubbfc\uc11d',
    position: '\uc138\ubb34\uc0ac',
    companyName: '\uc138\ubb34\ubc95\uc778 \uc6b0\uc9c4',
    specialties: ['\uc138\ubb34\uc870\uc0ac', '\uc808\uc138\uc804\ub7b5', '\uae30\uc5c5\uc790\ubb38', '\uc7ac\ubb34\uc81c\ud45c', '\ubc95\uc778\uc138'],
    imageKey: 'sung-min-seok',
  },
  {
    name: '\uc804\uae30\ud64d',
    position: '\ud589\uc815\uc0ac',
    companyName: '\ucc3d\uc131',
    specialties: ['\uadfc\ub85c\uacc4\uc57d', '\ub178\ubb34\uad00\ub9ac', '\uc778\uc0ac\uc81c\ub3c4', '4\ub300\ubcf4\ud5d8', '\uc678\uad6d\uc778\uadfc\ub85c\uc790'],
    imageKey: 'jeon-ki-hong',
  },
  {
    name: '\ucd5c\uc77c\ud604',
    position: '\ud68c\uacc4\uc0ac',
    companyName: '\uc6b0\uc77c\ud68c\uacc4\ubc95\uc778',
    specialties: ['\uc0ac\uc5c5\uacc4\ud68d', '\ud22c\uc790\uc720\uce58', '\uacbd\uc601\uc9c4\ub2e8', '\uc131\uacfc\uad00\ub9ac', 'M&A'],
    imageKey: 'choi-il-hyun',
  },
];

export const consultFields: ConsultField[] = [
  { id: 'legal', label: '법무·특허', icon: 'fa-gavel' },
  { id: 'tax', label: '세무·회계', icon: 'fa-calculator' },
  { id: 'labor', label: '인사·노무', icon: 'fa-users' },
  { id: 'marketing', label: '마케팅·브랜딩', icon: 'fa-bullhorn' },
  { id: 'tech', label: '기술·IT', icon: 'fa-laptop-code' },
  { id: 'strategy', label: '경영전략', icon: 'fa-chess' },
];

export const timingOptions: TimingOption[] = [
  { value: 'immediate', label: '즉시 상담' },
  { value: 'week', label: '1주 이내' },
  { value: 'two_weeks', label: '2주 이내' },
  { value: 'month', label: '1개월 이내' },
];

export const expertServiceCta: ExpertServiceCta = {
  title: '지금 바로 전문가와 상담을 시작해보세요',
  subtitle:
    '검증된 정책분석 전문가가 1:1로 맞춤 전략을 제안해드립니다. 1차 사전상담 100% 무료, 대면 상담 시 상세 내용을 안내해드립니다.',
  primaryLabel: '무료 상담 신청',
  secondaryLabel: '정책 안내 자료 모아보기',
};

export const privacyNotice: PrivacyNotice = {
  sections: [
    { title: '수집 항목', body: '이름, 연락처, 이메일, 회사명, 상담 요청 내용' },
    { title: '이용 목적', body: '상담 일정 조율 및 맞춤 전문가 추천 안내' },
    { title: '보관 기간', body: '상담 완료 후 3개월까지 보관 후 파기' },
    {
      title: '미동의 시 불이익',
      body: '동의를 거부할 수 있으나, 거부 시 상담 서비스 이용이 제한될 수 있습니다.',
    },
  ],
  confirmLabel: '개인정보 수집 및 이용에 동의합니다',
};

export const successMessage =
  '상담 요청이 접수되었습니다. 24시간 이내에 담당 전문가가 연락드릴 예정입니다.';
