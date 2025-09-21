# 히어로 섹션 표준화 프롬프트

## 📊 현재 상황 분석

### ✅ 표준 그룹 (이미 동일한 구조)
- **상담신청** (consultation-request)
- **인증 기업심사관** (certified-examiners)
- **전문가 서비스** (expert-services)

**공통 특징:**
- HTML 구조: `expert-hero layout-hero` 클래스 사용
- Tailwind CSS 기반 스타일링
- 기본 CSS Variables 사용

### 🔄 표준화 필요 그룹
- **정책분석** (policy-analysis)
- **사업자목소리** (business-voice)

## 🎯 정확한 표준화 요구사항

### 1. 정책분석 페이지 문제점
```html
<!-- 현재 (문제) -->
<span className="...">CERTIFIED EXAMINERS</span>
<h1>정책분석</h1>
```
**문제:** 배지 텍스트가 "CERTIFIED EXAMINERS"로 잘못되어 있음

### 2. 사업자목소리 페이지 문제점
```css
/* 현재 (문제) */
.business-voice-container .expert-hero {
  margin-top: calc(-1 * var(--business-voice-header-offset));
  padding-top: calc(var(--business-voice-header-offset) + var(--business-voice-hero-top-padding));
  /* 복잡한 CSS Variables 오버라이드 */
}
```
**문제:** 불필요한 CSS 오버라이드로 인한 높이/여백 차이

## 🎯 표준화 프롬프트

### Phase 1: 정책분석 페이지 수정
```
"정책분석 페이지의 히어로 섹션을 다음과 같이 수정해줘:

1. 배지 텍스트 수정:
   - 현재: 'CERTIFIED EXAMINERS'
   - 변경: 'POLICY ANALYSIS'

2. 파일 위치: src/components/policy/PolicyAnalysis.js
3. 다른 내용은 그대로 유지하고 배지 텍스트만 변경

변경 전:
<span className=\"...\">CERTIFIED EXAMINERS</span>

변경 후:
<span className=\"...\">POLICY ANALYSIS</span>"
```

### Phase 2: 사업자목소리 페이지 수정
```
"사업자목소리 페이지의 히어로 섹션 CSS를 표준화해줘:

1. 파일 위치: src/app/business-voice/page.css
2. 제거할 CSS 오버라이드:
   - .business-voice-container .expert-hero의 모든 커스텀 스타일
   - CSS Variables 오버라이드 (--business-voice-hero-* 관련)

3. 표준 구조로 변경:
   - 다른 페이지와 동일한 기본 expert-hero 스타일 사용
   - 불필요한 CSS Variables 제거
   - layout-hero의 기본 패딩/마진 사용

4. 유지할 내용:
   - HTML 구조는 그대로 (expert-hero layout-hero 클래스)
   - 배지, 제목, 설명 텍스트는 현재대로 유지
   - 버튼들도 현재대로 유지

목표: 상담신청, 인증기업심사관, 전문가서비스와 동일한 히어로 높이/여백 적용"
```

### Phase 3: 검증 프롬프트
```
"히어로 섹션 표준화 검증을 해줘:

1. 다음 5개 페이지의 히어로 섹션이 동일한 높이/여백을 가지는지 확인:
   - 상담신청 (/consultation-request)
   - 인증기업심사관 (/certified-examiners)
   - 전문가서비스 (/expert-services)
   - 정책분석 (/policy-analysis)
   - 사업자목소리 (/business-voice)

2. 확인 항목:
   - 상단 여백 (header offset)
   - 하단 여백
   - 좌우 패딩
   - 전체 히어로 높이
   - 배경 그라데이션

3. 차이점이 있다면 구체적으로 어떤 차이인지 보고하고 수정 방안 제시"
```

## 🔧 추가 최적화 프롬프트 (선택사항)

### 공통 컴포넌트화
```
"히어로 섹션을 재사용 가능한 컴포넌트로 만들어줘:

1. 컴포넌트명: HeroSection
2. Props 인터페이스:
   - badge: string (배지 텍스트)
   - title: string (메인 제목)
   - highlight?: string (강조 텍스트)
   - subtitle: string (부제목)
   - primaryButton?: { text: string, href: string }
   - secondaryButton?: { text: string, href: string }

3. 모든 히어로 섹션을 이 컴포넌트로 대체
4. 기존 스타일링과 레이아웃은 완전히 동일하게 유지
5. TypeScript 지원"
```

## 📋 단계별 실행 가이드

1. **Phase 1 실행**: 정책분석 배지 텍스트 수정
2. **Phase 2 실행**: 사업자목소리 CSS 표준화
3. **Phase 3 실행**: 전체 검증 및 미세 조정
4. **Optional**: 공통 컴포넌트화

각 단계별로 하나씩 진행하여 안전성 확보!