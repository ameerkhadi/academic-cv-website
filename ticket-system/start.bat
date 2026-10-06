@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title E-Ticket System - Local

echo.
echo  ==========================================
echo    E-TICKET SYSTEM  --  Local Run
echo  ==========================================
echo.

rem ---- find python ----
set "PY="
where py >nul 2>nul && set "PY=py"
if not defined PY (
  where python >nul 2>nul && set "PY=python"
)
if not defined PY (
  echo  [ERROR] Python is not installed.
  echo.
  echo   1. Download:  https://www.python.org/downloads/
  echo   2. IMPORTANT: tick  "Add python.exe to PATH"  while installing
  echo   3. Close this window, then run start.bat again
  echo.
  pause
  exit /b 1
)
echo  [1/4] Python found: !PY!

rem ---- virtual environment ----
if not exist ".venv\Scripts\python.exe" (
  echo  [2/4] Creating environment ... ^(first run only, ~1 min^)
  !PY! -m venv .venv
  if errorlevel 1 (
    echo  [ERROR] Could not create the environment.
    pause
    exit /b 1
  )
) else (
  echo  [2/4] Environment ready.
)

rem ---- dependencies ----
echo  [3/4] Installing requirements ...
".venv\Scripts\python.exe" -m pip install --quiet --disable-pip-version-check --upgrade pip
".venv\Scripts\python.exe" -m pip install --quiet --disable-pip-version-check -r requirements.txt
if errorlevel 1 (
  echo  [ERROR] Install failed - check your internet connection.
  pause
  exit /b 1
)

rem ---- demo data ----
if not exist "data\tickets.db" (
  echo  [4/4] Creating demo data ...
  ".venv\Scripts\python.exe" -m app.seed --demo --password=Qadat2026
) else (
  echo  [4/4] Database found.
)

echo.
echo  ==========================================
echo     URL:       http://127.0.0.1:8000
echo.
echo     Manager:   manager
echo     Employee:  tasjeel
echo     Password:  Qadat2026
echo.
echo     Stop:      press Ctrl+C
echo  ==========================================
echo.

start "" cmd /c "timeout /t 5 >nul & start http://127.0.0.1:8000"
".venv\Scripts\python.exe" run.py

echo.
echo  Server stopped.
pause
