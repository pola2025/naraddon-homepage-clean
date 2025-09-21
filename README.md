# 나라똔 홈페이지 (Naraddon Homepage)

## 🌐 라이브 사이트
- **프로덕션**: https://naraddon.com
- **스테이징**: (GitHub 연동 후 생성)
- **개발**: (GitHub 연동 후 생성)

## 🚀 주요 기능

### 비즈니스 서비스
- **나라똔과 함께한 대표님 인터뷰**: CEO 인터뷰 동영상 갤러리
- **나라똔튜브**: 동영상 콘텐츠 플랫폼
- **전문가 서비스**: 전문가 컨설팅 및 매칭
- **정책 뉴스**: 정책 관련 뉴스 및 분석
- **똔똔톡**: 비즈니스 커뮤니티 게시판

### 관리자 기능
- 콘텐츠 업로드 및 관리
- 비밀번호 보호 관리자 페이지
- 이미지/동영상 자산 관리 (Cloudflare R2)
- MongoDB 데이터베이스 연동

## 🛠 기술 스택
- **프레임워크**: Next.js 14.1.0 (App Router)
- **스타일링**: Tailwind CSS
- **데이터베이스**: MongoDB Atlas
- **스토리지**: Cloudflare R2
- **배포**: Vercel
- **버전 관리**: Git & GitHub

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔐 환경 변수
`.env.local` 파일이 필요합니다. 필요한 환경 변수:
- `MONGODB_URI`: MongoDB 연결 문자열
- `NARADDON_TUBE_PASSWORD`: 나라똔튜브 관리자 비밀번호
- `CLOUDFLARE_R2_*`: Cloudflare R2 설정
- 기타 서비스별 비밀번호

## 📝 브랜치 전략
- `main`: 프로덕션 배포
- `staging`: 스테이징 환경
- `dev`: 개발 통합
- `feature/*`: 기능 개발

## 🔄 배포 프로세스
1. feature 브랜치에서 개발
2. dev로 PR 및 병합
3. staging에서 QA
4. main으로 최종 배포

## 📞 문의
- 이메일: mkt9834@gmail.com

## 라이센스
© 2025 나라똔. All rights reserved.