## 2025-09-18 18:15 – 전문가 페이지 보증 섹션 세로 레이아웃 문제 해결

### 현상
- /experts 페이지에서 보증 섹션 문구가 세로로 길게 쌓이고 홈 화면과 동일한 스타일이 섞임.

### 원인
- 홈 TrustSection 컴포넌트가 사용하는 .trust-* 클래스명이 글로벌하게 선언돼 있었고, 전문가 페이지 전용 CSS 역시 동일한 클래스명을 기반으로 우선순위를 올리려다 보니 서로 충돌함.
- DOM에는 <div class="trust-content-horizontal">…</div> 구조가 그대로 남아 있어, 홈 스타일이 그대로 적용되는 상황.

### 조치
1. 홈 전용 TrustSection 컴포넌트를 home-trust-* 접두사로 전면 리네이밍(src/components/TrustSection.js, src/components/TrustSection.css, 관련 백업 사본들 동기화).
2. 홈에서 해당 클래스를 참조하던 src/styles/floating-cards.css 등 보조 스타일도 동일하게 수정.
3. 전문가 페이지는 새 모듈형 컴포넌트 TrustGuarantee 로 구성해 클래스 해시 기반으로 독립 동작.

### 결과
- 홈/전문가 페이지 모두 가로 레이아웃 유지, 스타일 충돌 제거.
- DOM 검사 시 홈은 home-trust-*, 전문가 페이지는 TrustGuarantee_* 형태로 명확히 분리 확인.

---
## 2025-09-19 22:50 상담신청 히어로 좌우 오프셋 불일치

### 증상
- 상담신청 페이지의 히어로 텍스트 블록 시작점이 인증 기업심사관/전문가 서비스 대비 오른쪽으로 치우쳐 보임.

### 원인
- .consultation-request에서 --layout-max-width를 1240px로 재정의하여 layout-container 폭이 다른 페이지(기본 1280px)보다 좁았음.
- max-w-3xl 블록이 왼쪽 정렬되어 있어 줄어든 컨테이너 폭만큼 오른쪽 여백이 크게 남아 측정 값이 달라짐.

### 조치
1. src/app/consultation-request/page.css에서 --layout-max-width 값을 1280px로 수정하여 다른 히어로와 동일한 컨테이너 폭을 사용하도록 맞춤.

### 결과
- 상담신청 히어로의 좌우 여백이 인증 기업심사관/전문가 서비스와 동일하게 정렬되어 오른쪽으로 들어가 보이는 현상이 해소됨.

---
