# 🎯 VSCode MCP (Model Context Protocol) 활용 전략

## 📊 현재 개발환경 분석

### ✅ 강점

- Next.js 14 + TypeScript 환경 구축 완료
- 체계적인 백업/복원 시스템 구축
- 명확한 개발 규칙 문서화 (DEVELOPMENT_RULES.md)
- 컴포넌트 상태 관리 체계 (fix/, working/)

### ⚠️ 개선 필요 사항

- VSCode 설정 파일 부재 → **생성 완료**
- 태스크 자동화 미비 → **tasks.json 추가**
- MCP 최적화 전략 미수립 → **본 문서 작성**

## 🚀 MCP 최적화 전략

### 1. 컨텍스트 관리 최적화

#### 파일 제외 설정

```json
// 불필요한 파일 컨텍스트에서 제외
{
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/backups/daily/**": true
  }
}
```

#### 우선순위 디렉토리

- `src/components/` - 활성 개발 영역
- `src/app/` - 라우팅 및 페이지
- `scripts/` - 자동화 스크립트
- `fix/` - 참조용 확정 컴포넌트

### 2. 태스크 자동화

#### 빠른 실행 명령 (Ctrl+Shift+P → Tasks: Run Task)

| 태스크              | 단축키       | 설명            |
| ------------------- | ------------ | --------------- |
| 🔄 Dev Server       | F5           | 개발 서버 실행  |
| 💾 Full Backup      | Ctrl+Alt+B   | 전체 백업       |
| 📦 Component Backup | -            | 컴포넌트별 백업 |
| 🏗️ Build Project    | Ctrl+Shift+B | 프로덕션 빌드   |

### 3. MCP 활용 워크플로우

#### A. 컴포넌트 개발 시

```bash
1. 작업 시작: Full Backup 태스크 실행
2. 컴포넌트 수정: working/ 폴더에서 작업
3. 중간 저장: Component Backup 태스크
4. 완료: Milestone Backup 태스크
```

#### B. 디버깅 시

```bash
1. Dev Server 태스크로 서버 실행
2. VSCode 디버거로 브레이크포인트 설정
3. Chrome DevTools 연동
```

#### C. 배포 시

```bash
1. Preflight Check 태스크 실행
2. Build Project 태스크
3. Deploy to Vercel 태스크
```

### 4. 스니펫 활용

#### 자주 사용하는 코드 패턴

```json
// .vscode/snippets/react.code-snippets
{
  "Next.js Page Component": {
    "prefix": "npage",
    "body": [
      "export default function ${1:PageName}() {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

### 5. 검색 최적화

#### 효율적인 검색 패턴

- `**/fix/**` 제외하여 현재 작업 파일만 검색
- `*.tsx` 파일 타입 지정으로 빠른 검색
- 정규식 활용: `function\s+\w+Component`

## 📝 MCP 베스트 프랙티스

### DO ✅

1. **컨텍스트 최소화**: 필요한 파일만 열어두기
2. **태스크 활용**: 반복 작업은 태스크로 자동화
3. **백업 습관화**: 주요 변경 전 백업 태스크 실행
4. **스니펫 작성**: 자주 쓰는 패턴은 스니펫으로

### DON'T ❌

1. **과도한 파일 열기**: 메모리 사용량 증가
2. **fix/ 폴더 직접 수정**: 규칙 위반
3. **백업 없이 대규모 변경**: 위험
4. **node_modules 검색**: 불필요한 부하

## 🔧 추가 설정 권장사항

### 1. Git 훅 설정

```bash
# .git/hooks/pre-commit
npm run lint
npm run backup:full
```

### 2. 환경 변수 관리

```bash
# .env.local 템플릿 생성
cp .env.example .env.local
```

### 3. 디버그 설정

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Next.js Debug",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## 📊 성능 모니터링

### 메모리 사용량 체크

- VSCode: Help → Process Explorer
- 임계값: 2GB 이상 시 재시작 권장

### 빌드 시간 최적화

- 평균 빌드 시간: 30-45초
- 1분 초과 시 캐시 정리: `rm -rf .next`

## 🎯 목표 지표

| 지표           | 현재  | 목표      |
| -------------- | ----- | --------- |
| 개발 서버 시작 | 1.5초 | 1초 이하  |
| 풀 빌드 시간   | 45초  | 30초 이하 |
| 백업 소요 시간 | 10초  | 5초 이하  |
| 컴포넌트 로드  | 즉시  | 유지      |

## 🔄 업데이트 로그

- 2025.01.18: 초기 전략 수립
- VSCode 설정 파일 생성
- 태스크 자동화 구성
- MCP 최적화 가이드 작성

---

_이 문서는 프로젝트 발전에 따라 지속적으로 업데이트됩니다._
