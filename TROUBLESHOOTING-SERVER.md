# Naraddon Homepage 서버 문제 해결 가이드

## 빠른 실행 방법

### 방법 1: PowerShell 스크립트 사용 (권장)
1. PowerShell을 관리자 권한으로 실행
2. 다음 명령어 실행:
```powershell
cd H:\Naraddon\homepage
.\start-server.ps1
```

### 방법 2: 배치 파일 사용
1. `H:\Naraddon\homepage\start-server.bat` 더블 클릭

### 방법 3: 수동 실행
```bash
cd H:\Naraddon\homepage
npm run dev
```

## 일반적인 문제 및 해결 방법

### 1. "npm is not recognized" 오류
**원인**: Node.js가 설치되지 않음
**해결**: 
- https://nodejs.org 에서 Node.js LTS 버전 다운로드 및 설치
- 설치 후 터미널 재시작

### 2. "Cannot find module" 오류
**원인**: 패키지가 제대로 설치되지 않음
**해결**:
```bash
cd H:\Naraddon\homepage
# node_modules 삭제
rmdir /s node_modules
del package-lock.json
# 패키지 재설치
npm install
```

### 3. "Port 3000 is already in use" 오류
**원인**: 다른 프로그램이 포트 3000 사용 중
**해결**:

#### 방법 1: 다른 포트로 실행 (권장)
```bash
# Next.js 서버를 포트 3001에서 실행
npm run dev -- --port 3001

# 또는 미리 설정된 스크립트 사용
npm run dev:3001
```

> **2025-09 업데이트**: `npm run dev:3001` 실행 전에 `scripts/kill-port.ps1`이 자동으로 포트 3001을 정리합니다. 충돌이 반복되면 같은 명령을 다시 실행하세요.

#### 방법 2: 현재 사용 중인 서버 확인 및 변경
Rails 서버가 이미 포트 3000에서 실행 중일 수 있습니다:
```bash
# 포트 사용 현황 확인
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Rails 서버가 3000번 포트 사용 중이면 Next.js는 3001번 포트 사용
# Next.js 접속: http://localhost:3001
# Rails 접속: http://localhost:3000
```

#### 방법 3: 포트 사용 중인 프로세스 종료
```bash
# 포트 3000 사용 프로세스 확인
netstat -ano | findstr :3000
# PID 확인 후 프로세스 종료
taskkill /F /PID [PID번호]

# 그 후 다시 서버 실행
npm run dev
```

#### 포트 충돌 발생 시 해결 순서
1. **포트 확인**: `netstat -ano | findstr :3000` 및 `netstat -ano | findstr :3001`
2. **Rails 서버 확인**: Rails가 3000번 포트 사용 중인지 확인
3. **Next.js 3001번 포트 실행**: `npm run dev -- --port 3001`
4. **브라우저 접속**: http://localhost:3001

### 4. MongoDB 연결 오류
**원인**: MongoDB Atlas 연결 문제
**해결**:
1. MongoDB Atlas 대시보드에서 IP 화이트리스트 확인
2. 네트워크 액세스에서 현재 IP 추가 (또는 0.0.0.0/0 허용)
3. 데이터베이스 사용자 비밀번호 확인
4. `.env.local` 파일의 MONGODB_URI 확인

### 5. 빌드 캐시 문제
**원인**: .next 폴더의 캐시 손상
**해결**:
```bash
cd H:\Naraddon\homepage
rmdir /s .next
npm run dev
```

### 6. TypeScript 오류
**원인**: 타입 정의 문제
**해결**:
```bash
# TypeScript 오류 확인
npx tsc --noEmit
# 또는 린트 실행
npm run lint
```

## 환경 변수 확인사항

`.env.local` 파일에 다음 항목들이 올바르게 설정되어 있는지 확인:

- `MONGODB_URI`: MongoDB 연결 문자열
- `NEXTAUTH_URL`: http://localhost:3000 (개발 환경)
- `NEXTAUTH_SECRET`: 보안 키
- `NODE_ENV`: development

## 디버깅 팁

### 상세 로그 보기
```bash
# Windows
set DEBUG=* && npm run dev

# PowerShell
$env:DEBUG="*"; npm run dev
```

### Next.js 버전 확인
```bash
npx next --version
```

### 의존성 업데이트
```bash
npm update
```

## 서버 실행이 안될 때 해결 방법

### 단계별 진단 및 해결

#### 1단계: 기본 환경 확인
```bash
# Node.js 설치 확인
node --version
npm --version

# 프로젝트 디렉토리 이동
cd H:\Naraddon\homepage

# package.json 존재 확인
dir package.json
```

#### 2단계: 포트 충돌 확인 및 해결
```bash
# 현재 사용 중인 포트 확인
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Rails 서버 실행 확인 (Rails root: H:/nara에서 실행 중일 수 있음)
# 포트 3000이 사용 중이면 3001 포트로 Next.js 실행
npm run dev -- --port 3001
```

#### 3단계: 의존성 문제 해결
```bash
# node_modules 및 lock 파일 삭제
rmdir /s node_modules
del package-lock.json

# 패키지 재설치
npm install

# 개발 서버 재시작
npm run dev -- --port 3001
```

#### 4단계: 캐시 및 빌드 파일 정리
```bash
# Next.js 캐시 삭제
rmdir /s .next

# TypeScript 캐시 삭제 (있는 경우)
rmdir /s .tsbuildinfo

# 다시 실행
npm run dev -- --port 3001
```

#### 5단계: 환경변수 확인
- `.env.local` 파일이 올바르게 설정되어 있는지 확인
- 특히 `NEXTAUTH_URL`이 사용할 포트와 일치하는지 확인:
  ```
  NEXTAUTH_URL=http://localhost:3001
  ```

### 일반적인 서버 실행 실패 시나리오

#### 시나리오 1: Rails와 Next.js 동시 실행
**상황**: Rails (포트 3000), Next.js (포트 3001)
**해결**:
```bash
# Next.js를 포트 3001에서 실행
npm run dev -- --port 3001
# 접속: http://localhost:3001
```

#### 시나리오 2: 여러 개발 서버 충돌
**상황**: 이전 실행된 서버들이 포트를 점유
**해결**:
```bash
# 모든 Node.js 프로세스 종료
taskkill /F /IM node.exe
# 또는 특정 포트만 종료
netstat -ano | findstr :3001
taskkill /F /PID [PID번호]
```

#### 시나리오 3: 권한 문제
**상황**: 관리자 권한이 필요한 포트 사용
**해결**:
- 명령 프롬프트를 관리자 권한으로 실행
- 또는 높은 번호 포트 사용: `npm run dev -- --port 8080`

### 응급 해결 방법

만약 위 방법들이 모두 실패할 경우:

1. **완전 초기화**:
   ```bash
   # 프로젝트 백업 후
   rmdir /s node_modules
   rmdir /s .next
   del package-lock.json
   npm cache clean --force
   npm install
   ```

2. **다른 포트로 시도**:
   ```bash
   npm run dev -- --port 8080
   npm run dev -- --port 4000
   npm run dev -- --port 5000
   ```

3. **시스템 재시작**: 모든 프로세스를 정리하고 새로 시작

## 문제가 지속될 경우

1. 모든 터미널/명령 프롬프트 닫기
2. 컴퓨터 재시작
3. 바이러스 백신 일시 중지 (개발 중)
4. Windows Defender 방화벽에서 Node.js 허용
5. 프로젝트 폴더를 다른 위치로 복사 후 시도

## 연락처
문제가 해결되지 않으면 다음 정보와 함께 문의:
- 오류 메시지 전체 스크린샷
- Node.js 버전 (`node --version`)
- NPM 버전 (`npm --version`)
- 운영체제 버전

