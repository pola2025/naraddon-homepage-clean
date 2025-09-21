# 히어로 섹션 분석 비교표

## 페이지별 히어로 섹션 차이점 분석

| 항목 | Business Voice | Certified Examiners | Expert Services | Ttontok |
|------|----------------|---------------------|-----------------|---------|
| **클래스명** | `expert-hero` | `expert-hero` | `expert-hero` | `ttontok-header` |
| **전체 구조** | Tailwind + custom CSS | Tailwind + custom CSS | Tailwind + custom CSS | 완전 custom CSS |

## 상세 CSS 값 비교

### 1. 높이 설정

| 페이지 | 패딩 설정 | 실제 높이 계산 |
|--------|-----------|----------------|
| **Business Voice** | `padding-top: calc(--header-offset + --hero-top-padding)` <br> `padding-bottom: --hero-bottom-padding` | 상단: 80px + 16~32px = 96~112px <br> 하단: 48~88px |
| **Certified Examiners** | `padding-top: calc(--header-offset + --hero-top-padding - 40px)` <br> `padding-bottom: --hero-bottom-padding` | 상단: 80px + 16~32px - 40px = 56~72px <br> 하단: 48~88px |
| **Expert Services** | `padding-top: calc(--hero-top-padding + --header-offset - 40px)` <br> `padding-bottom: --hero-bottom-padding` | 상단: 16~32px + 80px - 40px = 56~72px <br> 하단: 48~88px |
| **Ttontok** | `padding: 60px 20px 40px` | 고정값: 상단 60px, 하단 40px |

### 2. 좌우 여백 (Container Padding)

| 페이지 | 모바일 여백 | 데스크톱 여백 | 최대 너비 |
|--------|-------------|---------------|-----------|
| **Business Voice** | `16px` | `60px` | `1280px` |
| **Certified Examiners** | `16px` | `60px` | `1280px` |
| **Expert Services** | `clamp(20px, 5vw, 60px)` | `clamp(20px, 5vw, 60px)` | `1280px` |
| **Ttontok** | `20px` | `20px` | `1200px` |

### 3. 배경 스타일

| 페이지 | 배경 그라데이션 | 오버레이 효과 |
|--------|----------------|----------------|
| **Business Voice** | `linear-gradient(135deg, #e8f2ff 0%, #ffffff 55%, #f8fdf9 100%)` | radial-gradient 오버레이 |
| **Certified Examiners** | `linear-gradient(135deg, #e8f2ff 0%, #ffffff 55%, #f8fdf9 100%)` | radial-gradient 오버레이 |
| **Expert Services** | `bg-gradient-to-br from-blue-50 via-white to-sky-100` (Tailwind) | 없음 |
| **Ttontok** | `linear-gradient(135deg, #00c896 0%, #00a67e 100%)` | 없음 |

### 4. 텍스트 정렬 및 최대 너비

| 페이지 | 콘텐츠 최대 너비 | 텍스트 정렬 | 제목 크기 |
|--------|------------------|-------------|-----------|
| **Business Voice** | Tailwind `max-w-3xl` (768px) | 좌측 정렬 | `text-4xl sm:text-5xl` |
| **Certified Examiners** | Tailwind `max-w-3xl` (768px) | 좌측 정렬 | `text-4xl sm:text-5xl` |
| **Expert Services** | Tailwind `max-w-3xl` (768px) | 좌측 정렬 | `text-4xl sm:text-5xl` |
| **Ttontok** | `max-width: 1200px` | 중앙 정렬 | `font-size: 2.5rem` |

### 5. CTA 버튼 배치

| 페이지 | 버튼 레이아웃 | 버튼 스타일 | 추가 요소 |
|--------|---------------|-------------|-----------|
| **Business Voice** | `flex flex-wrap gap-6` | 2개 버튼 (primary + secondary) | 없음 |
| **Certified Examiners** | `flex flex-wrap gap-6` | 1개 버튼 (primary) | 없음 |
| **Expert Services** | `flex flex-wrap gap-6` | 1개 버튼 (primary) | 통계 카드들 |
| **Ttontok** | 없음 | 없음 | 없음 |

### 6. 반응형 브레이크포인트

| 페이지 | 태블릿 헤더 오프셋 | 모바일 헤더 오프셋 | 특별한 반응형 처리 |
|--------|-------------------|-------------------|-------------------|
| **Business Voice** | `120px` (1024px 이하) | `110px` (768px 이하) | clamp() 함수 활용 |
| **Certified Examiners** | `120px` (1024px 이하) | `110px` (768px 이하) | clamp() 함수 활용 |
| **Expert Services** | `120px` (1024px 이하) | `110px` (768px 이하) | clamp() 함수 활용 |
| **Ttontok** | 고정 `60px` | 고정 `60px` | 기본 미디어 쿼리만 |

## 주요 불일치 문제점

### 1. 높이 불일치
- **Certified Examiners, Expert Services**: `-40px` 보정으로 인해 다른 페이지보다 40px 낮음
- **Ttontok**: 완전히 다른 고정 높이 체계 사용

### 2. 여백 불일치
- **Expert Services**: `clamp()` 함수로 유동적 여백
- **Ttontok**: 고정 20px 여백으로 다른 페이지 대비 좁음

### 3. 스타일 접근법 불일치
- **Business Voice, Certified Examiners**: CSS Variables + Tailwind 혼합
- **Expert Services**: 순수 Tailwind
- **Ttontok**: 완전 custom CSS

### 4. 콘텐츠 너비 불일치
- **Business Voice, Certified Examiners, Expert Services**: `max-w-3xl` (768px)
- **Ttontok**: `max-width: 1200px` (훨씬 넓음)

### 5. 정렬 방식 불일치
- **Business Voice, Certified Examiners, Expert Services**: 좌측 정렬
- **Ttontok**: 중앙 정렬

## 표준화 권장사항

### 1. 통일된 높이 체계
```css
--hero-header-offset: 80px;
--hero-padding-top: clamp(16px, 4vw, 32px);
--hero-padding-bottom: clamp(48px, 6vw, 88px);
```

### 2. 통일된 여백 체계
```css
--hero-container-padding: clamp(16px, 5vw, 60px);
--hero-max-width: 1280px;
```

### 3. 통일된 콘텐츠 너비
```css
--hero-content-max-width: 768px; /* Tailwind max-w-3xl */
```

### 4. 표준 배경 스타일
```css
--hero-background: linear-gradient(135deg, #e8f2ff 0%, #ffffff 55%, #f8fdf9 100%);
```

### 5. 반응형 헤더 오프셋
```css
--hero-header-offset-mobile: 110px;
--hero-header-offset-tablet: 120px;
--hero-header-offset-desktop: 80px;
```