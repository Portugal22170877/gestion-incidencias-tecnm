#!/bin/bash

echo "==============================================="
echo "   Sistema de Gestión de Incidencias - Setup"
echo "==============================================="
echo

echo "[1/4] Instalando dependencias..."
npm install

echo
echo "[2/4] Creando archivo de configuración..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado. Puedes editarlo según tus necesidades."
else
    echo "Archivo .env ya existe."
fi

echo
echo "[3/4] Verificando instalación..."
node --version
npm --version

echo
echo "[4/4] Setup completado!"
echo
echo "Para ejecutar el proyecto:"
echo "  npm run dev"
echo
echo "Para compilar para producción:"
echo "  npm run build"
echo
echo "Credenciales de prueba:"
echo "  Admin: admin@empresa.com / password"
echo "  Jefe: jefe@empresa.com / password"  
echo "  Técnico: tecnico@empresa.com / password"
echo