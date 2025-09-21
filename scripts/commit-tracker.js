const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

/**
 * 내부 커밋 트래커 - 모든 코드 변경사항을 자동으로 저장
 */
class CommitTracker {
  constructor() {
    this.commitRoot = path.join(process.cwd(), '.commits');
    this.currentCommit = null;
    this.ensureCommitFolder();
  }

  // 커밋 폴더 확인 및 생성
  async ensureCommitFolder() {
    await fs.ensureDir(this.commitRoot);
    await fs.ensureDir(path.join(this.commitRoot, 'history'));
    await fs.ensureDir(path.join(this.commitRoot, 'current'));
  }

  // 고유 커밋 ID 생성
  generateCommitId() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = crypto.randomBytes(4).toString('hex');
    return `${timestamp}_${random}`;
  }

  // 날짜/시간 포맷
  formatDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }

  /**
   * 파일 변경 전 자동 백업
   */
  async beforeChange(filePath, description = '') {
    try {
      const commitId = this.generateCommitId();
      const dateTime = this.formatDateTime();

      // 커밋 폴더 생성
      const commitFolder = path.join(this.commitRoot, 'history', dateTime, commitId);

      await fs.ensureDir(commitFolder);

      // 파일이 존재하는 경우에만 백업
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        const fileName = path.basename(filePath);

        // BEFORE 파일 저장
        const beforePath = path.join(commitFolder, `BEFORE_${fileName}`);
        await fs.writeFile(beforePath, content, 'utf8');

        // 커밋 정보 저장
        const commitInfo = {
          id: commitId,
          timestamp: new Date().toISOString(),
          localTime: new Date().toLocaleString('ko-KR'),
          filePath: filePath,
          fileName: fileName,
          description: description,
          type: 'modification',
          beforePath: beforePath,
          afterPath: null,
          changes: null,
        };

        await fs.writeJson(path.join(commitFolder, 'commit.json'), commitInfo, { spaces: 2 });

        // 현재 커밋 ID 저장
        this.currentCommit = {
          id: commitId,
          folder: commitFolder,
          filePath: filePath,
        };

        console.log(`📸 변경 전 백업: ${commitId}`);
        console.log(`   파일: ${fileName}`);
        console.log(`   시간: ${new Date().toLocaleString('ko-KR')}`);

        return commitId;
      } else {
        // 새 파일 생성의 경우
        const commitInfo = {
          id: commitId,
          timestamp: new Date().toISOString(),
          localTime: new Date().toLocaleString('ko-KR'),
          filePath: filePath,
          fileName: path.basename(filePath),
          description: description,
          type: 'creation',
          beforePath: null,
          afterPath: null,
          changes: null,
        };

        const commitFolder = path.join(this.commitRoot, 'history', dateTime, commitId);

        await fs.ensureDir(commitFolder);
        await fs.writeJson(path.join(commitFolder, 'commit.json'), commitInfo, { spaces: 2 });

        this.currentCommit = {
          id: commitId,
          folder: commitFolder,
          filePath: filePath,
        };

        console.log(`📝 새 파일 생성 추적: ${commitId}`);
        return commitId;
      }
    } catch (error) {
      console.error('❌ 변경 전 백업 실패:', error.message);
      return null;
    }
  }

  /**
   * 파일 변경 후 자동 저장
   */
  async afterChange(filePath, commitId = null) {
    try {
      // 커밋 ID가 없으면 현재 커밋 사용
      if (!commitId && this.currentCommit) {
        commitId = this.currentCommit.id;
      }

      if (!commitId) {
        console.warn('⚠️ 커밋 ID가 없습니다');
        return;
      }

      // 커밋 폴더 찾기
      const historyPath = path.join(this.commitRoot, 'history');
      let commitFolder = null;

      // 날짜 폴더들을 검색
      const dateFolders = await fs.readdir(historyPath);
      for (const dateFolder of dateFolders) {
        const datePath = path.join(historyPath, dateFolder);
        const commits = await fs.readdir(datePath);

        for (const commit of commits) {
          if (commit.includes(commitId)) {
            commitFolder = path.join(datePath, commit);
            break;
          }
        }
        if (commitFolder) break;
      }

      if (!commitFolder) {
        console.warn('⚠️ 커밋 폴더를 찾을 수 없습니다');
        return;
      }

      // AFTER 파일 저장
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        const fileName = path.basename(filePath);

        const afterPath = path.join(commitFolder, `AFTER_${fileName}`);
        await fs.writeFile(afterPath, content, 'utf8');

        // 커밋 정보 업데이트
        const commitInfoPath = path.join(commitFolder, 'commit.json');
        const commitInfo = await fs.readJson(commitInfoPath);

        commitInfo.afterPath = afterPath;
        commitInfo.completedAt = new Date().toISOString();
        commitInfo.completedLocalTime = new Date().toLocaleString('ko-KR');

        // 변경사항 요약 생성
        if (commitInfo.beforePath) {
          const beforeContent = await fs.readFile(commitInfo.beforePath, 'utf8');
          const afterContent = content;

          commitInfo.changes = {
            linesAdded: afterContent.split('\n').length - beforeContent.split('\n').length,
            sizeBefore: beforeContent.length,
            sizeAfter: afterContent.length,
            sizeChange: afterContent.length - beforeContent.length,
          };
        }

        await fs.writeJson(commitInfoPath, commitInfo, { spaces: 2 });

        // DIFF 파일 생성
        if (commitInfo.beforePath) {
          const diffPath = path.join(commitFolder, 'DIFF.txt');
          const beforeContent = await fs.readFile(commitInfo.beforePath, 'utf8');
          const diff = this.generateSimpleDiff(beforeContent, content);
          await fs.writeFile(diffPath, diff, 'utf8');
        }

        console.log(`✅ 변경 후 저장: ${commitId}`);
        console.log(`   파일: ${fileName}`);
        console.log(`   시간: ${new Date().toLocaleString('ko-KR')}`);
      }

      // 현재 커밋 초기화
      this.currentCommit = null;
    } catch (error) {
      console.error('❌ 변경 후 저장 실패:', error.message);
    }
  }

  /**
   * 간단한 DIFF 생성
   */
  generateSimpleDiff(before, after) {
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');

    let diff = `변경사항 요약\n`;
    diff += `${'='.repeat(50)}\n`;
    diff += `수정 전: ${beforeLines.length} 줄\n`;
    diff += `수정 후: ${afterLines.length} 줄\n`;
    diff += `변경된 줄: ${Math.abs(afterLines.length - beforeLines.length)} 줄\n`;
    diff += `${'='.repeat(50)}\n\n`;

    // 처음 변경된 부분 찾기
    let firstChange = -1;
    for (let i = 0; i < Math.min(beforeLines.length, afterLines.length); i++) {
      if (beforeLines[i] !== afterLines[i]) {
        firstChange = i;
        break;
      }
    }

    if (firstChange >= 0) {
      diff += `첫 번째 변경 위치: ${firstChange + 1}번 줄\n\n`;

      // 변경 전후 몇 줄 표시
      const context = 3;
      const start = Math.max(0, firstChange - context);
      const end = Math.min(
        Math.max(beforeLines.length, afterLines.length),
        firstChange + context + 1
      );

      diff += `--- 수정 전 ---\n`;
      for (let i = start; i < Math.min(end, beforeLines.length); i++) {
        const prefix = i === firstChange ? '>>> ' : '    ';
        diff += `${i + 1}: ${prefix}${beforeLines[i]}\n`;
      }

      diff += `\n--- 수정 후 ---\n`;
      for (let i = start; i < Math.min(end, afterLines.length); i++) {
        const prefix = i === firstChange ? '>>> ' : '    ';
        diff += `${i + 1}: ${prefix}${afterLines[i]}\n`;
      }
    }

    return diff;
  }

  /**
   * 커밋 히스토리 조회
   */
  async getHistory(limit = 10) {
    try {
      const historyPath = path.join(this.commitRoot, 'history');
      const commits = [];

      if (!(await fs.pathExists(historyPath))) {
        return commits;
      }

      const dateFolders = await fs.readdir(historyPath);
      dateFolders.sort().reverse(); // 최신 날짜부터

      for (const dateFolder of dateFolders) {
        const datePath = path.join(historyPath, dateFolder);
        const commitFolders = await fs.readdir(datePath);

        for (const commitFolder of commitFolders.reverse()) {
          const commitPath = path.join(datePath, commitFolder);
          const commitInfoPath = path.join(commitPath, 'commit.json');

          if (await fs.pathExists(commitInfoPath)) {
            const commitInfo = await fs.readJson(commitInfoPath);
            commits.push(commitInfo);

            if (commits.length >= limit) {
              return commits;
            }
          }
        }
      }

      return commits;
    } catch (error) {
      console.error('❌ 히스토리 조회 실패:', error.message);
      return [];
    }
  }

  /**
   * 커밋 히스토리 출력
   */
  async showHistory(limit = 10) {
    const commits = await this.getHistory(limit);

    console.log('\n📚 커밋 히스토리');
    console.log('='.repeat(80));

    if (commits.length === 0) {
      console.log('커밋 내역이 없습니다.');
      return;
    }

    for (const commit of commits) {
      console.log(`\n🔹 ${commit.id}`);
      console.log(`   시간: ${commit.localTime}`);
      console.log(`   파일: ${commit.fileName}`);
      console.log(`   타입: ${commit.type}`);
      if (commit.description) {
        console.log(`   설명: ${commit.description}`);
      }
      if (commit.changes) {
        console.log(
          `   변경: ${commit.changes.linesAdded > 0 ? '+' : ''}${commit.changes.linesAdded} 줄, ${commit.changes.sizeChange > 0 ? '+' : ''}${commit.changes.sizeChange} bytes`
        );
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`총 ${commits.length}개의 커밋 표시됨`);
  }

  /**
   * 특정 커밋 복원
   */
  async restore(commitId, restoreBefore = true) {
    try {
      // 커밋 찾기
      const commits = await this.getHistory(100);
      const commit = commits.find((c) => c.id.includes(commitId));

      if (!commit) {
        console.error(`❌ 커밋을 찾을 수 없습니다: ${commitId}`);
        return false;
      }

      const targetPath = restoreBefore ? commit.beforePath : commit.afterPath;

      if (!targetPath || !(await fs.pathExists(targetPath))) {
        console.error(`❌ 복원할 파일이 없습니다`);
        return false;
      }

      // 현재 상태 백업
      await this.beforeChange(commit.filePath, `복원 전 자동 백업 (${commitId} 복원)`);

      // 파일 복원
      const content = await fs.readFile(targetPath, 'utf8');
      await fs.writeFile(commit.filePath, content, 'utf8');

      // 복원 후 저장
      await this.afterChange(commit.filePath);

      console.log(`✅ 복원 완료: ${commit.fileName}`);
      console.log(`   커밋: ${commitId}`);
      console.log(`   상태: ${restoreBefore ? 'BEFORE (수정 전)' : 'AFTER (수정 후)'}`);

      return true;
    } catch (error) {
      console.error('❌ 복원 실패:', error.message);
      return false;
    }
  }

  /**
   * 커밋 통계
   */
  async getStats() {
    try {
      const historyPath = path.join(this.commitRoot, 'history');
      let totalCommits = 0;
      let totalSize = 0;
      const fileTypes = {};

      if (!(await fs.pathExists(historyPath))) {
        return { totalCommits: 0, totalSize: 0, fileTypes: {} };
      }

      const dateFolders = await fs.readdir(historyPath);

      for (const dateFolder of dateFolders) {
        const datePath = path.join(historyPath, dateFolder);
        const commitFolders = await fs.readdir(datePath);

        for (const commitFolder of commitFolders) {
          totalCommits++;
          const commitPath = path.join(datePath, commitFolder);
          const files = await fs.readdir(commitPath);

          for (const file of files) {
            const filePath = path.join(commitPath, file);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;

            const ext = path.extname(file);
            fileTypes[ext] = (fileTypes[ext] || 0) + 1;
          }
        }
      }

      return {
        totalCommits,
        totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        fileTypes,
      };
    } catch (error) {
      console.error('❌ 통계 조회 실패:', error.message);
      return { totalCommits: 0, totalSize: 0, fileTypes: {} };
    }
  }

  /**
   * 통계 출력
   */
  async showStats() {
    const stats = await this.getStats();

    console.log('\n📊 커밋 통계');
    console.log('='.repeat(50));
    console.log(`현재 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log(`총 커밋 수: ${stats.totalCommits}`);
    console.log(`총 크기: ${stats.totalSizeMB} MB`);
    console.log(`\n파일 타입별:`);

    Object.entries(stats.fileTypes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([ext, count]) => {
        console.log(`  ${ext || '(no ext)'}: ${count}개`);
      });

    console.log('='.repeat(50));
  }

  /**
   * 오래된 커밋 정리
   */
  async cleanup(daysToKeep = 30) {
    try {
      const historyPath = path.join(this.commitRoot, 'history');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      let deletedCount = 0;

      if (!(await fs.pathExists(historyPath))) {
        return;
      }

      const dateFolders = await fs.readdir(historyPath);

      for (const dateFolder of dateFolders) {
        // 날짜 파싱 (YYYYMMDD 형식)
        const year = parseInt(dateFolder.substr(0, 4));
        const month = parseInt(dateFolder.substr(4, 2)) - 1;
        const day = parseInt(dateFolder.substr(6, 2));
        const folderDate = new Date(year, month, day);

        if (folderDate < cutoffDate) {
          const datePath = path.join(historyPath, dateFolder);
          await fs.remove(datePath);
          deletedCount++;
          console.log(`🗑️ 삭제됨: ${dateFolder}`);
        }
      }

      console.log(`\n✅ 정리 완료: ${deletedCount}개 날짜 폴더 삭제됨`);
      console.log(`   ${daysToKeep}일 이상 된 커밋 제거`);
    } catch (error) {
      console.error('❌ 정리 실패:', error.message);
    }
  }
}

// 싱글톤 인스턴스
let tracker = null;

function getTracker() {
  if (!tracker) {
    tracker = new CommitTracker();
  }
  return tracker;
}

// CLI 명령어 처리
async function main() {
  const tracker = getTracker();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'history':
        await tracker.showHistory(args[1] || 10);
        break;
      case 'stats':
        await tracker.showStats();
        break;
      case 'restore':
        if (!args[1]) {
          console.error('❌ 커밋 ID를 지정해주세요');
          process.exit(1);
        }
        await tracker.restore(args[1], args[2] !== 'after');
        break;
      case 'cleanup':
        await tracker.cleanup(args[1] || 30);
        break;
      default:
        console.log(`
🔧 내부 커밋 트래커 사용법
===========================================
npm run commit:history [수]     - 커밋 히스토리 보기
npm run commit:stats            - 커밋 통계 보기
npm run commit:restore [ID]     - 특정 커밋으로 복원
npm run commit:cleanup [일수]   - 오래된 커밋 정리
===========================================
현재 시간: ${new Date().toLocaleString('ko-KR')}
        `);
    }
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

// 직접 실행된 경우
if (require.main === module) {
  main();
}

module.exports = { CommitTracker, getTracker };
