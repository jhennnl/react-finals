@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title cakette - error / 404 tabs
color 0E

echo ============================================
echo   cakette rubric error tabs
echo ============================================
echo.
echo Opens only the error / 404 demo URLs.
echo Servers must already be running
echo   (start-defense.bat or npm run dev).
echo.

REM Prefer Edge; fall back to Chrome, then default browser
set "BROWSER="
where msedge >nul 2>&1 && set "BROWSER=msedge"
if not defined BROWSER where chrome >nul 2>&1 && set "BROWSER=chrome"

echo Opening error tabs...
echo.

REM ---- UI 404 (Not Found page) ----
call :open "http://localhost:5173/this-page-does-not-exist"

REM ---- API 404 (missing cake) ----
call :open "http://localhost:8000/api/cakes/this-cake-does-not-exist"

REM ---- Health (show gradingReady / status for rubric talk) ----
call :open "http://localhost:8000/api/health"

echo.
echo ============================================
echo   ERROR TABS OPEN
echo ============================================
echo   UI 404:  /this-page-does-not-exist
echo   API 404: /api/cakes/this-cake-does-not-exist
echo   Health:  /api/health
echo.
echo   For 400 validation in the app:
echo     - Login with blank email, or
echo     - Manage cakes -^> create with empty name
echo ============================================
pause
exit /b 0

:open
if defined BROWSER (
  start "" %BROWSER% "%~1"
) else (
  start "" "%~1"
)
timeout /t 1 /nobreak >nul
exit /b 0
