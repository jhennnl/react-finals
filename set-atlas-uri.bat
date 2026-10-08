@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

title cakette - paste Atlas URI
color 0B

echo ============================================
echo   Paste your MongoDB Atlas connection string
echo ============================================
echo.
echo In Atlas: Cluster "cakette" -^> Connect -^> Drivers
echo Copy the SRV string, then paste below and press Enter.
echo.
echo Example:
echo mongodb+srv://USER:PASS@cakette.xxxxx.mongodb.net/?retryWrites=true^&w=majority
echo.

set /p MONGO_URI=MONGO_URI=

if not defined MONGO_URI (
  echo [ERROR] Empty URI.
  pause
  exit /b 1
)

echo !MONGO_URI! | findstr /I "mongodb+srv://" >nul
if errorlevel 1 (
  echo [ERROR] URI must start with mongodb+srv://
  pause
  exit /b 1
)

REM Ensure database name is cakette
echo !MONGO_URI! | findstr /I "/cakette" >nul
if errorlevel 1 (
  powershell -NoProfile -Command ^
    "$u=$env:MONGO_URI; " ^
    "if ($u -match 'mongodb\+srv://[^/]+/\?') { $u = $u -replace '/\?','/cakette?' } " ^
    "elseif ($u -match 'mongodb\+srv://[^/]+$') { $u = $u + '/cakette?retryWrites=true&w=majority' } " ^
    "elseif ($u -notmatch '/cakette(\?|$)') { $u = $u -replace '(\.net)/[^?]+\?','$1/cakette?' }; " ^
    "Set-Content -Path '%TEMP%\cakette-mongo-uri.txt' -Value $u -NoNewline"
  set /p MONGO_URI=<"%TEMP%\cakette-mongo-uri.txt"
)

(
  echo PORT=8000
  echo CLIENT_ORIGIN=http://localhost:5173
  echo MONGO_URI=!MONGO_URI!
  echo ALLOW_MEMORY_FALLBACK=false
) > "server\.env"

echo.
echo Wrote server\.env
echo Seeding Atlas...
pushd server
call npm run seed
set SEED_ERR=!errorlevel!
popd
if not "!SEED_ERR!"=="0" (
  echo [ERROR] Seed failed. Check username/password and Network Access 0.0.0.0/0
  pause
  exit /b 1
)

echo.
echo Restarting API window if needed is recommended.
echo Checking health if API is already up...
powershell -NoProfile -Command "try { $h=Invoke-RestMethod 'http://localhost:8000/api/health' -TimeoutSec 3; Write-Host ('mode=' + $h.database.mode + ' gradingReady=' + $h.database.gradingReady); if ($h.database.mode -eq 'memory') { exit 2 } } catch { Write-Host 'API not running. Start start-defense.bat then re-check /api/health' }"

echo.
echo Done. Restart the API (stop cakette-api window, run start-defense.bat)
echo so it picks up the new Atlas URI.
pause
exit /b 0
