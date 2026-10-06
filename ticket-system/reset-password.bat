@echo off
cd /d "%~dp0"
title Reset Passwords
echo.
echo  Resetting all account passwords to: Qadat2026
echo.
if not exist ".venv\Scripts\python.exe" (
  echo  [ERROR] Run start.bat first.
  pause
  exit /b 1
)
".venv\Scripts\python.exe" -m app.seed --password=Qadat2026
echo.
echo  Done. Accounts: manager / tasjeel / qanoni / mawarid / mutabaa
echo  Password: Qadat2026
echo.
pause
