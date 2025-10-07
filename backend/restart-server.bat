@echo off
title Restart Backend Server
echo ================================
echo   REINICIANDO SERVIDOR BACKEND
echo ================================
echo.

echo Matando procesos Node.js existentes...
taskkill /f /im node.exe >nul 2>&1
if errorlevel 1 (
    echo No hay procesos Node.js corriendo
) else (
    echo Procesos Node.js terminados
)

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo Verificando puerto 3001...
netstat -ano | findstr :3001
if errorlevel 1 (
    echo Puerto 3001 libre
) else (
    echo Advertencia: Puerto 3001 aún en uso
)

echo.
echo Iniciando servidor...
cd /d C:\gestion-Incidencias\backend
call start-backend.bat