-- Script para actualizar contraseñas reales después de crear la base de datos
-- Ejecutar DESPUÉS del script principal si las contraseñas no funcionan

-- Nota: Para que las contraseñas funcionen, necesitas actualizar con los hashes reales
-- Este script es para referencia, las contraseñas se actualizarán desde el backend

-- Usuarios y sus contraseñas:
-- admin@tecnm.mx -> admin123
-- bea@tecnm.mx -> bea123
-- carlos@tecnm.mx -> Tq#72Omv6O
-- portugal@tecnm.mx -> G$bRJ4UWBj
-- javier@tecnm.mx -> &1P@OKbXxf

-- Como alternativa, puedes usar el panel de administración web para resetear las contraseñas
-- una vez que la aplicación esté funcionando.

SELECT 'Para actualizar contraseñas:' as instruccion;
SELECT '1. Ejecuta el script principal primero' as paso;
SELECT '2. Inicia la aplicación web' as paso;
SELECT '3. Inicia sesión como admin@tecnm.mx / admin123' as paso;
SELECT '4. Ve a gestión de usuarios y resetea las contraseñas según necesites' as paso;