@echo off
REM Sowing Assessment Frontend - Installation Script for Windows
REM This script sets up the frontend development environment

echo.
echo 🌾 Sowing Assessment - Fallow Land Intelligence
echo ================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm version: %NPM_VERSION%

echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Installation failed!
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo.
    echo 📝 Creating .env.local configuration file...
    copy .env.example .env.local
    echo ✓ Configuration file created. Update .env.local with your settings.
)

echo.
echo ✅ Installation complete!
echo.
echo Next steps:
echo 1. Review and update .env.local with your settings
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
