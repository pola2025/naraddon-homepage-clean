# 트러블슈팅: 배포 버전과 로컬 버전 간 URL 경로 불일치

## 문제 설명
배포된 Vercel 버전과 로컬 개발 환경 간 페이지 URL 경로가 일치하지 않는 문제 발생

## 발생일시
2025-09-18

## 문제 상세

### 경로 불일치 현황

| 페이지 | 배포 버전 (Vercel) | 로컬 버전 | 상태 |
|------|-------------------|-----------|------|
| 인증 심사관 | `/certified-examiners` | `/expert-services` | ❌ 불일치 |
| 전문가 목록 | `/experts` | `/expert-services` | ❌ 불일치 |
| 상담 신청 | `/consultation-request` | `/consultation-request` | ✅ 일치 |

### 구체적 URL 비교

**배포 버전 (정상 작동)**
- https://naraddon-nextjs.vercel.app/certified-examiners
- https://naraddon-nextjs.vercel.app/experts
- https://naraddon-nextjs.vercel.app/consultation-request

**로컬 버전 (잘못된 경로)**
- http://localhost:3001/expert-services (존재하나 다른 내용)
- http://localhost:3001/certified-examiners (404 에러)
- http://localhost:3001/experts (404 에러)

## 원인 분석

### 1. 파일 시스템 구조 확인
```
현재 구조:
src/app/
├── expert-services/     # 잘못된 경로명
│   ├── page.tsx
│   └── page.css
├── consultation-request/  # 올바른 경로
│   ├── page.tsx
│   └── page.css
```

### 2. 필요한 구조
```
src/app/
├── certified-examiners/   # 추가 필요
│   └── page.tsx
├── experts/               # 추가 필요
│   └── page.tsx
├── consultation-request/  # 이미 존재
│   └── page.tsx
```

## 해결 방안

### 1단계: 디렉토리 구조 수정
1. `src/app/certified-examiners` 디렉토리 생성
2. `src/app/experts` 디렉토리 생성

### 2단계: 페이지 파일 생성
1. 배포 버전과 동일한 내용으로 `certified-examiners/page.tsx` 작성
2. 배포 버전과 동일한 내용으로 `experts/page.tsx` 작성

### 3단계: 기존 파일 처리
- `expert-services` 폴더는 별도 페이지로 유지 또는 삭제 검토

## 진행 상태

- [x] 문제 식별
- [x] 원인 분석
- [x] certified-examiners 페이지 생성 - **실패**
- [x] experts 페이지 생성 - **실패**
- [x] 로컬 테스트 - **콘텐츠 불일치**
- [ ] Git 커밋 및 푸시

## 실패 사례 기록

### 첫 번째 시도 (실패)
**시간**: 2025-09-18 11:30
**방법**:
1. `H:\Naraddon\naraddon-homepage\naraddon-nextjs`에서 파일 복사 시도
2. `certified-examiners`와 `experts` 디렉토리 생성
3. 기존 `expert-services` 파일 복사

**결과**:
- ❌ 배포 버전과 전혀 다른 콘텐츠 표시
- ❌ 원본 파일이 이미 임시 페이지로 되어 있었음
- ❌ 백업 파일도 모두 임시 페이지 상태

**원인 분석**:
- 원본 소스 자체가 이미 손상되어 있음
- 실제 배포된 버전의 소스코드가 로컬에 없음
- Vercel에서 직접 소스 다운로드 불가능

## 새로운 해결 방안

### 두 번째 시도 (진행 중)
**시간**: 2025-09-18 11:35
**방법**:
1. 배포된 Vercel 사이트를 직접 분석
2. WebFetch를 통해 페이지 구조와 콘텐츠 추출
3. 추출한 내용을 기반으로 React 컴포넌트 재구성

**현재 상황**:
- certified-examiners 페이지는 원본에 존재하지만 배포 버전과 다름
- experts 페이지는 원본에 아예 존재하지 않음
- 배포된 버전이 실제 정상 작동하는 유일한 소스

**권장 조치**:
1. 배포 버전을 정확히 분석하여 재구현
2. 또는 Vercel 프로젝트 설정 확인하여 실제 빌드 소스 추적
3. GitHub Actions나 Vercel 빌드 로그에서 소스 위치 파악

## 참고 사항

### 배포 버전 페이지 내용 요약

**certified-examiners 페이지**
- 제목: 나라똔 인증 기업심사관
- 20명의 인증 심사관 소개
- 90% 평균 승인율 강조
- 100% 서비스 보증

**experts 페이지**
- 전문가 서비스 카테고리 표시
- 경영지원, 재무/회계, 성장지원, 산업특화 분야

## 추가 조치 필요 사항

1. 원본 소스 위치 확인: `H:\Naraddon\naraddon-homepage\naraddon-nextjs`
2. 백업 파일 검색 및 복원
3. Vercel 프로젝트와 동기화 확인
4. URL 라우팅 설정 검토

## 해결 예정 시각
즉시 진행 중

---

*이 문서는 배포 버전과 로컬 버전 간 URL 경로 불일치 문제를 해결하기 위한 트러블슈팅 기록입니다.*