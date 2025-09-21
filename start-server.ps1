Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Naraddon Homepage 서버 진단 및 실행" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js 확인
Write-Host "[1] Node.js 버전 확인..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 버전: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js가 설치되어 있지 않습니다!" -ForegroundColor Red
    Write-Host "  https://nodejs.org 에서 설치해주세요." -ForegroundColor Yellow
    Read-Host "종료하려면 Enter를 누르세요"
    exit 1
}

# 2. NPM 확인
Write-Host "[2] NPM 버전 확인..." -ForegroundColor Yellow
$npmVersion = npm --version
Write-Host "✓ NPM 버전: $npmVersion" -ForegroundColor Green
Write-Host ""

# 3. 프로젝트 디렉토리로 이동
Write-Host "[3] 프로젝트 디렉토리 이동..." -ForegroundColor Yellow
Set-Location -Path "H:\Naraddon\homepage"
Write-Host "✓ 현재 위치: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# 4. node_modules 확인
Write-Host "[4] 패키지 설치 확인..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "✗ node_modules가 없습니다. 패키지 설치 중..." -ForegroundColor Red
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 패키지 설치 실패!" -ForegroundColor Red
        Read-Host "종료하려면 Enter를 누르세요"
        exit 1
    }
} else {
    Write-Host "✓ node_modules 존재" -ForegroundColor Green
}
Write-Host ""

# 5. .next 빌드 폴더 확인
Write-Host "[5] 빌드 캐시 확인..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "✓ .next 빌드 캐시 존재" -ForegroundColor Green
    $cleanCache = Read-Host "빌드 캐시를 삭제하시겠습니까? (Y/N)"
    if ($cleanCache -eq 'Y' -or $cleanCache -eq 'y') {
        Remove-Item -Path ".next" -Recurse -Force
        Write-Host "✓ 빌드 캐시 삭제 완료" -ForegroundColor Green
    }
} else {
    Write-Host "○ .next 빌드 캐시 없음 (정상)" -ForegroundColor Cyan
}
Write-Host ""

# 6. 포트 확인
Write-Host "[6] 포트 3000 사용 확인..." -ForegroundColor Yellow
$port3000 = netstat -ano | Select-String ":3000"
if ($port3000) {
    Write-Host "⚠ 포트 3000이 사용 중입니다!" -ForegroundColor Yellow
    Write-Host "사용 중인 프로세스:" -ForegroundColor Yellow
    $port3000 | ForEach-Object { Write-Host $_ }
    Write-Host ""
    $useAltPort = Read-Host "포트 3001로 시작하시겠습니까? (Y/N)"
    if ($useAltPort -eq 'Y' -or $useAltPort -eq 'y') {
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "개발 서버 시작 (포트 3001)..." -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        npm run dev:3001
    } else {
        Write-Host "서버를 시작하지 않습니다." -ForegroundColor Yellow
        Read-Host "종료하려면 Enter를 누르세요"
        exit 0
    }
} else {
    Write-Host "✓ 포트 3000 사용 가능" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "개발 서버 시작 (포트 3000)..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    npm run dev
}
