@echo off
echo Building APK (release)...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.14.7-hotspot
set NODE_ENV=production
cd android
call gradlew.bat assembleRelease
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! See output above.
) else (
    echo Build SUCCESSFUL!
    echo APK Location: android\app\build\outputs\apk\release\app-release.apk
    explorer app\build\outputs\apk\release
)
pause
