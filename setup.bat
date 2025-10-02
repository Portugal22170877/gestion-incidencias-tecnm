@echo off
echo ===============================================
echo   Sistema de Gestion de Incidencias - Setup
echo ===============================================
echo.

echo [1/4] Instalando dependencias...
npm install

echo.
echo [2/4] Creando archivo de configuracion...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Puedes editarlo segun tus necesidades.
) else (
    echo Archivo .env ya existe.
)

echo.
echo [3/4] Verificando instalacion...
node --version
npm --version

echo.
echo [4/4] Setup completado!
echo.
echo Para ejecutar el proyecto:
echo   npm run dev
echo.
echo Para compilar para produccion:
echo   npm run build
echo.
echo Credenciales de prueba:
echo   Admin: admin@empresa.com / password
echo   Jefe: jefe@empresa.com / password  
echo   Tecnico: tecnico@empresa.com / password
echo.
pause