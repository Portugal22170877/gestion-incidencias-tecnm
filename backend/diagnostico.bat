@echo off
title Diagnóstico Backend Server
echo ================================
echo   DIAGNÓSTICO SERVIDOR BACKEND
echo ================================
echo.

echo 1. Verificando procesos Node.js:
echo --------------------------------
tasklist /FI "IMAGENAME eq node.exe"
echo.

echo 2. Verificando puerto 3001:
echo --------------------------------
netstat -ano | findstr :3001
echo.

echo 3. Verificando puerto 5173 (frontend):
echo --------------------------------
netstat -ano | findstr :5173
echo.

echo 4. Verificando MySQL (puerto 3306):
echo --------------------------------
netstat -ano | findstr :3306
echo.

echo 5. Verificando archivos importantes:
echo --------------------------------
if exist "C:\gestion-Incidencias\backend\server.js" (
    echo ✅ server.js encontrado
) else (
    echo ❌ server.js NO encontrado
)

if exist "C:\gestion-Incidencias\backend\.env" (
    echo ✅ .env encontrado
) else (
    echo ❌ .env NO encontrado
)

if exist "C:\gestion-Incidencias\backend\package.json" (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NO encontrado
)

echo.
echo 6. Test de conectividad:
echo --------------------------------
echo Probando backend...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -Method GET -TimeoutSec 5 | Format-Table } catch { Write-Host 'Backend no responde' }"

echo.
echo ================================
echo   FIN DEL DIAGNÓSTICO
echo ================================
pause