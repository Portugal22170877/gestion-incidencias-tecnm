@echo off
echo ===================================
echo   INICIANDO SISTEMA DE GESTION
echo   DE INCIDENCIAS
echo ===================================

echo.
echo [1/3] Iniciando Backend (Puerto 3001)...
cd /d "C:\gestion-Incidencias\backend"
start "Backend Server" cmd /k "node server.js"

echo.
echo [2/3] Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Iniciando Frontend (Puerto 5173)...
cd /d "C:\gestion-Incidencias\frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ===================================
echo   SERVIDORES INICIADOS:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo ===================================
echo.
echo Presiona cualquier tecla para cerrar este mensaje...
pause >nul