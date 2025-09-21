@echo off
echo ========================================
echo Naraddon Homepage - 빠른 서버 재시작
echo ========================================
echo.

echo [1] 기존 Node.js 프로세스 종료 중...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo    √ Node.js 프로세스를 종료했습니다.
    timeout /t 2 >nul
) else (
    echo    - 실행 중인 Node.js 프로세스가 없습니다.
)

echo.
echo [2] 프로젝트 디렉토리로 이동...
cd /d H:\Naraddon\homepage
echo    √ 현재 위치: %CD%

echo.
echo [3] 개발 서버 시작...
echo ========================================
echo 서버가 http://localhost:3000 에서 실행됩니다.
echo 종료하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

npm run dev
