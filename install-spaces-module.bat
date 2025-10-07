@echo off
title Instalacion del Modulo de Espacios e Inventario
echo.
echo =========================================================
echo   MODULO DE GESTION DE ESPACIOS E INVENTARIO
echo   Instituto Tecnologico de Culiacan
echo =========================================================
echo.
echo Este script instalara las tablas necesarias para el
echo modulo de gestion de espacios e inventario.
echo.
echo IMPORTANTE: Asegurate de tener el servidor MySQL ejecutandose
echo.
pause

echo.
echo Ejecutando migracion de base de datos...
echo.

REM Verificar si MySQL esta disponible
mysql --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: MySQL no esta disponible en el PATH del sistema.
    echo.
    echo Por favor verifica que MySQL este instalado y agregado al PATH.
    echo.
    pause
    exit /b 1
)

REM Ejecutar el script SQL
echo Conectando a la base de datos...
mysql -u root -p -h localhost -P 3306 gestion_incidencias < database\spaces-inventory-schema.sql

if %ERRORLEVEL% == 0 (
    echo.
    echo ========================================================
    echo   INSTALACION COMPLETADA EXITOSAMENTE
    echo ========================================================
    echo.
    echo El modulo de Espacios e Inventario ha sido instalado.
    echo.
    echo Nuevas funcionalidades disponibles:
    echo - Gestion de espacios (aulas, cubiculos, laboratorios)
    echo - Inventario de equipos por espacio
    echo - Categorias de equipos predefinidas
    echo - Historial de mantenimiento
    echo - Reportes de inventario
    echo.
    echo ACCESO:
    echo - Administradores: Acceso completo desde Panel Admin
    echo - Jefes Depto: Gestion de sus espacios desde Dashboard
    echo.
    echo URL: http://localhost:5173/spaces
    echo.
) else (
    echo.
    echo ========================================================
    echo   ERROR EN LA INSTALACION
    echo ========================================================
    echo.
    echo No se pudo instalar el modulo correctamente.
    echo.
    echo Posibles causas:
    echo 1. MySQL no esta ejecutandose
    echo 2. Credenciales incorrectas
    echo 3. Base de datos 'gestion_incidencias' no existe
    echo 4. Permisos insuficientes
    echo.
    echo Verifica estos puntos y ejecuta el script nuevamente.
    echo.
)

pause