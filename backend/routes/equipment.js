const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'gestion_incidencias'
};

// Middleware para verificar autenticación
const auth = require('../middleware/auth');

// Obtener todas las categorías de equipos
router.get('/categories', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [categories] = await connection.execute(
      'SELECT * FROM equipment_categories ORDER BY name'
    );

    await connection.end();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener todo el equipo de un espacio específico
router.get('/space/:spaceId', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el espacio existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = 'SELECT id, department_id FROM spaces WHERE id = ?';
    let checkParams = [req.params.spaceId];

    if (req.user.role !== 'administrador') {
      checkQuery += ' AND department_id = ?';
      checkParams.push(req.user.department_id);
    }

    const [existingSpace] = await connection.execute(checkQuery, checkParams);

    if (existingSpace.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Espacio no encontrado'
      });
    }

    const [equipment] = await connection.execute(
      `SELECT e.*, ec.name as category_name, ec.color as category_color,
              s.name as space_name
       FROM equipment e
       LEFT JOIN equipment_categories ec ON e.category_id = ec.id
       LEFT JOIN spaces s ON e.space_id = s.id
       WHERE e.space_id = ?
       ORDER BY e.name`,
      [req.params.spaceId]
    );

    await connection.end();

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener un equipo específico
router.get('/:id', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [equipment] = await connection.execute(
      `SELECT e.*, ec.name as category_name, ec.color as category_color,
              s.name as space_name, s.department_id
       FROM equipment e
       LEFT JOIN equipment_categories ec ON e.category_id = ec.id
       LEFT JOIN spaces s ON e.space_id = s.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (equipment.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Verificar permisos de departamento si no es admin
    if (req.user.role !== 'administrador' && equipment[0].department_id !== req.user.department_id) {
      await connection.end();
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver este equipo'
      });
    }

    await connection.end();

    res.json({
      success: true,
      data: equipment[0]
    });
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Crear un nuevo equipo
router.post('/', auth, async (req, res) => {
  try {
    const {
      name, brand, model, serial_number, category_id, space_id,
      condition_status, purchase_date, purchase_price, warranty_expiry,
      location_detail, notes
    } = req.body;
    
    if (!name || !space_id || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, espacio y categoría son requeridos'
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el espacio existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = 'SELECT id, department_id FROM spaces WHERE id = ?';
    let checkParams = [space_id];

    if (req.user.role !== 'administrador') {
      checkQuery += ' AND department_id = ?';
      checkParams.push(req.user.department_id);
    }

    const [existingSpace] = await connection.execute(checkQuery, checkParams);

    if (existingSpace.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Espacio no encontrado'
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO equipment (
        name, brand, model, serial_number, category_id, space_id,
        condition_status, purchase_date, purchase_price, warranty_expiry,
        location_detail, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [
        name, brand, model, serial_number, category_id, space_id,
        condition_status, purchase_date, purchase_price, warranty_expiry,
        location_detail, notes
      ]
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'Equipo creado exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar un equipo
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name, brand, model, serial_number, category_id, space_id,
      condition_status, purchase_date, purchase_price, warranty_expiry,
      location_detail, notes, status
    } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el equipo existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = `
      SELECT e.id, s.department_id 
      FROM equipment e 
      JOIN spaces s ON e.space_id = s.id 
      WHERE e.id = ?
    `;
    let checkParams = [req.params.id];

    if (req.user.role !== 'administrador') {
      checkQuery += ' AND s.department_id = ?';
      checkParams.push(req.user.department_id);
    }

    const [existingEquipment] = await connection.execute(checkQuery, checkParams);

    if (existingEquipment.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Si se cambia el espacio, verificar que el nuevo espacio existe y pertenece al departamento
    if (space_id && space_id !== existingEquipment[0].space_id) {
      let spaceCheckQuery = 'SELECT id, department_id FROM spaces WHERE id = ?';
      let spaceCheckParams = [space_id];

      if (req.user.role !== 'administrador') {
        spaceCheckQuery += ' AND department_id = ?';
        spaceCheckParams.push(req.user.department_id);
      }

      const [newSpace] = await connection.execute(spaceCheckQuery, spaceCheckParams);

      if (newSpace.length === 0) {
        await connection.end();
        return res.status(404).json({
          success: false,
          message: 'Espacio de destino no encontrado'
        });
      }
    }

    const [result] = await connection.execute(
      `UPDATE equipment SET 
       name = ?, brand = ?, model = ?, serial_number = ?, category_id = ?, space_id = ?,
       condition_status = ?, purchase_date = ?, purchase_price = ?, warranty_expiry = ?,
       location_detail = ?, notes = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name, brand, model, serial_number, category_id, space_id,
        condition_status, purchase_date, purchase_price, warranty_expiry,
        location_detail, notes, status, req.params.id
      ]
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Equipo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar un equipo
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el equipo existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = `
      SELECT e.id, s.department_id 
      FROM equipment e 
      JOIN spaces s ON e.space_id = s.id 
      WHERE e.id = ?
    `;
    let checkParams = [req.params.id];

    if (req.user.role !== 'administrador') {
      checkQuery += ' AND s.department_id = ?';
      checkParams.push(req.user.department_id);
    }

    const [existingEquipment] = await connection.execute(checkQuery, checkParams);

    if (existingEquipment.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    const [result] = await connection.execute(
      'DELETE FROM equipment WHERE id = ?',
      [req.params.id]
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Equipo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener historial de mantenimiento de un equipo
router.get('/:id/maintenance', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el equipo existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = `
      SELECT e.id, s.department_id 
      FROM equipment e 
      JOIN spaces s ON e.space_id = s.id 
      WHERE e.id = ?
    `;
    let checkParams = [req.params.id];

    if (req.user.role !== 'administrador') {
      checkQuery += ' AND s.department_id = ?';
      checkParams.push(req.user.department_id);
    }

    const [existingEquipment] = await connection.execute(checkQuery, checkParams);

    if (existingEquipment.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    const [maintenance] = await connection.execute(
      `SELECT mh.*, u.first_name, u.last_name
       FROM maintenance_history mh
       LEFT JOIN users u ON mh.performed_by = u.id
       WHERE mh.equipment_id = ?
       ORDER BY mh.performed_date DESC`,
      [req.params.id]
    );

    await connection.end();

    res.json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    console.error('Error al obtener historial de mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Agregar registro de mantenimiento
router.post('/:id/maintenance', auth, async (req, res) => {
  try {
    const { maintenance_type, description, cost, next_maintenance_date } = req.body;
    
    if (!maintenance_type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de mantenimiento y descripción son requeridos'
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el equipo existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = `
      SELECT e.id, s.department_id 
      FROM equipment e 
      JOIN spaces s ON e.space_id = s.id 
      WHERE e.id = ?
    `;
    let checkParams = [req.params.id];

    if (req.user.role !== 'administrador') {
      checkQuery += ' AND s.department_id = ?';
      checkParams.push(req.user.department_id);
    }

    const [existingEquipment] = await connection.execute(checkQuery, checkParams);

    if (existingEquipment.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO maintenance_history (
        equipment_id, maintenance_type, description, cost, 
        performed_date, performed_by, next_maintenance_date
      ) VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
      [req.params.id, maintenance_type, description, cost, req.user.id, next_maintenance_date]
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'Registro de mantenimiento agregado exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al agregar mantenimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
