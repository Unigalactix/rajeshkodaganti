@echo off
echo Starting Portfolio Email Notification Service...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist package.json (
    echo ERROR: package.json not found
    echo Please run this script from the backend folder
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found
    echo Please copy .env.example to .env and configure your settings
    echo.
    if exist .env.example (
        echo Copying .env.example to .env...
        copy .env.example .env
        echo.
        echo Please edit the .env file with your Gmail credentials and run this script again
        pause
        exit /b 1
    )
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the service
echo Starting the notification service...
echo.
echo The service will run on http://localhost:3000
echo Press Ctrl+C to stop the service
echo.
npm start
