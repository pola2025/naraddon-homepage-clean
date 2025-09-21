@echo off
echo ========================================
echo Naraddon Homepage 서버 시작 스크립트
echo ========================================
echo.

:: Node.js 버전 확인
echo [1] Node.js 버전 확인...
node --version
if errorlevel 1 (
    echo [오류] Node.js가 설치되어 있지 않습니다!
    echo https://nodejs.org 에서 Node.js를 설치해주세요.
    pause
    exit /b 1
)

:: npm 버전 확인
echo [2] NPM 버전 확인...
npm --version
echo.

:: 현재 디렉토리 확인
echo [3] 현재 디렉토리: %CD%
cd /d H:\Naraddon\homepage
echo 작업 디렉토리: %CD%
echo.

:: 포트 사용 확인
echo [4] 포트 3000 사용 확인...
netstat -ano | findstr :3000
if not errorlevel 1 (
    echo [경고] 포트 3000이 이미 사용 중입니다!
    echo 다른 포트(3001)로 시작하시겠습니까? (Y/N)
    set /p choice=
    if /i "%choice%"=="Y" (
        echo 포트 3001로 서버를 시작합니다...
        npm run dev:3001
    ) else (
        echo 기존 프로세스를 종료하거나 다른 포트를 사용하세요.
        pause
        exit /b 1
    )
) else (
    echo 포트 3000이 사용 가능합니다.
    echo.
    echo [5] 개발 서버 시작...
    echo ========================================
    npm run dev
)

pause
