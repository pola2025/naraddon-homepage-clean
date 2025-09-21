Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Naraddon Homepage 서버 관리" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 프로젝트 디렉토리로 이동
Set-Location -Path "H:\Naraddon\homepage"

# 메뉴 표시
Write-Host "선택하세요:" -ForegroundColor Yellow
Write-Host "[1] 기존 서버 종료 후 재시작" -ForegroundColor White
Write-Host "[2] 포트 3001로 새 서버 시작" -ForegroundColor White
Write-Host "[3] 서버 상태만 확인" -ForegroundColor White
Write-Host "[4] 종료" -ForegroundColor White
Write-Host ""

$choice = Read-Host "선택 (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "기존 서버 종료 중..." -ForegroundColor Yellow
        
        # Node.js 프로세스 종료
        $nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $nodeProcesses | Stop-Process -Force
            Write-Host "✓ Node.js 프로세스 종료 완료" -ForegroundColor Green
            Start-Sleep -Seconds 2
        } else {
            Write-Host "○ 실행 중인 Node.js 프로세스 없음" -ForegroundColor Cyan
        }
        
        # .next 캐시 삭제 옵션
        Write-Host ""
        $cleanCache = Read-Host "빌드 캐시를 삭제하시겠습니까? (Y/N)"
        if ($cleanCache -eq 'Y' -or $cleanCache -eq 'y') {
            Write-Host "캐시 삭제 중..." -ForegroundColor Yellow
            Start-Sleep -Seconds 1
            Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "✓ 캐시 삭제 완료" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "개발 서버 시작 (포트 3000)..." -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "서버를 중지하려면 Ctrl+C를 누르세요" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
    "2" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "개발 서버 시작 (포트 3001)..." -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "서버를 중지하려면 Ctrl+C를 누르세요" -ForegroundColor Yellow
        Write-Host ""
        npm run dev:3001
    }
    "3" {
        Write-Host ""
        Write-Host "포트 사용 상태 확인..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "=== 포트 3000 ===" -ForegroundColor Cyan
        netstat -ano | Select-String ":3000" | ForEach-Object { Write-Host $_ }
        Write-Host ""
        Write-Host "=== 포트 3001 ===" -ForegroundColor Cyan
        netstat -ano | Select-String ":3001" | ForEach-Object { Write-Host $_ }
        Write-Host ""
        
        Write-Host "Node.js 프로세스 확인..." -ForegroundColor Yellow
        Get-Process -Name node -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, StartTime
        Write-Host ""
        Read-Host "계속하려면 Enter를 누르세요"
    }
    "4" {
        Write-Host "종료합니다." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "잘못된 선택입니다." -ForegroundColor Red
        Read-Host "종료하려면 Enter를 누르세요"
    }
}
