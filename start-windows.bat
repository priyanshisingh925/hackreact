@echo off
echo.
echo   ReActivate AI - Windows Launcher
echo   ==================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

:: Install backend deps if needed
if not exist "server\node_modules" (
  echo [INSTALL] Installing backend dependencies...
  cd server
  call npm install --no-audit --no-fund
  cd ..
  echo [INSTALL] Backend ready.
)

:: Install frontend deps if needed
if not exist "client\node_modules" (
  echo [INSTALL] Installing frontend dependencies...
  cd client
  call npm install --no-audit --no-fund
  cd ..
  echo [INSTALL] Frontend ready.
)

:: Start backend in new window
echo [START] Starting backend on port 3001...
start "ReActivate-Backend" cmd /k "cd server && node server.js"

:: Wait for backend
timeout /t 4 /nobreak >nul

:: Start frontend in new window
echo [START] Starting frontend on port 5173...
start "ReActivate-Frontend" cmd /k "cd client && npx vite --port 5173"

:: Wait then open browser
timeout /t 5 /nobreak >nul
echo [READY] Opening browser...
start "" "http://localhost:5173"

echo.
echo [READY] Backend  -^>  http://localhost:3001
echo [READY] Frontend -^>  http://localhost:5173
echo.
echo Both servers running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
