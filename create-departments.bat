@echo off
title Crear Departamentos - Gestión de Incidencias
echo.
echo ================================
echo   CREANDO DEPARTAMENTOS BASICOS
echo ================================
echo.
echo Ejecutando script SQL para crear departamentos...
echo.

REM Cambiar a directorio backend donde está la configuración de BD
cd /d C:\gestion-Incidencias\backend

REM Ejecutar script SQL usando mysql command line
mysql -u root -p -h localhost -P 3306 gestion_incidencias < ..\frontend\insert_departments.sql

echo.
if %ERRORLEVEL% == 0 (
    echo ✅ Departamentos creados exitosamente
    echo.
    echo Los siguientes departamentos fueron agregados:
    echo - Tecnologías de la Información
    echo - Académico  
    echo - Administración
    echo - Recursos Humanos
    echo - Mantenimiento
    echo - Servicios Escolares
    echo.
    echo Ahora puedes crear usuarios sin problemas.
) else (
    echo ❌ Error al crear departamentos
    echo.
    echo Posibles soluciones:
    echo 1. Verificar que MySQL esté ejecutándose
    echo 2. Verificar credenciales de base de datos
    echo 3. Verificar que existe la base de datos 'gestion_incidencias'
)

echo.
echo ================================
pause