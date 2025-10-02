#!/bin/bash

echo
echo "========================================"
echo "  PREPARANDO PARA DESPLIEGUE A INTERNET"
echo "========================================"
echo

echo "[1/3] Instalando dependencias..."
npm install

echo
echo "[2/3] Construyendo aplicación para producción..."
npm run build

echo
echo "[3/3] ¡Listo para desplegar!"
echo
echo "========================================"
echo "  PRÓXIMOS PASOS:"
echo "========================================"
echo
echo "1. Lee el archivo DEPLOY.md"
echo "2. Crea cuenta en PlanetScale (base de datos)"
echo "3. Crea cuenta en Vercel (hosting)"
echo "4. Sube a GitHub"
echo "5. Conecta con Vercel"
echo "6. ¡Tu app estará en internet!"
echo
echo "Credenciales para demostrar:"
echo "  Email: admin@tecnm.mx"
echo "  Password: admin123"
echo