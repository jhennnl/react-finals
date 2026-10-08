@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title cakette - defense autostart
color 0B

echo ============================================
echo   cakette defense autostart
echo ============================================
echo.

REM --- check Node ---
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

REM --- ensure env files ---
if not exist "server\.env" (
  echo [SETUP] Creating server\.env from server\.env.example ...
  copy /Y "server\.env.example" "server\.env" >nul
  echo       Edit server\.env and set your Atlas MONGO_URI before grading.
)
if not exist "client\.env" (
  echo [SETUP] Creating client\.env ...
  copy /Y "client\.env.example" "client\.env" >nul
)

REM --- install deps if missing ---
if not exist "client\node_modules\" (
  echo [SETUP] Installing client dependencies...
  pushd client
  call npm install
  if errorlevel 1 (
    popd
    echo [ERROR] Client npm install failed.
    pause
    exit /b 1
  )
  popd
)
if not exist "server\node_modules\" (
  echo [SETUP] Installing server dependencies...
  pushd server
  call npm install
  if errorlevel 1 (
    popd
    echo [ERROR] Server npm install failed.
    pause
    exit /b 1
  )
  popd
)

echo.
echo [1/3] Starting API  -^> http://localhost:8000/api
start "cakette-api" cmd /k "cd /d "%~dp0server" && npm run dev"

echo [2/3] Starting Vite -^> http://localhost:5173
start "cakette-vite" cmd /k "cd /d "%~dp0client" && npm run dev"

echo [3/3] Waiting for servers...
set /a tries=0

:wait_api
set /a tries+=1
powershell -NoProfile -Command "try { $r = Invoke-RestMethod 'http://localhost:8000/api/health' -TimeoutSec 2; if ($r.status -eq 'ok' -or $r.status -eq 'degraded') { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  if %tries% GEQ 90 (
    echo [ERROR] API did not become ready. Check the cakette-api window.
    pause
    exit /b 1
  )
  timeout /t 1 /nobreak >nul
  goto wait_api
)

echo       API is up.
set /a tries=0

:wait_vite
set /a tries+=1
powershell -NoProfile -Command "try { $r = Invoke-WebRequest 'http://localhost:5173/' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  if %tries% GEQ 90 (
    echo [ERROR] Vite did not become ready. Check the cakette-vite window.
    pause
    exit /b 1
  )
  timeout /t 1 /nobreak >nul
  goto wait_vite
)

echo       Vite is up.
echo.
echo Opening rubric / defense tabs...
echo.

set "BROWSER="
where msedge >nul 2>&1 && set "BROWSER=msedge"
if not defined BROWSER where chrome >nul 2>&1 && set "BROWSER=chrome"

call :open "http://localhost:5173/"
call :open "http://localhost:5173/cakes"
call :open "http://localhost:5173/customize"
call :open "http://localhost:5173/pickup"
call :open "http://localhost:5173/promotions"
call :open "http://localhost:5173/reviews"
call :open "http://localhost:5173/about"
call :open "http://localhost:5173/login"
call :open "http://localhost:5173/register"
call :open "http://localhost:5173/forgot-password"
call :open "http://localhost:5173/orders"
call :open "http://localhost:5173/history"
call :open "http://localhost:5173/profile"
call :open "http://localhost:5173/dashboard"
call :open "http://localhost:5173/manage/cakes"
call :open "http://localhost:5173/manage/promotions"

echo.
echo ============================================
echo   READY
echo ============================================
echo   App:  http://localhost:5173
echo   API:  http://localhost:8000/api
echo.
echo   Demo logins:
echo     aya@cakette.test / password123          (customer)
echo     admin@cakette.test / admin123           (admin)
echo     magtotomb@students.nu-clark.edu.ph / merner123!
echo     mernermagtoto55@gmail.com / merner123!
echo.
echo   Promo code: WELCOME10
echo.
echo   Error / 404 tabs are separate — run:
echo     open-error-tabs.bat
echo.
powershell -NoProfile -Command "try { $h = Invoke-RestMethod 'http://localhost:8000/api/health'; Write-Host ('  Mongo mode: ' + $h.database.mode); Write-Host ('  gradingReady: ' + $h.database.gradingReady); if (-not $h.database.gradingReady) { Write-Host ''; Write-Host '  WARNING: Not grading-ready yet.'; Write-Host '  Put Atlas MONGO_URI in server\.env and set ALLOW_MEMORY_FALLBACK=false'; } } catch { Write-Host '  Could not read /api/health' }"
echo.
echo Keep the two server windows open during defense.
echo Close this window anytime — servers keep running.
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
