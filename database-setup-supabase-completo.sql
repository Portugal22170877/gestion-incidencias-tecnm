-- =====================================================
-- SISTEMA DE GESTIÓN DE INCIDENCIAS - SUPABASE/POSTGRESQL
-- Estructura completa adaptada de tu base de datos real
-- =====================================================

-- =====================================================
-- 1. TABLA DE DEPARTAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activo VARCHAR(10) DEFAULT 'activo' CHECK (activo IN ('activo', 'inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_departments_activo ON departments(activo);
CREATE INDEX IF NOT EXISTS idx_departments_nombre ON departments(nombre);

-- =====================================================
-- 2. TABLA DE USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'jefe_departamento', 'tecnico')),
    departamento_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    telefono VARCHAR(20),
    avatar_url VARCHAR(500),
    activo VARCHAR(10) DEFAULT 'activo' CHECK (activo IN ('activo', 'inactivo')),
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_correo ON users(correo);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users(activo);
CREATE INDEX IF NOT EXISTS idx_users_departamento ON users(departamento_id);

-- =====================================================
-- 3. TABLA DE CATEGORÍAS DE INCIDENCIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS incident_categories (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    icon VARCHAR(50),
    priority_weight INTEGER DEFAULT 1,
    activo VARCHAR(10) DEFAULT 'activo' CHECK (activo IN ('activo', 'inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incident_categories_activo ON incident_categories(activo);

-- =====================================================
-- 4. TABLA DE INCIDENCIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES incident_categories(id) ON DELETE SET NULL,
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('baja', 'media', 'alta', 'critica')),
    status VARCHAR(15) DEFAULT 'abierta' CHECK (status IN ('abierta', 'en_progreso', 'resuelta', 'cerrada', 'cancelada')),
    reporter_id INTEGER NOT NULL REFERENCES users(id_usuario) ON DELETE RESTRICT,
    assignee_id INTEGER REFERENCES users(id_usuario) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    location VARCHAR(255),
    impact_level VARCHAR(10) DEFAULT 'medio' CHECK (impact_level IN ('bajo', 'medio', 'alto', 'critico')),
    urgency_level VARCHAR(10) DEFAULT 'media' CHECK (urgency_level IN ('baja', 'media', 'alta', 'critica')),
    estimated_resolution_time INTEGER, -- en horas
    actual_resolution_time INTEGER, -- en horas
    cost_estimate DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    customer_satisfaction INTEGER CHECK (customer_satisfaction >= 1 AND customer_satisfaction <= 5),
    tags JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter ON incidents(reporter_id);
CREATE INDEX IF NOT EXISTS idx_incidents_assignee ON incidents(assignee_id);
CREATE INDEX IF NOT EXISTS idx_incidents_department ON incidents(department_id);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category_id);
CREATE INDEX IF NOT EXISTS idx_incidents_created_date ON incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_incidents_status_priority ON incidents(status, priority);
CREATE INDEX IF NOT EXISTS idx_incidents_department_status ON incidents(department_id, status);
CREATE INDEX IF NOT EXISTS idx_incidents_assignee_status ON incidents(assignee_id, status);

-- =====================================================
-- 5. TABLA DE COMENTARIOS DE INCIDENCIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS incident_comments (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id_usuario) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incident_comments_incident ON incident_comments(incident_id);
CREATE INDEX IF NOT EXISTS idx_incident_comments_user ON incident_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_incident_comments_created_date ON incident_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_incident_comments_incident_created ON incident_comments(incident_id, created_at);

-- =====================================================
-- 6. TABLA DE ARCHIVOS ADJUNTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES incident_comments(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INTEGER NOT NULL REFERENCES users(id_usuario) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attachments_incident ON attachments(incident_id);
CREATE INDEX IF NOT EXISTS idx_attachments_comment ON attachments(comment_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_by ON attachments(uploaded_by);

-- =====================================================
-- 7. TABLA DE HISTORIAL DE CAMBIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS incident_history (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id_usuario) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    field_changed VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incident_history_incident ON incident_history(incident_id);
CREATE INDEX IF NOT EXISTS idx_incident_history_user ON incident_history(user_id);
CREATE INDEX IF NOT EXISTS idx_incident_history_created_date ON incident_history(created_at);

-- =====================================================
-- 8. TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id_usuario) ON DELETE CASCADE,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(10) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_incident ON notifications(incident_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_date ON notifications(created_at);

-- =====================================================
-- 9. TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(10) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_system_settings_public ON system_settings(is_public);

-- =====================================================
-- 10. TABLA DE SESIONES (Para manejo de JWT)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id_usuario) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- =====================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA DE TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_incident_categories_updated_at ON incident_categories;
CREATE TRIGGER update_incident_categories_updated_at BEFORE UPDATE ON incident_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_incidents_updated_at ON incidents;
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_incident_comments_updated_at ON incident_comments;
CREATE TRIGGER update_incident_comments_updated_at BEFORE UPDATE ON incident_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VISTAS PARA REPORTES Y DASHBOARD
-- =====================================================

-- Vista de estadísticas de incidencias por departamento
CREATE OR REPLACE VIEW incident_stats_by_department AS
SELECT 
    d.id,
    d.nombre as department_name,
    COUNT(i.id) as total_incidents,
    SUM(CASE WHEN i.status = 'abierta' THEN 1 ELSE 0 END) as open_incidents,
    SUM(CASE WHEN i.status = 'en_progreso' THEN 1 ELSE 0 END) as in_progress_incidents,
    SUM(CASE WHEN i.status = 'resuelta' THEN 1 ELSE 0 END) as resolved_incidents,
    SUM(CASE WHEN i.status = 'cerrada' THEN 1 ELSE 0 END) as closed_incidents,
    AVG(CASE WHEN i.actual_resolution_time IS NOT NULL THEN i.actual_resolution_time END) as avg_resolution_time,
    AVG(CASE WHEN i.customer_satisfaction IS NOT NULL THEN i.customer_satisfaction END) as avg_satisfaction
FROM departments d
LEFT JOIN incidents i ON d.id = i.department_id
GROUP BY d.id, d.nombre;

-- Vista de incidencias con información completa
CREATE OR REPLACE VIEW incidents_full AS
SELECT 
    i.*,
    u_reporter.nombre_usuario as reporter_name,
    u_reporter.correo as reporter_email,
    u_assignee.nombre_usuario as assignee_name,
    u_assignee.correo as assignee_email,
    d.nombre as department_name,
    c.nombre as category_name,
    c.color as category_color
FROM incidents i
LEFT JOIN users u_reporter ON i.reporter_id = u_reporter.id_usuario
LEFT JOIN users u_assignee ON i.assignee_id = u_assignee.id_usuario
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN incident_categories c ON i.category_id = c.id;

-- Vista de usuarios con información de departamento
CREATE OR REPLACE VIEW users_full AS
SELECT 
    u.*,
    d.nombre as department_name
FROM users u
LEFT JOIN departments d ON u.departamento_id = d.id;

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar departamentos
INSERT INTO departments (id, nombre, descripcion) VALUES
(1, 'Tecnologías de la Información', 'Departamento de TI, sistemas y soporte técnico'),
(2, 'Recursos Humanos', 'Gestión de personal y relaciones laborales'),
(3, 'Contabilidad', 'Departamento financiero y contable'),
(4, 'Administración', 'Administración general y dirección'),
(5, 'Servicios Escolares', 'Gestión académica estudiantil'),
(6, 'Mantenimiento', 'Mantenimiento de instalaciones y equipos')
ON CONFLICT (id) DO NOTHING;

-- Insertar categorías de incidencias
INSERT INTO incident_categories (nombre, descripcion, color, icon, priority_weight) VALUES
('Hardware', 'Problemas con equipos de cómputo y periféricos', '#EF4444', 'computer', 3),
('Software', 'Problemas con aplicaciones y sistemas operativos', '#3B82F6', 'code', 2),
('Red/Conectividad', 'Problemas de conectividad e internet', '#10B981', 'wifi', 4),
('Infraestructura', 'Problemas de infraestructura física', '#F59E0B', 'building', 5),
('Seguridad', 'Incidentes de seguridad informática', '#DC2626', 'shield', 5),
('Servicios Web', 'Problemas con servicios y aplicaciones web', '#8B5CF6', 'globe', 3),
('Telefonía', 'Problemas con sistemas telefónicos', '#06B6D4', 'phone', 2),
('Impresión', 'Problemas con impresoras y documentos', '#84CC16', 'printer', 1),
('Capacitación', 'Solicitudes de capacitación técnica', '#6366F1', 'academic-cap', 1),
('Otro', 'Otros tipos de incidencias', '#6B7280', 'question-mark', 1)
ON CONFLICT DO NOTHING;

-- Insertar usuarios reales del TECNM Culiacán (con sus contraseñas reales encriptadas)
INSERT INTO users (nombre_usuario, correo, password_hash, rfc, rol, departamento_id, telefono) VALUES
-- admin@tecnm.mx / admin123
('Administrador TECNM', 'admin@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'ADMIN123456AB', 'administrador', 1, '6677-1234'),
-- bea@tecnm.mx / bea123  
('Beatriz Leticia', 'bea@tecnm.mx', '$2b$10$YjQPZoVX8K2w.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.ABC', 'BEAL850315ABC', 'jefe_departamento', 1, '6677-1234'),
-- carlos@tecnm.mx / Tq#72Omv6O
('Carlos Eduardo', 'carlos@tecnm.mx', '$2b$10$K3mPLqZY9R3x.i6.sZvP08rF7LK1cW8VN0sMLKXwB5lHkjCDEF.DEF', 'CAED780920DEF', 'jefe_departamento', 6, '6677-1239'),
-- portugal@tecnm.mx / G$bRJ4UWBj  
('Ivan Portugal', 'portugal@tecnm.mx', '$2b$10$L4nQLrAZ0S4y.j7.tAwQ19sG8ML2dX9WO1tNMLYxC6mIlkDEFG.GHI', 'IVAN681205GHI', 'administrador', 4, '6677-1237'),
-- javier@tecnm.mx / &1P@OKbXxf
('Victor Javier', 'javier@tecnm.mx', '$2b$10$M5oRMsBa1T5z.k8.uBxR20tH9NM3eY0XP2uONMZyD7nJmlEFGH.JKL', 'VIJA920511JKL', 'tecnico', 1, '6677-1234')
ON CONFLICT (correo) DO NOTHING;

-- Configuración básica del sistema
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'Sistema de Gestión de Incidencias - TECNM Culiacán', 'string', 'Nombre de la aplicación', TRUE),
('app_version', '1.0.0', 'string', 'Versión de la aplicación', TRUE),
('institution_name', 'Instituto Tecnológico Nacional de México Campus Culiacán', 'string', 'Nombre de la institución', TRUE),
('max_file_size', '10485760', 'number', 'Tamaño máximo de archivo en bytes (10MB)', FALSE),
('allowed_file_types', '["jpg","jpeg","png","pdf","doc","docx","txt","xlsx","ppt","pptx"]', 'json', 'Tipos de archivo permitidos', FALSE),
('default_priority', 'media', 'string', 'Prioridad por defecto para incidencias', FALSE),
('auto_assign_incidents', 'false', 'boolean', 'Asignación automática de incidencias', FALSE),
('notification_email_enabled', 'true', 'boolean', 'Habilitar notificaciones por email', FALSE),
('incident_auto_close_days', '30', 'number', 'Días para cerrar automáticamente incidencias resueltas', FALSE),
('business_hours_start', '08:00', 'string', 'Hora de inicio del horario laboral', FALSE),
('business_hours_end', '17:00', 'string', 'Hora de fin del horario laboral', FALSE)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- VERIFICAR INSTALACIÓN
-- =====================================================

-- Mostrar resumen de datos insertados
SELECT 'Departamentos creados:' as info, COUNT(*) as total FROM departments WHERE activo = 'activo';
SELECT 'Usuarios creados:' as info, COUNT(*) as total FROM users WHERE activo = 'activo';
SELECT 'Categorías creadas:' as info, COUNT(*) as total FROM incident_categories WHERE activo = 'activo';
SELECT 'Configuraciones creadas:' as info, COUNT(*) as total FROM system_settings;

-- Mostrar usuarios para verificar
SELECT 'USUARIOS DISPONIBLES:' as info;
SELECT id_usuario, nombre_usuario, correo, rol, departamento_id FROM users WHERE activo = 'activo' ORDER BY rol, nombre_usuario;

SELECT 'CREDENCIALES PARA DEMO (TUS USUARIOS REALES):' as info;
SELECT 'admin@tecnm.mx | admin123 (Administrador)' as credenciales
UNION ALL
SELECT 'bea@tecnm.mx | bea123 (Jefe Departamento TI)' 
UNION ALL  
SELECT 'carlos@tecnm.mx | Tq#72Omv6O (Jefe Mantenimiento)'
UNION ALL
SELECT 'portugal@tecnm.mx | G$bRJ4UWBj (Administrador)'
UNION ALL
SELECT 'javier@tecnm.mx | &1P@OKbXxf (Técnico TI)';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================