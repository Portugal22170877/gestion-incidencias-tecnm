@echo off
title Backend Server - Gestión de Incidencias
cd /d C:\gestion-Incidencias\backend

:start
echo.
echo ================================
echo  INICIANDO SERVIDOR BACKEND
echo ================================
echo Puerto: 3001
echo Directorio: %CD%
echo Hora: %date% %time%
echo ================================
echo.

node server.js

echo.
echo ================================
echo  SERVIDOR DETENIDO
echo ================================
echo.
echo ¿Desea reiniciar el servidor? (S/N)
set /p restart=
if /i "%restart%"=="S" goto start
if /i "%restart%"=="s" goto start

echo Cerrando...
pause