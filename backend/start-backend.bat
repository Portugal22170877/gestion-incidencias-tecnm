@echo off
echo Iniciando Backend de Gestion de Incidencias...
echo.

REM Configurar PATH de Node.js
set PATH=C:\Program Files\nodejs;%PATH%

REM Cambiar al directorio del backend
cd /d "C:\gestion-Incidencias\backend"

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    echo.
)

REM Iniciar el servidor en modo desarrollo
echo Iniciando servidor en modo desarrollo...
echo Servidor disponible en: http://localhost:3001
echo API Health: http://localhost:3001/api/health
echo DB Status: http://localhost:3001/api/db-status
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev