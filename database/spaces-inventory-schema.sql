-- =====================================================
-- MÓDULO DE GESTIÓN DE ESPACIOS E INVENTARIO
-- Extensión para que jefes de departamento gestionen aulas y equipos
-- =====================================================

-- =====================================================
-- 1. TABLA DE ESPACIOS (AULAS, CUBÍCULOS, LABORATORIOS)
-- =====================================================
CREATE TABLE IF NOT EXISTS spaces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('aula', 'cubiculo', 'laboratorio', 'oficina', 'sala_juntas', 'otro') NOT NULL,
    location VARCHAR(255), -- Edificio, piso, número
    capacity INT, -- Capacidad de personas
    area_m2 DECIMAL(8,2), -- Área en metros cuadrados
    description TEXT,
    status ENUM('activo', 'inactivo', 'mantenimiento') DEFAULT 'activo',
    responsible_user_id INT, -- Usuario responsable del espacio
    created_by INT NOT NULL, -- Quien creó el registro
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_department (department_id),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- =====================================================
-- 2. TABLA DE CATEGORÍAS DE EQUIPOS
-- =====================================================
CREATE TABLE IF NOT EXISTS equipment_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Nombre del ícono para la UI
    color VARCHAR(7) DEFAULT '#6B7280', -- Color hex para la UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name),
    INDEX idx_name (name)
);

-- =====================================================
-- 3. TABLA DE EQUIPOS/INVENTARIO
-- =====================================================
CREATE TABLE IF NOT EXISTS equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    space_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    warranty_expiry DATE,
    condition_status ENUM('excelente', 'bueno', 'regular', 'malo', 'fuera_servicio') DEFAULT 'bueno',
    quantity INT DEFAULT 1,
    description TEXT,
    specifications JSON, -- Para specs técnicas específicas
    maintenance_schedule ENUM('semanal', 'mensual', 'trimestral', 'semestral', 'anual', 'ninguno') DEFAULT 'ninguno',
    last_maintenance DATE,
    next_maintenance DATE,
    barcode VARCHAR(50),
    qr_code VARCHAR(255),
    status ENUM('activo', 'inactivo', 'prestado', 'mantenimiento', 'baja') DEFAULT 'activo',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_space (space_id),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_condition (condition_status),
    INDEX idx_serial (serial_number),
    INDEX idx_barcode (barcode)
);

-- =====================================================
-- 4. TABLA DE HISTORIAL DE MANTENIMIENTO
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    maintenance_type ENUM('preventivo', 'correctivo', 'revision', 'calibracion', 'limpieza') NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2),
    performed_by VARCHAR(100),
    external_service BOOLEAN DEFAULT FALSE,
    service_provider VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('programado', 'en_proceso', 'completado', 'cancelado') DEFAULT 'programado',
    notes TEXT,
    attachments JSON, -- URLs de fotos, documentos, etc.
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_equipment (equipment_id),
    INDEX idx_type (maintenance_type),
    INDEX idx_status (status),
    INDEX idx_date (start_date)
);

-- =====================================================
-- 5. INSERTAR CATEGORÍAS DE EQUIPOS PREDEFINIDAS
-- =====================================================
INSERT IGNORE INTO equipment_categories (name, description, icon, color) VALUES
('Mobiliario', 'Mesas, sillas, escritorios, estantes', 'chair', '#8B5CF6'),
('Tecnología', 'Computadoras, laptops, tablets', 'computer', '#3B82F6'),
('Audio y Video', 'Proyectores, pantallas, bocinas, micrófonos', 'projector', '#EF4444'),
('Herramientas', 'Herramientas de trabajo y mantenimiento', 'wrench', '#F59E0B'),
('Iluminación', 'Lámparas, focos, reflectores', 'light-bulb', '#FBBF24'),
('Conectividad', 'Cables, adaptadores, extensiones', 'cable', '#10B981'),
('Periféricos', 'Monitores, teclados, ratones, impresoras', 'keyboard', '#6B7280'),
('Aire Acondicionado', 'Aires acondicionados, ventiladores', 'ac', '#06B6D4'),
('Seguridad', 'Cámaras, cerraduras, extintores', 'shield', '#DC2626'),
('Electrodomésticos', 'Refrigeradores, microondas, cafeteras', 'appliance', '#84CC16'),
('Material Didáctico', 'Pizarrones, marcadores, material educativo', 'book', '#8B5CF6'),
('Otro', 'Equipos que no encajan en otras categorías', 'box', '#6B7280');

-- =====================================================
-- 6. VISTA PARA REPORTES DE INVENTARIO POR DEPARTAMENTO
-- =====================================================
CREATE OR REPLACE VIEW vw_department_inventory AS
SELECT 
    d.id as department_id,
    d.name as department_name,
    s.id as space_id,
    s.name as space_name,
    s.type as space_type,
    s.location,
    COUNT(e.id) as total_equipment,
    SUM(e.quantity) as total_items,
    SUM(CASE WHEN e.status = 'activo' THEN e.quantity ELSE 0 END) as active_items,
    SUM(CASE WHEN e.condition_status = 'malo' OR e.condition_status = 'fuera_servicio' THEN e.quantity ELSE 0 END) as items_need_attention,
    SUM(IFNULL(e.purchase_price * e.quantity, 0)) as total_value,
    s.status as space_status
FROM departments d
LEFT JOIN spaces s ON d.id = s.department_id
LEFT JOIN equipment e ON s.id = e.space_id
GROUP BY d.id, s.id
ORDER BY d.name, s.name;

-- =====================================================
-- 7. TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =====================================================

-- Trigger para actualizar next_maintenance cuando se crea un equipo
DELIMITER //
CREATE TRIGGER update_next_maintenance 
BEFORE INSERT ON equipment
FOR EACH ROW
BEGIN
    IF NEW.maintenance_schedule != 'ninguno' AND NEW.last_maintenance IS NOT NULL THEN
        CASE NEW.maintenance_schedule
            WHEN 'semanal' THEN SET NEW.next_maintenance = DATE_ADD(NEW.last_maintenance, INTERVAL 1 WEEK);
            WHEN 'mensual' THEN SET NEW.next_maintenance = DATE_ADD(NEW.last_maintenance, INTERVAL 1 MONTH);
            WHEN 'trimestral' THEN SET NEW.next_maintenance = DATE_ADD(NEW.last_maintenance, INTERVAL 3 MONTH);
            WHEN 'semestral' THEN SET NEW.next_maintenance = DATE_ADD(NEW.last_maintenance, INTERVAL 6 MONTH);
            WHEN 'anual' THEN SET NEW.next_maintenance = DATE_ADD(NEW.last_maintenance, INTERVAL 1 YEAR);
        END CASE;
    END IF;
END //
DELIMITER ;

-- =====================================================
-- 8. DATOS DE EJEMPLO PARA TESTING (OPCIONAL)
-- =====================================================

-- Insertar algunos espacios de ejemplo (solo ejecutar si necesitas datos de prueba)
/*
INSERT INTO spaces (department_id, name, type, location, capacity, area_m2, description, created_by) VALUES
(1, 'Aula A-101', 'aula', 'Edificio A, Planta Baja', 40, 60.00, 'Aula principal para clases de programación', 1),
(1, 'Laboratorio de Sistemas', 'laboratorio', 'Edificio A, Primer Piso', 25, 80.00, 'Laboratorio con 25 computadoras', 1),
(2, 'Oficina RH-01', 'oficina', 'Edificio Administrativo', 5, 25.00, 'Oficina principal de Recursos Humanos', 2);

INSERT INTO equipment (space_id, category_id, name, brand, model, quantity, condition_status, created_by) VALUES
(1, 1, 'Mesa de estudiante', 'Mobiliario Escolar', 'ME-001', 20, 'bueno', 1),
(1, 1, 'Silla estudiantil', 'Mobiliario Escolar', 'SE-001', 40, 'bueno', 1),
(1, 3, 'Proyector', 'Epson', 'PowerLite 2042', 1, 'excelente', 1),
(2, 2, 'Computadora de escritorio', 'Dell', 'OptiPlex 3080', 25, 'bueno', 1),
(2, 7, 'Monitor LCD', 'Dell', 'E2420H', 25, 'bueno', 1);
*/

-- =====================================================
-- CONSULTAS ÚTILES PARA VERIFICAR LA INSTALACIÓN
-- =====================================================

SELECT 'Estructura de base de datos creada exitosamente' as mensaje;

-- Verificar tablas creadas
SELECT 
    table_name as 'Tablas del módulo de inventario'
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
    AND table_name IN ('spaces', 'equipment_categories', 'equipment', 'maintenance_history')
ORDER BY table_name;

-- Verificar categorías de equipos
SELECT 
    COUNT(*) as 'Categorías de equipos disponibles'
FROM equipment_categories;

SELECT 'Módulo de Gestión de Espacios e Inventario instalado correctamente' as resultado;