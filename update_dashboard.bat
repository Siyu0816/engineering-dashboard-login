@echo off

set LOG=C:\Users\bais\Documents\GitHub\engineering-dashboard\auto_update.log

cd /d "C:\Users\bais\Documents\GitHub\engineering-dashboard"

echo ======================================== >> "%LOG%"
echo %date% %time% >> "%LOG%"

python build_data.py >> "%LOG%" 2>&1

"C:\Users\bais\AppData\Local\GitHubDesktop\app-3.7.0\resources\app\git\cmd\git.exe" add .

"C:\Users\bais\AppData\Local\GitHubDesktop\app-3.7.0\resources\app\git\cmd\git.exe" diff --cached --quiet

if errorlevel 1 (
    "C:\Users\bais\AppData\Local\GitHubDesktop\app-3.7.0\resources\app\git\cmd\git.exe" commit -m "Dashboard Data Update" >> "%LOG%" 2>&1

    "C:\Users\bais\AppData\Local\GitHubDesktop\app-3.7.0\resources\app\git\cmd\git.exe" push >> "%LOG%" 2>&1
)

exit /b