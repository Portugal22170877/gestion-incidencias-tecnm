-- Script SQL para Supabase (PostgreSQL)
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla de departamentos
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo VARCHAR(10) DEFAULT 'activo' CHECK (activo IN ('activo', 'inactivo')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id_usuario SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'jefe_departamento', 'tecnico')),
  departamento_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  rfc VARCHAR(13),
  telefono VARCHAR(20),
  activo VARCHAR(10) DEFAULT 'activo' CHECK (activo IN ('activo', 'inactivo')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar departamentos de ejemplo
INSERT INTO departments (id, nombre, descripcion) VALUES
(1, 'Tecnologías de la Información', 'Departamento de TI, sistemas y soporte técnico'),
(2, 'Recursos Humanos', 'Gestión de personal y relaciones laborales'),
(3, 'Contabilidad', 'Departamento financiero y contable'),
(4, 'Administración', 'Administración general y dirección'),
(5, 'Ventas', 'Departamento comercial y ventas'),
(6, 'Marketing', 'Marketing y comunicación institucional')
ON CONFLICT (id) DO NOTHING;

-- 4. Crear usuario administrador por defecto
-- Email: admin@tecnm.mx
-- Contraseña: admin123 (encriptada con bcrypt)
INSERT INTO users (nombre_usuario, correo, password_hash, rol, departamento_id, rfc) VALUES
('Administrador Sistema', 'admin@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'administrador', 1, 'ADMIN123456'),
('Juan Pérez García', 'juan.perez@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'jefe_departamento', 1, 'PEPJ850315ABC'),
('María González López', 'maria.gonzalez@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'tecnico', 1, 'GOLM900822DEF')
ON CONFLICT (correo) DO NOTHING;

-- 5. Configurar actualizaciones automáticas de timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Verificar que todo se creó correctamente
SELECT 'Departamentos creados:' as info;
SELECT id, nombre, activo FROM departments;

SELECT 'Usuarios creados:' as info;
SELECT id_usuario, nombre_usuario, correo, rol, activo FROM users;