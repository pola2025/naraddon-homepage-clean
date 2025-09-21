# 📱 Vercel 프리뷰 시스템 사용 가이드

## 새 기능 개발 시 워크플로우

### 1. 새 기능 브랜치 생성
```bash
git checkout -b feature/new-video-upload
```

### 2. 개발 및 커밋
```bash
git add .
git commit -m "feat: 새로운 비디오 업로드 기능 추가"
git push origin feature/new-video-upload
```

### 3. 자동 프리뷰 배포
- Vercel이 자동으로 프리뷰 URL 생성
- 예: `https://naraddon-feature-new-video-upload.vercel.app`

### 4. Pull Request 생성
```bash
# GitHub에서 PR 생성 또는 CLI 사용
gh pr create --title "새 비디오 업로드 기능" --body "설명..."
```

### 5. 프리뷰 확인
- PR 페이지에 Vercel 봇이 댓글로 프리뷰 URL 제공
- 팀원들과 프리뷰 URL 공유하여 피드백 받기

## 프리뷰 환경 특징

### ✅ 장점
- **실시간 프리뷰**: 푸시할 때마다 자동 업데이트
- **독립 환경**: 각 브랜치별 독립된 URL
- **안전한 테스트**: 프로덕션 영향 없이 테스트
- **팀 협업**: URL 공유로 쉬운 피드백

### 🔧 프리뷰 환경 설정
- 각 프리뷰는 독립된 환경변수 사용 가능
- Vercel Dashboard → Settings → Environment Variables
- Preview 환경용 변수 별도 설정

## 실제 사용 예시

### 시나리오: 비밀번호 문제 수정
```bash
# 1. 수정 브랜치 생성
git checkout -b fix/password-validation

# 2. 코드 수정
# ... 수정 작업 ...

# 3. 커밋 및 푸시
git add .
git commit -m "fix: 나라똔튜브 비밀번호 검증 오류 수정"
git push origin fix/password-validation

# 4. 프리뷰 URL에서 테스트
# https://naraddon-fix-password-validation.vercel.app

# 5. 테스트 성공 시 main으로 PR
# 6. PR 머지 → 자동 프로덕션 배포
```

## 프리뷰 URL 관리

### Vercel Dashboard에서 확인
1. 프로젝트 페이지 접속
2. "Deployments" 탭
3. 각 배포별 URL 확인 가능

### 프리뷰 URL 수명
- 브랜치 삭제 전까지 유지
- 30일 이상 업데이트 없으면 자동 삭제 가능
- 필요시 재배포로 다시 생성

## 환경별 테스트 체크리스트

### 프리뷰에서 확인할 사항
- [ ] 새 기능 정상 작동
- [ ] 기존 기능 영향 없음
- [ ] UI/UX 문제 없음
- [ ] 모바일 반응형 확인
- [ ] 환경변수 정상 작동
- [ ] API 연동 테스트

### 프로덕션 배포 전 확인
- [ ] staging 브랜치에서 최종 테스트
- [ ] 모든 팀원 승인
- [ ] 백업 준비 완료
- [ ] 롤백 계획 수립