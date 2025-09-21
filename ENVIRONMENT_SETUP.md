# 환경변수 설정 가이드 (MongoDB & Cloudflare R2)

## ⚠️ 중요 사항

Vercel 환경변수 설정 시 **줄바꿈 문자나 추가 따옴표가 포함되지 않도록 주의**해야 합니다.

## 문제 발생 원인

1. **줄바꿈 문자 포함**: 환경변수 값에 `\n`이 포함되어 인증 실패
2. **이중 따옴표 포함**: 값에 `"value"` 형태로 따옴표가 포함되어 파싱 오류
3. **캐리지 리턴 포함**: Windows 환경에서 `\r\n`이 포함되어 오류 발생

## Cloudflare R2 환경변수 설정

### 필수 환경변수

```bash
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET=naraddon-assets
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

### Vercel CLI를 통한 올바른 설정 방법

```bash
# 잘못된 방법 (줄바꿈 포함)
echo "value" | npx vercel env add VAR_NAME production  # ❌

# 올바른 방법 (줄바꿈 제거)
echo -n "value" | npx vercel env add VAR_NAME production  # ✅
```

### 환경변수 재설정 절차

1. **기존 환경변수 제거**
```bash
echo "y" | npx vercel env rm CLOUDFLARE_R2_ACCESS_KEY_ID production
```

2. **새 환경변수 추가 (줄바꿈 없이)**
```bash
echo -n "7c31cfaf2e67c0140f12a129c5dcb75e" | npx vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID production
```

3. **모든 환경에 적용**
```bash
# Production과 Development 모두에 적용
echo -n "value" | npx vercel env add VAR_NAME production
echo -n "value" | npx vercel env add VAR_NAME development
```

## MongoDB 환경변수 설정

### 필수 환경변수

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 주의사항

- 비밀번호에 특수문자가 있을 경우 URL 인코딩 필요
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`

## 비밀번호 환경변수 설정

### 나라똔튜브 관리자 비밀번호

```bash
NARADDON_TUBE_PASSWORD=your_password
```

### 기타 서비스 비밀번호

```bash
QA_WRITE_PASSWORD=password
TTONTOK_WRITE_PASSWORD=password
EXPERT_SERVICES_ADMIN_PASSWORD=password
BUSINESS_VOICE_INTERVIEW_PASSWORD=password
POLICY_ANALYSIS_PASSWORD=password
POLICY_NEWS_PASSWORD=password
```

## 환경변수 확인 방법

### 1. Vercel CLI로 확인
```bash
# 모든 환경변수 목록 보기
npx vercel env ls

# Production 환경변수만 보기
npx vercel env ls production
```

### 2. 로컬에서 실제 값 확인
```bash
# 환경변수를 로컬 파일로 가져오기
npx vercel env pull .env.local

# 특정 변수 확인
grep "CLOUDFLARE_R2" .env.local
```

### 3. 값 검증
```bash
# 줄바꿈 문자 확인
cat .env.local | od -c | grep '\\n'

# 따옴표 확인
grep '".*"' .env.local
```

## 문제 해결

### 썸네일 업로드 실패 시

1. **R2 설정 확인**
```bash
npx vercel env ls | grep CLOUDFLARE_R2
```

2. **환경변수 재설정**
```bash
# 모든 R2 환경변수 재설정
for var in CLOUDFLARE_R2_ACCESS_KEY_ID CLOUDFLARE_R2_SECRET_ACCESS_KEY CLOUDFLARE_R2_BUCKET CLOUDFLARE_R2_ENDPOINT; do
  echo "y" | npx vercel env rm $var production
done

# 올바른 값으로 재추가
echo -n "access_key_id" | npx vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID production
echo -n "secret_key" | npx vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY production
echo -n "naraddon-assets" | npx vercel env add CLOUDFLARE_R2_BUCKET production
echo -n "https://endpoint.r2.cloudflarestorage.com" | npx vercel env add CLOUDFLARE_R2_ENDPOINT production
```

3. **재배포**
```bash
npx vercel --prod
```

### 인증 실패 시

1. **비밀번호 환경변수 확인**
```bash
npx vercel env ls | grep PASSWORD
```

2. **줄바꿈 제거하여 재설정**
```bash
echo "y" | npx vercel env rm NARADDON_TUBE_PASSWORD production
echo -n "vhffkvhffk82" | npx vercel env add NARADDON_TUBE_PASSWORD production
```

## 배포 후 확인사항

1. **환경변수 적용 확인**: Vercel 대시보드 > Settings > Environment Variables
2. **빌드 로그 확인**: 환경변수 관련 에러 메시지 체크
3. **런타임 테스트**: 실제 기능 동작 확인

## 모범 사례

1. **환경변수 값 저장 시 항상 `-n` 옵션 사용**
2. **특수문자가 포함된 경우 URL 인코딩 적용**
3. **Development와 Production 환경변수 동기화**
4. **정기적인 환경변수 검증**
5. **.env.local 파일은 절대 커밋하지 않기**

## 참고 링크

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)