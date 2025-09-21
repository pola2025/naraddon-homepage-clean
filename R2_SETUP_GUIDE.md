# Cloudflare R2 Public Access 설정 가이드

## 📌 R2 버킷 Public Access 활성화

### Step 1: Cloudflare Dashboard 접속
1. https://dash.cloudflare.com 로그인
2. 좌측 메뉴에서 **R2** 선택
3. `naraddon-assets` 버킷 선택

### Step 2: Public Access 설정
1. **Settings** 탭 클릭
2. **Public Access** 섹션 찾기
3. **Allow public access** 활성화
4. 경고 메시지 확인 후 **Confirm** 클릭

### Step 3: Public Domain 확인
Public Access 활성화 후 제공되는 도메인:
- 형식: `https://pub-{hash}.r2.dev`
- 예시: `https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev`

### Step 4: CORS 정책 설정
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## 🔧 환경변수 설정

### 로컬 환경 (.env.local)
```bash
CLOUDFLARE_R2_PUBLIC_DOMAIN=https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev
```

### Vercel 환경변수
```bash
echo -n "https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev" | npx vercel env add CLOUDFLARE_R2_PUBLIC_DOMAIN production
```

## 🔐 보안 고려사항

### Public Access 사용 시 주의점
1. **민감한 데이터 업로드 금지**
   - 썸네일 이미지만 업로드
   - 개인정보 포함 파일 금지

2. **파일명 난독화**
   - UUID 사용으로 추측 방지
   - 타임스탬프 포함

3. **접근 제어**
   - 업로드: API 키 인증 필요
   - 다운로드: Public 허용

## 📊 비용 관리

### R2 요금 체계
- **저장**: $0.015/GB/월
- **Class A 작업** (쓰기): $4.50/백만 요청
- **Class B 작업** (읽기): $0.36/백만 요청
- **무료 할당량**:
  - 10GB 저장
  - 100만 Class A 요청/월
  - 1000만 Class B 요청/월

### 비용 절감 팁
1. 이미지 최적화 (WebP, AVIF 형식)
2. 적절한 캐시 헤더 설정
3. CDN 활용

## 🧪 테스트 방법

### 1. Public URL 테스트
```bash
# 업로드된 파일 접근 테스트
curl -I https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev/naraddon-tube/thumbnails/test.jpg
```

### 2. 업로드 테스트
```bash
node scripts/test-thumbnail-upload.js
```

## 🚀 Custom Domain 설정 (선택사항)

### Step 1: Domain 추가
1. R2 버킷 Settings > Custom Domains
2. Add Custom Domain 클릭
3. 도메인 입력 (예: `assets.naraddon.com`)

### Step 2: DNS 설정
Cloudflare DNS에 CNAME 레코드 추가:
```
Type: CNAME
Name: assets
Target: pub-{hash}.r2.dev
Proxy: Yes (Orange Cloud)
```

### Step 3: 환경변수 업데이트
```bash
CLOUDFLARE_R2_PUBLIC_DOMAIN=https://assets.naraddon.com
```

## 📝 체크리스트

- [ ] R2 버킷 Public Access 활성화
- [ ] Public Domain 확인
- [ ] CORS 정책 설정
- [ ] 환경변수 추가 (로컬)
- [ ] 환경변수 추가 (Vercel)
- [ ] 업로드 테스트
- [ ] Public URL 접근 테스트

## 🔗 참고 링크

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Public Buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [CORS Configuration](https://developers.cloudflare.com/r2/buckets/cors/)

---
*작성일: 2025-09-21*
*최종 업데이트: 2025-09-21*