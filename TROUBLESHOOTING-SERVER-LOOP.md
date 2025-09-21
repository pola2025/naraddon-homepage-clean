# 서버 루프 오류 해결 가이드

## 📋 문제 개요
웹페이지 수정 중 서버 재시작 시 발생하는 루프 오류와 빌드 실패 문제를 안전하게 해결하는 방법입니다.

## 🚨 주요 증상
- 서버 재시작 시 무한 루프에 빠짐
- 빌드가 실행되지 않음
- 포트 충돌로 인한 실행 불가
- 파일 손상 위험

## ⚡ 즉시 해결 방법

### 1단계: 안전한 진단
```bash
# 현재 상태 확인 (파일 손상 없음)
cd H:\Naraddon\homepage
node --version
npm --version
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### 2단계: 안전한 서버 시작
```bash
# 포트 충돌 회피 (자동 포트 정리 포함)
npm run dev:3001
```

### 3단계: 기존 프로세스 정리 (필요시)
```bash
# PowerShell 관리자 권한으로 실행
.\server-manager.ps1
# 옵션 1 선택: 기존 서버 종료 후 재시작
```

## 🔧 단계별 안전 해결책

### A. 포트 충돌 해결
```bash
# 방법 1: 다른 포트 사용 (권장)
npm run dev:3001

# 방법 2: 충돌 프로세스 확인
netstat -ano | findstr :3000
# PID 확인 후 안전하게 종료
taskkill /F /PID [PID번호]
```

### B. 캐시 문제 해결
```bash
# .next 폴더만 삭제 (소스코드 보존)
rmdir /s .next
npm run dev:3001
```

### C. 패키지 의존성 문제
```bash
# node_modules 재설치 (package.json 보존)
rmdir /s node_modules
del package-lock.json
npm install
npm run dev:3001
```

## 🛡️ 파일 손상 방지 원칙

### ✅ 안전한 작업
- 포트 변경 (`dev:3001` 사용)
- 캐시 폴더 삭제 (`.next`)
- 프로세스 종료
- 패키지 재설치

### ❌ 위험한 작업 (절대 금지)
- 소스코드 파일 수정
- 설정 파일 변경
- 강제 삭제 명령
- git reset --hard

## 📊 문제별 해결 매트릭스

| 증상 | 원인 | 안전한 해결책 | 예상 시간 |
|------|------|---------------|-----------|
| 포트 충돌 | 기존 프로세스 | `npm run dev:3001` | 30초 |
| 빌드 실패 | 캐시 손상 | `.next` 삭제 | 1분 |
| 모듈 오류 | 의존성 문제 | `npm install` | 2-3분 |
| 무한 루프 | 프로세스 중복 | `server-manager.ps1` | 1분 |

## 🔄 예방 워크플로우

### 개발 시작 전
```bash
# 1. 상태 확인
npm run dev:3001

# 2. 문제 발견 시
.\server-manager.ps1
```

### 코드 수정 후
```bash
# 1. 린트 검사
npm run lint

# 2. 빌드 테스트
npm run build

# 3. 안전한 재시작
npm run dev:3001
```

## 🚀 자동화 스크립트 활용

### 기존 도구 활용
- `start-server.ps1`: 자동 진단 + 실행
- `server-manager.ps1`: 대화형 문제 해결
- `npm run dev:3001`: 충돌 회피 실행

### 권장 사용 순서
1. `.\server-manager.ps1` (문제 해결)
2. `npm run dev:3001` (안전 실행)
3. `.\start-server.ps1` (진단 + 실행)

## 📞 응급 대응 체크리스트

### 즉시 실행할 명령 (순서대로)
```bash
# Step 1: 현재 디렉토리 확인
cd H:\Naraddon\homepage

# Step 2: 안전한 포트로 시작
npm run dev:3001

# Step 3: 실패 시 관리 도구 사용
.\server-manager.ps1
```

### 문제 지속 시
```bash
# Step 4: 캐시 정리
rmdir /s .next

# Step 5: 재시도
npm run dev:3001

# Step 6: 의존성 재설치
npm install
```

## 📝 문제 발생 시 기록 항목
- 오류 메시지 전체 텍스트
- 실행 중이던 명령어
- Node.js 버전 (`node --version`)
- 포트 사용 현황 (`netstat -ano | findstr :3000`)
- 해결에 사용한 방법

## ⚠️ 주의사항
1. **절대 소스코드 파일을 수정하지 마세요**
2. **git reset 명령은 사용하지 마세요**
3. **강제 삭제 전에 백업을 확인하세요**
4. **관리자 권한이 필요한 작업은 신중히 진행하세요**

---
*이 가이드는 파일 손상 없이 서버 문제만 해결하는 것을 목적으로 합니다.*