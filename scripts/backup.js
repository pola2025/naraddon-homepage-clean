const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 백업 매니저 - 항상 현재 날짜와 시간을 사용
 */
class BackupManager {
  constructor() {
    this.backupRoot = path.join(process.cwd(), 'backups');
    // 현재 날짜와 시간을 동적으로 가져오기
    const now = new Date();
    this.currentDate = this.formatDate(now);
    this.currentTime = this.formatTime(now);
    this.currentDateTime = this.formatDateTime(now);
  }

  // 날짜 포맷: YYYYMMDD
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // 시간 포맷: HHMM
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}${minutes}`;
  }

  // 날짜시간 포맷: YYYYMMDD_HHMM
  formatDateTime(date) {
    return `${this.formatDate(date)}_${this.formatTime(date)}`;
  }

  // 전체 백업
  async fullBackup(description = '') {
    console.log(`📅 현재 날짜: ${new Date().toLocaleString('ko-KR')}`);

    const backupPath = path.join(this.backupRoot, 'daily', this.currentDate, this.currentTime);

    await fs.ensureDir(backupPath);
    await this.copyProject(backupPath);
    await this.createBackupInfo(backupPath, 'full', { description });

    console.log(`✅ 백업 완료: ${backupPath}`);
    console.log(`   백업 시간: ${new Date().toLocaleString('ko-KR')}`);
    return backupPath;
  }

  // 컴포넌트 백업
  async componentBackup(componentName) {
    console.log(`📅 현재 날짜: ${new Date().toLocaleString('ko-KR')}`);

    const backupPath = path.join(
      this.backupRoot,
      'component',
      `${componentName}_${this.currentDateTime}`
    );

    await fs.ensureDir(backupPath);
    await this.copyComponent(componentName, backupPath);
    await this.createBackupInfo(backupPath, 'component', {
      componentName,
      backupTime: new Date().toISOString(),
    });

    console.log(`✅ 컴포넌트 백업 완료: ${backupPath}`);
    return backupPath;
  }

  // 마일스톤 백업
  async milestoneBackup(version, description) {
    console.log(`📅 현재 날짜: ${new Date().toLocaleString('ko-KR')}`);

    const safeName = description.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    const backupPath = path.join(
      this.backupRoot,
      'milestone',
      `${version}_${safeName}_${this.currentDate}`
    );

    await fs.ensureDir(backupPath);
    await this.copyProject(backupPath);
    await this.createBackupInfo(backupPath, 'milestone', {
      version,
      description,
      backupTime: new Date().toISOString(),
    });

    console.log(`✅ 마일스톤 백업 완료: ${backupPath}`);
    return backupPath;
  }

  // 프로젝트 복사
  async copyProject(destination) {
    const exclude = ['node_modules', '.next', 'backups', '.git', 'dist', 'build'];
    const projectRoot = process.cwd();

    console.log('📦 프로젝트 파일 복사 중...');

    // 모든 파일과 폴더 복사 (exclude 제외)
    const items = await fs.readdir(projectRoot);

    for (const item of items) {
      if (!exclude.includes(item)) {
        const sourcePath = path.join(projectRoot, item);
        const destPath = path.join(destination, item);

        try {
          await fs.copy(sourcePath, destPath);
        } catch (error) {
          console.warn(`⚠️ 복사 실패 (건너뜀): ${item}`);
        }
      }
    }
  }

  // 컴포넌트 복사
  async copyComponent(componentName, destination) {
    const componentPaths = [
      path.join('src/components', componentName),
      path.join('src/components', componentName + '.tsx'),
      path.join('src/components', componentName + '.jsx'),
      path.join('src/components', componentName + '.js'),
      path.join('src/app', componentName),
    ];

    for (const componentPath of componentPaths) {
      if (await fs.pathExists(componentPath)) {
        await fs.copy(componentPath, path.join(destination, path.basename(componentPath)));
        console.log(`📄 복사됨: ${componentPath}`);
      }
    }
  }

  // 백업 정보 파일 생성
  async createBackupInfo(backupPath, type, metadata = {}) {
    const info = {
      timestamp: new Date().toISOString(),
      localTime: new Date().toLocaleString('ko-KR'),
      type,
      path: backupPath,
      gitCommit: this.getGitCommit(),
      gitBranch: this.getGitBranch(),
      gitStatus: this.getGitStatus(),
      nodeVersion: process.version,
      platform: process.platform,
      ...metadata,
    };

    await fs.writeJson(path.join(backupPath, 'BACKUP_INFO.json'), info, { spaces: 2 });

    // 읽기 쉬운 텍스트 파일도 생성
    const textInfo = `
백업 정보
========================================
백업 시간: ${info.localTime}
백업 유형: ${info.type}
백업 경로: ${info.path}
Git 커밋: ${info.gitCommit}
Git 브랜치: ${info.gitBranch}
Node 버전: ${info.nodeVersion}
플랫폼: ${info.platform}
========================================
${metadata.description ? `설명: ${metadata.description}` : ''}
`;

    await fs.writeFile(path.join(backupPath, 'BACKUP_INFO.txt'), textInfo, 'utf8');
  }

  // Git 정보 가져오기
  getGitCommit() {
    try {
      return execSync('git rev-parse HEAD').toString().trim();
    } catch {
      return 'no-git-commit';
    }
  }

  getGitBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    } catch {
      return 'no-git-branch';
    }
  }

  getGitStatus() {
    try {
      return execSync('git status --short').toString().trim() || 'clean';
    } catch {
      return 'no-git-status';
    }
  }

  // 백업 목록 표시
  async listBackups() {
    const backupTypes = ['daily', 'component', 'milestone'];
    console.log('\n📚 백업 목록\n' + '='.repeat(50));

    for (const type of backupTypes) {
      const typePath = path.join(this.backupRoot, type);
      if (await fs.pathExists(typePath)) {
        console.log(`\n📁 ${type.toUpperCase()}`);
        const items = await fs.readdir(typePath);
        items
          .sort()
          .reverse()
          .slice(0, 5)
          .forEach((item) => {
            console.log(`   - ${item}`);
          });
      }
    }
  }

  // 백업 상태 확인
  async getBackupStatus() {
    const stats = {
      totalBackups: 0,
      totalSize: 0,
      lastBackup: null,
      types: {},
    };

    const backupTypes = ['daily', 'component', 'milestone'];

    for (const type of backupTypes) {
      const typePath = path.join(this.backupRoot, type);
      if (await fs.pathExists(typePath)) {
        const items = await fs.readdir(typePath);
        stats.types[type] = items.length;
        stats.totalBackups += items.length;
      }
    }

    console.log('\n📊 백업 상태');
    console.log('='.repeat(50));
    console.log(`현재 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log(`총 백업 수: ${stats.totalBackups}`);
    console.log(`백업 유형별:`);
    Object.entries(stats.types).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}개`);
    });
    console.log('='.repeat(50));
  }
}

// CLI 실행
async function main() {
  const manager = new BackupManager();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'full':
        await manager.fullBackup(args[1] || '');
        break;
      case 'component':
        if (!args[1]) {
          console.error('❌ 컴포넌트 이름을 지정해주세요');
          process.exit(1);
        }
        await manager.componentBackup(args[1]);
        break;
      case 'milestone':
        if (!args[1] || !args[2]) {
          console.error('❌ 버전과 설명을 지정해주세요');
          console.log('예: npm run backup milestone v1.0 "초기 릴리즈"');
          process.exit(1);
        }
        await manager.milestoneBackup(args[1], args[2]);
        break;
      case 'list':
        await manager.listBackups();
        break;
      case 'status':
        await manager.getBackupStatus();
        break;
      default:
        console.log(`
🔧 백업 매니저 사용법
===========================================
npm run backup full [설명]        - 전체 백업
npm run backup component [이름]   - 컴포넌트 백업
npm run backup milestone [v] [설명] - 마일스톤 백업
npm run backup list              - 백업 목록
npm run backup status            - 백업 상태
===========================================
현재 시간: ${new Date().toLocaleString('ko-KR')}
        `);
    }
  } catch (error) {
    console.error('❌ 백업 실패:', error.message);
    process.exit(1);
  }
}

// 직접 실행된 경우에만 main 실행
if (require.main === module) {
  main();
}

module.exports = BackupManager;
