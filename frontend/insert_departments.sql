-- Script para insertar departamentos básicos si no existen
-- Ejecutar este script directamente en la base de datos MySQL

INSERT IGNORE INTO departments (name, description, created_at, updated_at) VALUES 
('Tecnologías de la Información', 'Departamento encargado de la infraestructura tecnológica y sistemas informáticos', NOW(), NOW()),
('Académico', 'Departamento académico y de coordinación educativa', NOW(), NOW()),
('Administración', 'Departamento de administración y recursos financieros', NOW(), NOW()),
('Recursos Humanos', 'Departamento de gestión de personal y recursos humanos', NOW(), NOW()),
('Mantenimiento', 'Departamento de mantenimiento y servicios generales', NOW(), NOW()),
('Servicios Escolares', 'Departamento de servicios escolares y control académico', NOW(), NOW());

-- Verificar que se insertaron correctamente
SELECT id, name, description FROM departments ORDER BY id;