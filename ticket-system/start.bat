@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"
title نظام التذاكر الالكترونية

echo.
echo  ===========================================
echo    نظام التذاكر الالكترونية - تشغيل محلي
echo  ===========================================
echo.

rem ── ايجاد بايثون ──
set "PY="
where py >nul 2>nul && set "PY=py"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo  [خطأ] بايثون غير مثبت على الجهاز.
  echo.
  echo  نزله من:  https://www.python.org/downloads/
  echo  ومهم جدا: فعل الخيار  "Add Python to PATH"  اثناء التثبيت.
  echo.
  pause
  exit /b 1
)
echo  [1/4] بايثون: !PY!

rem ── البيئة الافتراضية ──
if not exist ".venv\Scripts\python.exe" (
  echo  [2/4] تهيئة البيئة ... ^(اول مرة فقط، تاخذ دقيقة^)
  !PY! -m venv .venv
  if errorlevel 1 ( echo  [خطأ] فشل انشاء البيئة. & pause & exit /b 1 )
) else (
  echo  [2/4] البيئة جاهزة.
)

rem ── المتطلبات ──
echo  [3/4] تثبيت المتطلبات ...
".venv\Scripts\python.exe" -m pip install --quiet --disable-pip-version-check --upgrade pip
".venv\Scripts\python.exe" -m pip install --quiet --disable-pip-version-check -r requirements.txt
if errorlevel 1 ( echo  [خطأ] فشل تثبيت المتطلبات - تأكد من الاتصال بالانترنت. & pause & exit /b 1 )

rem ── بيانات العرض ──
if not exist "data\tickets.db" (
  echo  [4/4] انشاء بيانات العرض ...
  ".venv\Scripts\python.exe" -m app.seed --demo --password=Demo!2026
) else (
  echo  [4/4] قاعدة البيانات موجودة.
)

echo.
echo  ===========================================
echo    العنوان:   http://127.0.0.1:8000
echo.
echo    مدير الدائرة:  manager
echo    موظف شعبة:     tasjeel
echo    كلمة المرور:   Demo!2026
echo.
echo    للايقاف: اضغط Ctrl+C
echo  ===========================================
echo.

start "" cmd /c "timeout /t 4 >nul && start http://127.0.0.1:8000"
".venv\Scripts\python.exe" run.py
echo.
echo  توقف الخادم.
pause
