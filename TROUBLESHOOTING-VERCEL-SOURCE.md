# 트러블슈팅: Vercel 배포 소스코드 획득 불가

## 문제 설명
Vercel에 배포된 실제 소스코드를 로컬로 가져올 수 없는 문제

## 발생일시
2025-09-18 11:40

## 문제 상세

### Vercel의 소스코드 관리 방식
1. **소스 저장 위치**: GitHub 저장소 (https://github.com/pola2025/naraddon-nextjs)
2. **빌드 프로세스**: GitHub에서 소스를 가져와 Vercel 서버에서 빌드
3. **배포 파일**: 빌드된 결과물만 서빙 (원본 소스 접근 불가)

### 시도한 방법들과 결과

| 명령어 | 목적 | 결과 |
|--------|------|------|
| `vercel pull` | 배포 소스 다운로드 | ❌ 환경변수와 설정만 다운로드 |
| `vercel inspect --logs` | 빌드 로그 확인 | ✅ 빌드 정보 확인 가능 |
| `git pull origin main` | GitHub 최신 소스 | ❌ 이미 최신 상태 |

## 빌드 로그 분석 결과

### 정상 빌드된 페이지들
```
├ ○ /certified-examiners     6.78 kB    91.4 kB
├ ○ /experts                 5.79 kB    90.4 kB
├ ○ /expert-services         5.18 kB    89.8 kB
├ ○ /consultation-request    15.4 kB    100 kB
```

### 주요 발견사항
- 2025-09-15 빌드 시점에 모든 페이지가 정상 빌드됨
- 1034개의 배포 파일 확인
- Next.js 14.1.0 버전 사용

## 원인 분석

### 가능한 시나리오
1. **로컬과 GitHub 불일치**
   - GitHub에 푸시되지 않은 변경사항 존재 가능성
   - 다른 개발자가 직접 GitHub에서 수정했을 가능성

2. **Vercel 빌드 시 변환**
   - Vercel이 빌드 과정에서 파일을 자동 생성했을 가능성
   - 환경변수나 설정에 따른 동적 페이지 생성

3. **히스토리 손실**
   - Git 히스토리가 force push로 덮어써졌을 가능성
   - 특정 커밋이 삭제되었을 가능성

## 해결 방안

### 1. GitHub 웹에서 직접 확인
```bash
# GitHub 웹 브라우저에서 확인
https://github.com/pola2025/naraddon-nextjs/tree/main/src/app
```

### 2. Git 히스토리 복원
```bash
# 모든 커밋 히스토리 확인
git log --oneline --all --graph

# 특정 파일의 히스토리 추적
git log --follow src/app/certified-examiners/page.tsx
```

### 3. Vercel CLI 빌드 재현
```bash
# 로컬에서 Vercel 빌드 환경 재현
vercel build
vercel dev
```

## 핵심 문제

**Vercel은 소스코드 다운로드 기능을 제공하지 않음**
- 보안상의 이유로 컴파일된 결과물만 제공
- 원본 소스는 항상 연결된 Git 저장소에서 관리
- `vercel pull`은 환경변수와 프로젝트 설정만 동기화

## 권장 조치

1. **즉시 조치**
   - GitHub 웹에서 실제 파일 내용 확인
   - 로컬과 차이점 비교

2. **장기 대책**
   - 모든 변경사항은 Git을 통해 관리
   - 배포 전 항상 GitHub에 푸시
   - 정기적인 백업 자동화

## 결론

Vercel에 배포된 소스코드를 직접 다운로드하는 것은 **불가능**합니다.
실제 소스는 GitHub 저장소를 확인해야 하며, 로컬과 GitHub이 동기화되지 않은 것이 근본 원인입니다.

---

*이 문서는 Vercel 배포 소스코드 획득 시도와 관련된 트러블슈팅 기록입니다.*