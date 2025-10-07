-- =====================================================
-- SISTEMA DE GESTIÓN DE INCIDENCIAS - BASE DE DATOS
-- Estructura completa sin datos ficticios
-- =====================================================

-- Crear base de datos
DROP DATABASE IF EXISTS gestion_incidencias;
CREATE DATABASE gestion_incidencias;
USE gestion_incidencias;

-- =====================================================
-- 1. TABLA DE DEPARTAMENTOS
-- =====================================================
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_name VARCHAR(255),
    budget DECIMAL(15,2),
    location VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_name (name)
);

-- =====================================================
-- 2. TABLA DE USUARIOS
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    role ENUM('administrador', 'jefe_departamento', 'tecnico') NOT NULL,
    department_id INT,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_department (department_id)
);

-- =====================================================
-- 3. TABLA DE CATEGORÍAS DE INCIDENCIAS
-- =====================================================
CREATE TABLE incident_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    icon VARCHAR(50),
    priority_weight INT DEFAULT 1,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- =====================================================
-- 4. TABLA DE INCIDENCIAS
-- =====================================================
CREATE TABLE incidents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category_id INT,
    priority ENUM('baja', 'media', 'alta', 'critica') NOT NULL,
    status ENUM('abierta', 'en_progreso', 'resuelta', 'cerrada', 'cancelada') DEFAULT 'abierta',
    reporter_id INT NOT NULL,
    assignee_id INT,
    department_id INT,
    location VARCHAR(255),
    impact_level ENUM('bajo', 'medio', 'alto', 'critico') DEFAULT 'medio',
    urgency_level ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    estimated_resolution_time INT, -- en horas
    actual_resolution_time INT, -- en horas
    cost_estimate DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    customer_satisfaction INT, -- 1-5 estrellas
    tags JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES incident_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_reporter (reporter_id),
    INDEX idx_assignee (assignee_id),
    INDEX idx_department (department_id),
    INDEX idx_category (category_id),
    INDEX idx_created_date (created_at),
    FULLTEXT idx_search (title, description)
);

-- =====================================================
-- 5. TABLA DE COMENTARIOS DE INCIDENCIAS
-- =====================================================
CREATE TABLE incident_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_incident (incident_id),
    INDEX idx_user (user_id),
    INDEX idx_created_date (created_at)
);

-- =====================================================
-- 6. TABLA DE ARCHIVOS ADJUNTOS
-- =====================================================
CREATE TABLE attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT,
    comment_id INT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES incident_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_incident (incident_id),
    INDEX idx_comment (comment_id),
    INDEX idx_uploaded_by (uploaded_by)
);

-- =====================================================
-- 7. TABLA DE HISTORIAL DE CAMBIOS
-- =====================================================
CREATE TABLE incident_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    field_changed VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_incident (incident_id),
    INDEX idx_user (user_id),
    INDEX idx_created_date (created_at)
);

-- =====================================================
-- 8. TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    incident_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_incident (incident_id),
    INDEX idx_read_status (is_read),
    INDEX idx_created_date (created_at)
);

-- =====================================================
-- 9. TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =====================================================
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_public (is_public)
);

-- =====================================================
-- 10. TABLA DE SESIONES (Para manejo de JWT)
-- =====================================================
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
);

-- =====================================================
-- VISTAS PARA REPORTES Y DASHBOARD
-- =====================================================

-- Vista de estadísticas de incidencias por departamento
CREATE VIEW incident_stats_by_department AS
SELECT 
    d.id,
    d.name as department_name,
    COUNT(i.id) as total_incidents,
    SUM(CASE WHEN i.status = 'abierta' THEN 1 ELSE 0 END) as open_incidents,
    SUM(CASE WHEN i.status = 'en_progreso' THEN 1 ELSE 0 END) as in_progress_incidents,
    SUM(CASE WHEN i.status = 'resuelta' THEN 1 ELSE 0 END) as resolved_incidents,
    SUM(CASE WHEN i.status = 'cerrada' THEN 1 ELSE 0 END) as closed_incidents,
    AVG(CASE WHEN i.actual_resolution_time IS NOT NULL THEN i.actual_resolution_time END) as avg_resolution_time,
    AVG(CASE WHEN i.customer_satisfaction IS NOT NULL THEN i.customer_satisfaction END) as avg_satisfaction
FROM departments d
LEFT JOIN incidents i ON d.id = i.department_id
GROUP BY d.id, d.name;

-- Vista de incidencias con información completa
CREATE VIEW incidents_full AS
SELECT 
    i.*,
    u_reporter.name as reporter_name,
    u_reporter.email as reporter_email,
    u_assignee.name as assignee_name,
    u_assignee.email as assignee_email,
    d.name as department_name,
    c.name as category_name,
    c.color as category_color
FROM incidents i
LEFT JOIN users u_reporter ON i.reporter_id = u_reporter.id
LEFT JOIN users u_assignee ON i.assignee_id = u_assignee.id
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN incident_categories c ON i.category_id = c.id;

-- Vista de usuarios con información de departamento
CREATE VIEW users_full AS
SELECT 
    u.*,
    d.name as department_name
FROM users u
LEFT JOIN departments d ON u.department_id = d.id;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

DELIMITER //

-- Procedimiento para crear incidencia con historial
CREATE PROCEDURE CreateIncident(
    IN p_title VARCHAR(500),
    IN p_description TEXT,
    IN p_category_id INT,
    IN p_priority ENUM('baja', 'media', 'alta', 'critica'),
    IN p_reporter_id INT,
    IN p_department_id INT,
    IN p_location VARCHAR(255)
)
BEGIN
    DECLARE incident_id INT;
    
    START TRANSACTION;
    
    INSERT INTO incidents (title, description, category_id, priority, reporter_id, department_id, location)
    VALUES (p_title, p_description, p_category_id, p_priority, p_reporter_id, p_department_id, p_location);
    
    SET incident_id = LAST_INSERT_ID();
    
    INSERT INTO incident_history (incident_id, user_id, action, new_value)
    VALUES (incident_id, p_reporter_id, 'created', CONCAT('Incidencia creada: ', p_title));
    
    COMMIT;
    
    SELECT incident_id as id;
END //

-- Procedimiento para actualizar estado de incidencia
CREATE PROCEDURE UpdateIncidentStatus(
    IN p_incident_id INT,
    IN p_user_id INT,
    IN p_new_status ENUM('abierta', 'en_progreso', 'resuelta', 'cerrada', 'cancelada')
)
BEGIN
    DECLARE old_status VARCHAR(50);
    
    SELECT status INTO old_status FROM incidents WHERE id = p_incident_id;
    
    START TRANSACTION;
    
    UPDATE incidents 
    SET status = p_new_status,
        resolved_at = CASE WHEN p_new_status = 'resuelta' THEN NOW() ELSE resolved_at END,
        closed_at = CASE WHEN p_new_status = 'cerrada' THEN NOW() ELSE closed_at END
    WHERE id = p_incident_id;
    
    INSERT INTO incident_history (incident_id, user_id, action, field_changed, old_value, new_value)
    VALUES (p_incident_id, p_user_id, 'status_changed', 'status', old_status, p_new_status);
    
    COMMIT;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS PARA AUDITORIA Y LOGS
-- =====================================================

-- Trigger para actualizar timestamp de incidencias
DELIMITER //
CREATE TRIGGER incident_update_timestamp 
    BEFORE UPDATE ON incidents
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- =====================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- =====================================================

-- Índices compuestos para consultas frecuentes
ALTER TABLE incidents ADD INDEX idx_status_priority (status, priority);
ALTER TABLE incidents ADD INDEX idx_department_status (department_id, status);
ALTER TABLE incidents ADD INDEX idx_assignee_status (assignee_id, status);
ALTER TABLE incident_comments ADD INDEX idx_incident_created (incident_id, created_at);

-- =====================================================
-- CONFIGURACIÓN INICIAL MÍNIMA
-- =====================================================

-- Solo insertar un usuario administrador inicial
INSERT INTO users (name, email, password_hash, rfc, role) VALUES 
('Administrador Sistema', 'admin@empresa.com', '$2b$10$f7Q9AbKOXP89SQFF85kNy.2jCMvaPKKsrzyZLzcOA14C5UIXB2aHK', 'ADMIN123456AB', 'administrador');

-- Configuración básica del sistema
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'Sistema de Gestión de Incidencias', 'string', 'Nombre de la aplicación', TRUE),
('app_version', '1.0.0', 'string', 'Versión de la aplicación', TRUE),
('max_file_size', '10485760', 'number', 'Tamaño máximo de archivo en bytes (10MB)', FALSE),
('allowed_file_types', '["jpg","jpeg","png","pdf","doc","docx","txt"]', 'json', 'Tipos de archivo permitidos', FALSE),
('default_priority', 'media', 'string', 'Prioridad por defecto para incidencias', FALSE),
('auto_assign_incidents', 'false', 'boolean', 'Asignación automática de incidencias', FALSE);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================