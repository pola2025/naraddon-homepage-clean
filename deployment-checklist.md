# Deployment Checklist

## 필수 파일 및 폴더 체크리스트

### 핵심 파일
- [x] package.json - 프로젝트 의존성 정의
- [x] package-lock.json - 의존성 버전 고정
- [x] next.config.js - Next.js 설정
- [x] tsconfig.json - TypeScript 설정
- [x] tailwind.config.js - Tailwind CSS 설정
- [x] postcss.config.js - PostCSS 설정
- [ ] .env.local - 환경 변수 (보안상 gitignore)
- [ ] .env.production - 프로덕션 환경 변수

### 소스 코드 폴더
- [x] /src - 메인 소스 코드
  - [x] /app - Next.js 앱 라우터
  - [x] /components - React 컴포넌트
  - [x] /lib - 유틸리티 함수
  - [x] /models - 데이터 모델
  - [x] /contexts - React Context
  - [x] /styles - 스타일 파일

### 정적 자원
- [x] /public - 정적 파일
  - [ ] /videos - 비디오 파일
  - [ ] /images - 이미지 파일
  - [ ] favicon.ico

### 빌드 관련
- [ ] /.next - 빌드 출력 (gitignore, 빌드 시 생성)
- [ ] /node_modules - 의존성 패키지 (gitignore, npm install로 생성)

### 설정 파일
- [x] .eslintrc.json - ESLint 설정
- [x] .prettierrc - Prettier 설정
- [ ] .gitignore - Git 제외 파일 목록
- [ ] vercel.json - Vercel 배포 설정 (선택사항)

## 배포 전 체크리스트

### 1. 의존성 설치
```bash
npm ci  # package-lock.json 기준으로 정확한 버전 설치
```

### 2. 환경 변수 설정
```bash
# .env.local 또는 .env.production에 필요한 환경 변수 설정
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 3. 빌드 테스트
```bash
npm run build  # 빌드 오류 확인
npm run start  # 프로덕션 모드 테스트
```

### 4. 보안 체크
- [ ] API 키가 하드코딩되지 않았는지 확인
- [ ] 민감한 정보가 코드에 포함되지 않았는지 확인
- [ ] 적절한 CORS 설정 확인

### 5. 성능 최적화
- [x] ESLint 오류 해결
- [x] Prettier 포맷팅 적용
- [ ] 이미지 최적화 (next/image 사용)
- [ ] 불필요한 console.log 제거

## 배포 명령어

### Vercel 배포
```bash
npm run deploy  # package.json에 정의된 배포 스크립트
```

### 수동 빌드 및 실행
```bash
npm run build
npm run start
```

## 문제 해결

### 일반적인 문제
1. **Module not found**: npm ci 실행
2. **환경 변수 누락**: .env 파일 확인
3. **빌드 실패**: TypeScript/ESLint 오류 확인
4. **런타임 오류**: 로그 확인 및 error-handler.ts 체크