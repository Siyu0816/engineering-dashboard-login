@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo 请先安装 Node.js 22.13 或更高版本，然后重新运行此文件。
  pause
  exit /b 1
)
node -e "const v=process.versions.node.split('.').map(Number);process.exit(v[0]<22||(v[0]===22&&v[1]<13)?1:0)"
if errorlevel 1 (
  echo 当前 Node.js 版本过低，请升级至 22.13 或更高版本。
  pause
  exit /b 1
)
node serve.mjs
pause
