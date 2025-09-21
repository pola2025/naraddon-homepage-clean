# 💾 백업 전략 가이드

## 🎯 목적

프로젝트 작업 중 데이터 손실을 방지하고, 언제든지 안전한 상태로 복원할 수 있도록 체계적인 백업 시스템 구축

---

## 📊 백업 레벨

### Level 1: 자동 백업 (매 작업 전)

```bash
# 트리거 조건
- 컴포넌트 수정 시작 전
- npm install 실행 전
- 빌드 설정 변경 전
- 배포 작업 전
```

### Level 2: 정기 백업 (시간 기반)

```bash
# 백업 주기
- 작업 중: 30분마다
- 일일 백업: 매일 오전 9시
- 주간 백업: 매주 월요일
```

### Level 3: 마일스톤 백업 (이벤트 기반)

```bash
# 백업 시점
- 기능 완성 시
- 사용자 확정 시
- 배포 성공 시
- 버전 업그레이드 시
```

---

## 🗂️ 백업 디렉터리 구조

```
backups/
├── daily/                      # 일일 백업
│   ├── 20250118/
│   │   ├── 0900/              # 오전 9시 자동 백업
│   │   └── 1500/              # 오후 3시 수동 백업
│   └── 20250119/
│
├── component/                  # 컴포넌트별 백업
│   ├── Header_20250118_1030/
│   │   ├── Header.tsx         # 원본 파일
│   │   ├── Header.css         # 스타일
│   │   └── BACKUP_INFO.json  # 백업 정보
│   └── Footer_20250118_1430/
│
└── milestone/                  # 마일스톤 백업
    ├── v1.0_initial_release/
    ├── v1.1_responsive_update/
    └── v2.0_major_refactor/
```

---

## 🔧 백업 스크립트

### 1. 백업 스크립트 생성

```javascript
// scripts/backup.js
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class BackupManager {
  constructor() {
    this.backupRoot = path.join(process.cwd(), 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  // 전체 백업
  async fullBackup() {
    const backupPath = path.join(
      this.backupRoot,
      'daily',
      this.getDateFolder(),
      this.getTimeFolder()
    );

    await fs.ensureDir(backupPath);
    await this.copyProject(backupPath);
    await this.createBackupInfo(backupPath, 'full');

    console.log(`✅ 백업 완료: ${backupPath}`);
    return backupPath;
  }

  // 컴포넌트 백업
  async componentBackup(componentName) {
    const backupPath = path.join(
      this.backupRoot,
      'component',
      `${componentName}_${this.getDateTimeString()}`
    );

    await fs.ensureDir(backupPath);
    await this.copyComponent(componentName, backupPath);
    await this.createBackupInfo(backupPath, 'component', { componentName });

    console.log(`✅ 컴포넌트 백업 완료: ${backupPath}`);
    return backupPath;
  }

  // 마일스톤 백업
  async milestoneBackup(version, description) {
    const backupPath = path.join(
      this.backupRoot,
      'milestone',
      `${version}_${description.replace(/\s+/g, '_')}`
    );

    await fs.ensureDir(backupPath);
    await this.copyProject(backupPath);
    await this.createBackupInfo(backupPath, 'milestone', { version, description });

    console.log(`✅ 마일스톤 백업 완료: ${backupPath}`);
    return backupPath;
  }

  // Helper 함수들
  getDateFolder() {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }

  getTimeFolder() {
    return new Date().toTimeString().slice(0, 5).replace(':', '');
  }

  getDateTimeString() {
    const now = new Date();
    return `${this.getDateFolder()}_${this.getTimeFolder()}`;
  }

  async copyProject(destination) {
    const exclude = ['node_modules', '.next', 'backups', '.git'];
    // 복사 로직
  }

  async copyComponent(name, destination) {
    // 컴포넌트 복사 로직
  }

  async createBackupInfo(backupPath, type, metadata = {}) {
    const info = {
      timestamp: new Date().toISOString(),
      type,
      gitCommit: this.getGitCommit(),
      ...metadata,
    };

    await fs.writeJson(path.join(backupPath, 'BACKUP_INFO.json'), info, { spaces: 2 });
  }

  getGitCommit() {
    try {
      return execSync('git rev-parse HEAD').toString().trim();
    } catch {
      return 'no-git';
    }
  }
}

module.exports = BackupManager;
```

---

## 🔄 복원 절차

### 1. 복원 스크립트

```javascript
// scripts/restore.js
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

class RestoreManager {
  async restore() {
    // 1. 백업 목록 표시
    const backups = await this.listBackups();

    // 2. 복원할 백업 선택
    const { selectedBackup } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBackup',
        message: '복원할 백업을 선택하세요:',
        choices: backups,
      },
    ]);

    // 3. 현재 상태 백업 (안전)
    await this.createSafetyBackup();

    // 4. 복원 실행
    await this.executeRestore(selectedBackup);

    console.log('✅ 복원 완료!');
  }
}
```

---

## 📝 백업 체크리스트

### 작업 시작 전

- [ ] 최신 백업이 있는가?
- [ ] Git 커밋이 되어 있는가?
- [ ] 백업 공간이 충분한가?

### 작업 중 (30분마다)

- [ ] 자동 백업이 실행되었는가?
- [ ] 중요 변경사항이 있는가?
- [ ] 컴포넌트 백업이 필요한가?

### 작업 완료 후

- [ ] 마일스톤 백업을 생성했는가?
- [ ] 백업 정보를 기록했는가?
- [ ] 불필요한 백업을 정리했는가?

---

## 🚨 긴급 복원 명령어

```bash
# 최신 백업으로 즉시 복원
npm run restore -- --latest

# 특정 날짜로 복원
npm run restore -- --date 20250118

# 특정 컴포넌트만 복원
npm run restore -- --component Header --date 20250118

# 마일스톤으로 복원
npm run restore -- --milestone v1.0_initial_release

# 대화형 복원 (추천)
npm run restore
```

---

## 📊 백업 관리

### 1. 백업 크기 관리

```bash
# 30일 이상 된 일일 백업 삭제
npm run backup:clean -- --days 30

# 백업 크기 확인
npm run backup:status

# 중복 백업 제거
npm run backup:dedupe
```

### 2. 백업 검증

```bash
# 백업 무결성 검사
npm run backup:verify

# 복원 테스트
npm run backup:test-restore
```

---

## 🔐 백업 보안

### 1. 민감 정보 제외

```javascript
// .backupignore
.env
.env.local
.env.production
*.key
*.pem
secrets/
```

### 2. 백업 암호화 (선택)

```bash
# 중요 백업 암호화
npm run backup -- --encrypt --milestone v1.0

# 암호화된 백업 복원
npm run restore -- --decrypt
```

---

## 📈 백업 모니터링

### 백업 상태 대시보드

```bash
# 백업 상태 확인
npm run backup:dashboard

# 출력 예시
┌─────────────────────────────────────┐
│ 백업 상태 대시보드                   │
├─────────────────────────────────────┤
│ 최신 백업: 2025-01-18 15:30        │
│ 전체 백업 수: 45                    │
│ 사용 공간: 2.3GB / 10GB             │
│ 다음 자동 백업: 16:00              │
│ 백업 성공률: 100%                   │
└─────────────────────────────────────┘
```

---

## 💡 베스트 프랙티스

1. **3-2-1 규칙**
   - 3개의 백업 유지
   - 2개의 다른 미디어에 저장
   - 1개는 외부 저장소에

2. **네이밍 규칙 준수**
   - 날짜*시간*설명 형식
   - 영문 사용 권장
   - 특수문자 제한

3. **정기 검증**
   - 주 1회 복원 테스트
   - 월 1회 백업 정리
   - 분기 1회 전체 검증

---

_최종 업데이트: 2025년 1월 18일_
_버전: 1.0.0_
