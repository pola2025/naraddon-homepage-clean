@echo off
echo ========================================
echo 완전 초기화 및 서버 재시작
echo ========================================
echo.

echo [1] 모든 Node.js 프로세스 강제 종료...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2] 디렉토리 이동...
cd /d H:\Naraddon\homepage

echo [3] 포트 5000으로 시작 시도...
echo.
echo 서버 URL: http://localhost:5000
echo.
npx next dev -p 5000

pause
