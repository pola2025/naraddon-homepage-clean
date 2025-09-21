# 🌳 나라똔 홈페이지 브랜치 전략

## 브랜치 구조

### 1. **main** (프로덕션)
- 실제 서비스 배포 브랜치
- URL: https://naraddon.com
- 직접 커밋 금지, PR을 통해서만 병합

### 2. **staging** (스테이징)
- 프로덕션 배포 전 최종 테스트
- URL: https://staging-naraddon.vercel.app
- QA 및 최종 검증용

### 3. **dev** (개발)
- 개발 작업 통합 브랜치
- URL: https://dev-naraddon.vercel.app
- 새 기능 개발 및 테스트

### 4. **feature/[기능명]** (기능 개발)
- 개별 기능 개발용
- 예: feature/new-upload-system
- 개발 완료 후 dev로 병합

## 배포 프로세스

```
feature/* → dev → staging → main
```

1. 기능 개발: feature 브랜치에서 작업
2. 개발 테스트: dev 브랜치로 병합 후 프리뷰 확인
3. QA: staging 브랜치로 병합 후 최종 테스트
4. 프로덕션: main 브랜치로 병합하여 실제 배포

## 롤백 방법

### 긴급 롤백 (Vercel Dashboard)
1. Vercel 대시보드 접속
2. Deployments 탭 클릭
3. 이전 성공 배포 찾기
4. "..." 메뉴 → "Promote to Production" 클릭

### Git을 통한 롤백
```bash
# 이전 커밋으로 되돌리기
git checkout main
git revert HEAD
git push origin main

# 특정 버전으로 되돌리기
git checkout main
git reset --hard [커밋해시]
git push --force origin main
```

## 프리뷰 URL 패턴

- PR 프리뷰: `https://naraddon-pr-[번호].vercel.app`
- 브랜치 프리뷰: `https://naraddon-[브랜치명].vercel.app`

## 환경변수 관리

각 환경별로 다른 환경변수 설정 가능:
- Production: 실제 서비스용 DB, API 키
- Preview: 테스트용 DB, 테스트 API 키
- Development: 로컬 개발용 설정