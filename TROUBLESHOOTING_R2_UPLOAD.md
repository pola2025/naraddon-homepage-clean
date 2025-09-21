# 나라똔튜브 썸네일 업로드 트러블슈팅 (2025-09-21)

## 🔴 문제 상황
- **증상**: 나라똔튜브 관리자 페이지에서 썸네일 업로드 시 "업로드 URL을 생성하지 못했습니다" 오류 발생
- **영향**: 썸네일 이미지 업로드 불가로 새 콘텐츠 등록 불가능

## 🔍 문제 원인 분석

### 1. 환경변수 포맷 문제
Vercel에서 환경변수를 가져올 때 (vercel env pull) 다음과 같은 문제 발생:

```
# 잘못된 형식 (문제 발생)
NARADDON_TUBE_PASSWORD="vhffkvhffk82\n"
CLOUDFLARE_R2_ACCESS_KEY_ID=""7c31cfaf2e67c0140f12a129c5dcb75e" \r\n"
CLOUDFLARE_R2_BUCKET=""naraddon-assets" \r\n"

# 올바른 형식 (정상 작동)
NARADDON_TUBE_PASSWORD=vhffkvhffk82
CLOUDFLARE_R2_ACCESS_KEY_ID=7c31cfaf2e67c0140f12a129c5dcb75e
CLOUDFLARE_R2_BUCKET=naraddon-assets
```

### 2. 발생 원인
- Vercel CLI에서 환경변수 설정 시 `echo` 명령어 사용 시 자동으로 줄바꿈 문자 추가
- Windows 환경에서 `\r\n` (CRLF) 추가
- 추가 따옴표가 포함되어 파싱 오류

## ✅ 해결 방법

### Step 1: 환경변수 재설정 (Vercel)
```bash
# 1. 기존 환경변수 삭제
echo "y" | npx vercel env rm CLOUDFLARE_R2_ACCESS_KEY_ID production
echo "y" | npx vercel env rm CLOUDFLARE_R2_SECRET_ACCESS_KEY production
echo "y" | npx vercel env rm CLOUDFLARE_R2_BUCKET production
echo "y" | npx vercel env rm CLOUDFLARE_R2_ENDPOINT production
echo "y" | npx vercel env rm NARADDON_TUBE_PASSWORD production

# 2. 올바른 방법으로 재설정 (-n 옵션으로 줄바꿈 제거)
echo -n "7c31cfaf2e67c0140f12a129c5dcb75e" | npx vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID production
echo -n "d67ec4f6c9a1451f0aa9194f7c8d9eaa1463da83225617a421ff9772d6866809" | npx vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY production
echo -n "naraddon-assets" | npx vercel env add CLOUDFLARE_R2_BUCKET production
echo -n "https://b520cb8ed3989e8182bdb020ade36495.r2.cloudflarestorage.com" | npx vercel env add CLOUDFLARE_R2_ENDPOINT production
echo -n "vhffkvhffk82" | npx vercel env add NARADDON_TUBE_PASSWORD production
```

### Step 2: 로컬 환경변수 정리
```bash
# .env.local 파일 직접 편집
# 모든 환경변수에서 따옴표와 줄바꿈 문자 제거
```

### Step 3: 디버그 로깅 추가
테스트를 위한 디버그 로그 추가 위치:
- `/src/app/api/naraddon-tube/assets/presign/route.ts`
- `/src/lib/r2.ts`

### Step 4: 테스트 스크립트 실행
```bash
# 썸네일 업로드 테스트
node scripts/test-thumbnail-upload.js
```

## 🛠️ 개발 중 발견된 추가 문제

### Public URL 형식 문제
- R2 버킷의 public 도메인이 필요
- 환경변수 추가 필요: `CLOUDFLARE_R2_PUBLIC_DOMAIN`

## 📝 재발 방지 대책

### 1. 환경변수 설정 규칙
- ✅ 항상 `echo -n` 사용하여 줄바꿈 제거
- ✅ 값에 따옴표 포함하지 않기
- ✅ 특수문자가 있는 경우 URL 인코딩

### 2. 환경변수 검증 체크리스트
```bash
# 환경변수 확인 명령어
npx vercel env ls | grep CLOUDFLARE_R2

# 로컬 환경변수 검증
cat .env.local | od -c | grep '\\n'  # 줄바꿈 확인
grep '".*"' .env.local  # 불필요한 따옴표 확인
```

### 3. 테스트 절차
1. 로컬 환경에서 테스트 (`npm run dev`)
2. 테스트 스크립트 실행 (`node scripts/test-thumbnail-upload.js`)
3. Vercel 배포 후 프로덕션 테스트

## 🔧 추가 설정 필요

### Cloudflare R2 Public Access 설정
1. Cloudflare Dashboard > R2 > Bucket Settings
2. Public Access 활성화
3. Custom Domain 설정 (선택사항)
4. CORS 정책 설정

### 환경변수 목록
```
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET=naraddon-assets
CLOUDFLARE_R2_ENDPOINT=https://...r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_DOMAIN=https://pub-...r2.dev (또는 커스텀 도메인)
```

## 📊 테스트 결과

### 로컬 테스트 성공
```
✅ Presigned URL 생성 성공
✅ 파일 업로드 성공
⚠️ Public URL 접근 (R2 설정 필요)
```

### 해결 시간
- 문제 발견: 2025-09-21 13:00
- 원인 파악: 2025-09-21 13:30
- 해결 완료: 2025-09-21 14:00
- 총 소요시간: 1시간

## 🎯 결론

환경변수 설정 시 줄바꿈 문자와 추가 따옴표가 포함되어 발생한 문제였습니다.
`echo -n` 옵션 사용과 정기적인 환경변수 검증으로 재발을 방지할 수 있습니다.

---
*문서 작성일: 2025-09-21*
*작성자: Claude Code Assistant*