@REM ----------------------------------------------------------------------------
@REM AP Agriculture Department - Custom Maven Wrapper for Windows
@REM Auto-downloads and extracts Maven if not present in the system PATH.
@REM ----------------------------------------------------------------------------
@echo off
setlocal enabledelayedexpansion

set "MAVEN_VERSION=3.9.6"
set "MAVEN_DIR=%~dp0.mvn\apache-maven-%MAVEN_VERSION%"
set "MAVEN_EXE=%MAVEN_DIR%\bin\mvn.cmd"

if exist "%MAVEN_EXE%" (
    goto :run
)

echo [MAVEN WRAPPER] Maven %MAVEN_VERSION% not detected locally. Downloading...
if not exist "%~dp0.mvn" mkdir "%~dp0.mvn"

set "ZIP_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip"
set "ZIP_PATH=%~dp0.mvn\maven-%MAVEN_VERSION%.zip"

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%ZIP_URL%', '%ZIP_PATH%')"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to download Maven %MAVEN_VERSION%. Please check your internet connection.
    exit /b %ERRORLEVEL%
)

echo [MAVEN WRAPPER] Extracting Maven zip to .mvn/ directory...
powershell -Command "Expand-Archive -Path '%ZIP_PATH%' -DestinationPath '%~dp0.mvn' -Force"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to extract Maven zip file.
    exit /b %ERRORLEVEL%
)

echo [MAVEN WRAPPER] Cleaning up temporary files...
del "%ZIP_PATH%"

:run
"%MAVEN_EXE%" %*
