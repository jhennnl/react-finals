@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

title cakette - MongoDB Atlas setup
color 0B

echo ============================================
echo   cakette MongoDB Atlas setup
echo ============================================
echo.
echo This will:
echo   1. Log you into MongoDB Atlas (browser)
echo   2. Create a free M0 cluster named cakette
echo   3. Allow your IP + create a DB user
echo   4. Write server\.env and seed the database
echo.
echo You need a free Atlas account:
echo   https://www.mongodb.com/cloud/atlas/register
echo.
pause

set "PATH=%ProgramFiles%\MongoDB\AtlasCLI\bin;%ProgramFiles%\MongoDB\mongosh\bin;%PATH%"

where atlas >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Atlas CLI not found.
  echo Install with: winget install MongoDB.MongoDBAtlasCLI
  pause
  exit /b 1
)

echo.
echo [1/5] Atlas login - pick UserAccount, then finish in the browser...
echo.
atlas auth login
if errorlevel 1 (
  echo [ERROR] Atlas login failed.
  pause
  exit /b 1
)

echo.
echo Logged in as:
atlas auth whoami
echo.

set "ATLAS_USER=cakette_app"
set "ATLAS_PASS=CaketteApp123!"
set "ATLAS_CLUSTER=cakette"

echo [2/5] Creating free M0 cluster "%ATLAS_CLUSTER%" (may take a few minutes)...
echo       DB user: %ATLAS_USER%
echo.
atlas setup --force --clusterName %ATLAS_CLUSTER% --provider AWS --region AP_SOUTHEAST_1 --tier M0 --username %ATLAS_USER% --password "%ATLAS_PASS%" --accessListIp 0.0.0.0/0 --skipSampleData --connectWith skip
if errorlevel 1 (
  echo.
  echo [WARN] atlas setup reported an error.
  echo        If a cluster already exists, continuing to fetch connection info...
)

echo.
echo [3/5] Waiting for cluster to be available...
set /a tries=0
:wait_cluster
set /a tries+=1
atlas clusters describe %ATLAS_CLUSTER% --output json > "%TEMP%\cakette-atlas-cluster.json" 2>nul
if errorlevel 1 (
  if !tries! GEQ 60 (
    echo [ERROR] Cluster not ready. Check https://cloud.mongodb.com
    pause
    exit /b 1
  )
  timeout /t 5 /nobreak >nul
  goto wait_cluster
)

for /f "delims=" %%A in ('powershell -NoProfile -Command "$j=Get-Content $env:TEMP\cakette-atlas-cluster.json -Raw | ConvertFrom-Json; if ($j.state -eq 'IDLE') { 'READY' } else { $j.state }"') do set "CLUSTER_STATE=%%A"
if /I not "%CLUSTER_STATE%"=="READY" (
  echo       State: %CLUSTER_STATE% - still waiting...
  if %tries% GEQ 60 (
    echo [ERROR] Timed out waiting for IDLE state.
    pause
    exit /b 1
  )
  timeout /t 5 /nobreak >nul
  goto wait_cluster
)
echo       Cluster is IDLE / ready.

echo.
echo [4/5] Building connection string into server\.env ...
for /f "delims=" %%A in ('atlas clusters connectionStrings describe %ATLAS_CLUSTER% --output json 2^>nul ^| powershell -NoProfile -Command "$j=$input|ConvertFrom-Json; $s=$j.standardSrv; if (-not $s) { exit 1 }; $s -replace 'mongodb\+srv://','mongodb+srv://%ATLAS_USER%:%ATLAS_PASS%@' -replace '/\?','/cakette?'"') do set "MONGO_URI=%%A"

if not defined MONGO_URI (
  echo [ERROR] Could not build MONGO_URI automatically.
  echo.
  echo Open Atlas -^> Connect -^> Drivers, copy the SRV string, then paste it here.
  set /p MONGO_URI=MONGO_URI=
)

REM Ensure DB name is cakette
echo !MONGO_URI! | findstr /I "/cakette" >nul
if errorlevel 1 (
  set "MONGO_URI=!MONGO_URI:?retryWrites=true&w=majority:/cakette?retryWrites=true&w=majority!"
)

(
  echo PORT=8000
  echo CLIENT_ORIGIN=http://localhost:5173
  echo MONGO_URI=!MONGO_URI!
  echo ALLOW_MEMORY_FALLBACK=false
) > "server\.env"

echo       Wrote server\.env
echo.

echo [5/5] Seeding Atlas database...
pushd server
call npm run seed
if errorlevel 1 (
  popd
  echo [ERROR] Seed failed. Check MONGO_URI / Network Access 0.0.0.0/0 in Atlas.
  pause
  exit /b 1
)
popd

echo.
echo Verifying API against Atlas (start server if needed)...
powershell -NoProfile -Command "try { $h=Invoke-RestMethod 'http://localhost:8000/api/health' -TimeoutSec 3; Write-Host ('  mode=' + $h.database.mode + ' gradingReady=' + $h.database.gradingReady) } catch { Write-Host '  API not running yet. Start with start-defense.bat, then open /api/health' }"

echo.
echo ============================================
echo   ATLAS READY
echo ============================================
echo   Cluster:  %ATLAS_CLUSTER%
echo   DB user:  %ATLAS_USER%
echo   Password: %ATLAS_PASS%
echo   Network:  0.0.0.0/0 (open for class demos)
echo.
echo   Next: run start-defense.bat
echo   Confirm: http://localhost:8000/api/health
echo            gradingReady should be true
echo            mode should NOT be memory
echo ============================================
pause
exit /b 0
