-- Script SQL para crear la base de datos completa
-- Ejecutar en PlanetScale, ClearDB o cualquier MySQL remoto

-- 1. Crear tabla de departamentos
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('administrador', 'jefe_departamento', 'tecnico') NOT NULL,
  departamento_id INT,
  rfc VARCHAR(13),
  telefono VARCHAR(20),
  activo ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (departamento_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 3. Insertar departamentos de ejemplo
INSERT IGNORE INTO departments (id, nombre, descripcion) VALUES
(1, 'Tecnologías de la Información', 'Departamento de TI, sistemas y soporte técnico'),
(2, 'Recursos Humanos', 'Gestión de personal y relaciones laborales'),
(3, 'Contabilidad', 'Departamento financiero y contable'),
(4, 'Administración', 'Administración general y dirección'),
(5, 'Ventas', 'Departamento comercial y ventas'),
(6, 'Marketing', 'Marketing y comunicación institucional');

-- 4. Crear usuario administrador por defecto
-- Email: admin@tecnm.mx
-- Contraseña: admin123 (encriptada con bcrypt)
INSERT IGNORE INTO users (nombre_usuario, correo, password_hash, rol, departamento_id, rfc) VALUES
('Administrador Sistema', 'admin@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'administrador', 1, 'ADMIN123456'),
('Juan Pérez García', 'juan.perez@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'jefe_departamento', 1, 'PEPJ850315ABC'),
('María González López', 'maria.gonzalez@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'tecnico', 1, 'GOLM900822DEF');

-- 5. Verificar que todo se creó correctamente
SELECT 'Departamentos creados:' as info;
SELECT id, nombre, activo FROM departments;

SELECT 'Usuarios creados:' as info;
SELECT id_usuario, nombre_usuario, correo, rol, activo FROM users;

-- Fin del script