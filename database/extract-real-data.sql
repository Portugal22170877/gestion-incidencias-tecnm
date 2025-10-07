-- Script para extraer datos de SQL Server local
-- Ejecutar esto en SQL Server Management Studio o tu cliente SQL

-- 1. Extraer departamentos
SELECT 
  'INSERT INTO departments (id, nombre, descripcion) VALUES' as start_query
UNION ALL
SELECT 
  CONCAT('(', id, ', ''', nombre, ''', ''', ISNULL(descripcion, ''), '''),')
FROM departments
WHERE activo = 'activo'
UNION ALL
SELECT 'ON CONFLICT (id) DO NOTHING;' as end_query;

-- 2. Extraer usuarios (con contraseñas hasheadas)
SELECT 
  'INSERT INTO users (nombre_usuario, correo, password_hash, rol, departamento_id, rfc) VALUES' as start_query
UNION ALL
SELECT 
  CONCAT('(''', nombre_usuario, ''', ''', correo, ''', ''', password_hash, ''', ''', rol, ''', ', departamento_id, ', ''', ISNULL(rfc, ''), '''),')
FROM users
WHERE activo = 'activo'
UNION ALL
SELECT 'ON CONFLICT (correo) DO NOTHING;' as end_query;