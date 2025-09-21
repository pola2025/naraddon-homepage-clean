# 상담신청 폼 구조 개편 기획안

## 1. 개요
- 대상: `src/app/consultation-request/page.tsx` 내 `QuickConsultForm` 및 관련 스타일(`QuickConsultForm.module.css`)
- 목표: 세로로 과도하게 긴 단일 폼을 단계형 구조로 재편하여 완성률을 높이고, 모바일/데스크톱에서 일관된 사용자 경험 제공
- 적용 범위: UI 레이아웃, 입력 컴포넌트 구조, 상태/검증 흐름, 반응형 및 접근성 패턴

## 2. 핵심 목표
1. **진행 흐름 가시화**: 단계별 내비게이션과 진행률로 현재 위치/남은 항목을 즉시 파악 가능
2. **입력 부담 완화**: 한 화면에 필요한 최소 항목만 노출, 추가 정보는 조건부 확장
3. **컨텍스트 유지**: 상담 요약·안내를 스크롤 중에도 유지하여 이탈 감소
4. **모바일 최적화**: 하단 고정 CTA 및 슬라이드형 단계 전환으로 긴 스크롤 최소화
5. **접근성 준수**: 의미 있는 시맨틱 구조와 명확한 오류 피드백 제공

## 3. UX 흐름 설계
### 3.1 단계 구성
| 단계 | 주요 목적 | 필드 | 추가 설명 |
| --- | --- | --- | --- |
| Step 1. 기본 정보 | 연락 가능한 최소 정보 수집 | 이름/회사명, 휴대전화, 이메일(선택) | 설명 스트립: "연락처 확인 후 24시간 내 회신" |
| Step 2. 상담 조건 | 상담 유형/규모 파악 | 상담 유형(대표 3개 + 기타), 연 매출, 직원 수, 희망 시간 | 선택형 요소 중심, 기타 선택 시 추가 입력 모달 |
| Step 3. 상담 세부 & 동의 | 상담 목적/메모, 개인정보 동의 | 자유 입력(예시 제공), 필수 동의, 선택 마케팅 동의 | 개인정보 상세 내용은 확장형 카드 |

### 3.2 전환 동선
- Step 노출 방식: 탭형 헤더 + 카드 컨테이너
- Desktop: 세 단계 모두 한 페이지에 표시하되, 한 번에 한 단계만 확장
- Mobile: 상단 슬라이드(1/3 표시) + 하단 "다음" 버튼으로 순차 이동
- Step 완료 시 다음 단계 자동 포커스, 오류 발생 시 해당 단계로 강제 이동

### 3.3 완료 후 행동
- 성공 화면(`successCard`) 유지하되, 추가 CTA 2종 제공  
  1. "상담 일정 확인하기" (추후 일정 페이지 연동)  
  2. "필요 서류 미리 보기" (문서 안내 PDF/링크)

## 4. 레이아웃/컴포넌트 구조
```
QuickConsultForm
├── StepProgress (progress bar + step pill nav)
├── Layout
│   ├── MainColumn (active step content)
│   │   ├── StepPanel (fieldset + legend)
│   │   │   ├── StepHeader (icon + title + helper)
│   │   │   ├── StepBody (form fields)
│   │   │   └── StepFooter (prev/next buttons)
│   └── SideColumn (sticky summary / FAQ / contact)
└── GlobalFooterCTA (mobile floating bar)
```

### 4.1 반응형 규칙
- Desktop ≥ 1024px: `MainColumn:SideColumn = 1.2 : 0.8` 비율, `SideColumn`은 `position: sticky; top: 120px`
- Tablet: SideColumn 100% 폭으로 Main 아래 이동, StepPanel 여백 축소
- Mobile ≤ 768px: StepHeader 아코디언, `GlobalFooterCTA` 고정(높이 72px)

### 4.2 스타일 토큰
- 공통 변수: `--consult-form-max-width`, `--consult-form-padding`, `--consult-form-radius`
- 버튼: 기존 `expert-services__cta-button` 변형 사용 (색상 = 틸/블루)
- 필드: 52px 높이, `box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35)`

## 5. 상태 & 검증 설계
- `useReducer`로 `formState`, `currentStep`, `validationState` 관리
- 검증 시나리오:
  - Step 제출 시 `validateStep(currentStep)` → 실패 시 해당 StepPanel에 오류 배지 + 메시지
  - 전체 제출 전 마지막 Step에서 필수 동의 체크 확인
- 데이터 저장: `sessionStorage` 동기화 옵션(오류 시 재입력 방지), 향후 API 연동 고려해 `pending` 상태 처리

## 6. 상호작용 & 접근성
- `StepPanel`을 `fieldset`/`legend`로 구성, `aria-labelledby` 연결
- 단계 내 버튼 `aria-controls`로 `StepBody` ID 바인딩
- 오류 메시지: `role="alert"`, `aria-live="polite"`, 해당 필드와 `aria-describedby` 연결
- 모바일 하단 CTA: `aria-hidden` 관리 (PC에서는 감추기)

## 7. 구현 단계 제안
1. **레이아웃 리팩터링**: StepProgress + 2컬럼 레이아웃 + sticky side
2. **Step 컴포넌트화**: StepPanel/ StepHeader/ StepFooter 분리
3. **폼 필드 모듈화**: 공통 `FormField` 컴포넌트 도입(라벨/헬퍼/에러)
4. **상태 관리 전환**: `useReducer` 및 step 기반 검증 적용
5. **모바일 인터랙션**: 아코디언 + 하단 CTA 구현, 터치 접근성 확인
6. **시각 스타일 다듬기**: 토큰 반영, 다크/라이트 대비 점검
7. **QA & 접근성**: 키보드 네비게이션, 스크린리더 테스트, 다양한 데이터 시나리오 검증

## 8. 후속 TODO
- 상담 유형 목록 정규화(대표 3종 + 기타): 향후 API 연동 고려
- FAQ/서류 안내를 별도 데이터 모듈(`src/data/consultationFaq.ts`)로 분리
- 성공 화면 CTA 클릭 시 후속 플로우 정의 (ex. 일정 예약 모달)

---
문의나 수정 의견 있으면 알려주시면 반영하겠습니다.
