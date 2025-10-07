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

// Obtener todos los espacios del departamento del usuario
router.get('/', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    let query = `
      SELECT s.*, d.name as department_name,
             COUNT(e.id) as total_equipment,
             SUM(CASE WHEN e.condition_status = 'bueno' THEN 1 ELSE 0 END) as equipment_good,
             SUM(CASE WHEN e.condition_status = 'regular' THEN 1 ELSE 0 END) as equipment_fair,
             SUM(CASE WHEN e.condition_status = 'malo' THEN 1 ELSE 0 END) as equipment_poor
      FROM spaces s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN equipment e ON s.id = e.space_id
    `;

    let params = [];

    // Si el usuario no es admin, solo mostrar espacios de su departamento
    if (req.user.role !== 'administrador') {
      query += ' WHERE s.department_id = ?';
      params.push(req.user.department_id);
    }

    query += ' GROUP BY s.id ORDER BY s.name';

    const [spaces] = await connection.execute(query, params);
    await connection.end();

    res.json({
      success: true,
      data: spaces
    });
  } catch (error) {
    console.error('Error al obtener espacios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener un espacio específico
router.get('/:id', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    let query = `
      SELECT s.*, d.name as department_name
      FROM spaces s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.id = ?
    `;

    let params = [req.params.id];

    // Si el usuario no es admin, verificar que el espacio pertenezca a su departamento
    if (req.user.role !== 'administrador') {
      query += ' AND s.department_id = ?';
      params.push(req.user.department_id);
    }

    const [spaces] = await connection.execute(query, params);
    await connection.end();

    if (spaces.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Espacio no encontrado'
      });
    }

    res.json({
      success: true,
      data: spaces[0]
    });
  } catch (error) {
    console.error('Error al obtener espacio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Crear un nuevo espacio
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, floor, building, capacity, description } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y tipo son requeridos'
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Determinar el department_id basado en el rol del usuario
    let department_id;
    if (req.user.role === 'admin' && req.body.department_id) {
      department_id = req.body.department_id;
    } else {
      department_id = req.user.department_id;
    }

    const [result] = await connection.execute(
      `INSERT INTO spaces (name, type, floor, building, capacity, description, department_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [name, type, floor, building, capacity, description, department_id]
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'Espacio creado exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear espacio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar un espacio
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, floor, building, capacity, description, status } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el espacio existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = 'SELECT id, department_id FROM spaces WHERE id = ?';
    let checkParams = [req.params.id];

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
      `UPDATE spaces SET 
       name = ?, type = ?, floor = ?, building = ?, capacity = ?, 
       description = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, type, floor, building, capacity, description, status, req.params.id]
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Espacio actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar espacio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar un espacio
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el espacio existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = 'SELECT id, department_id FROM spaces WHERE id = ?';
    let checkParams = [req.params.id];

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

    // Verificar si el espacio tiene equipos asociados
    const [equipment] = await connection.execute(
      'SELECT COUNT(*) as count FROM equipment WHERE space_id = ?',
      [req.params.id]
    );

    if (equipment[0].count > 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el espacio porque tiene equipos asociados'
      });
    }

    const [result] = await connection.execute(
      'DELETE FROM spaces WHERE id = ?',
      [req.params.id]
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Espacio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar espacio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener equipos de un espacio específico
router.get('/:id/equipment', auth, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar que el espacio existe y pertenece al departamento del usuario (si no es admin)
    let checkQuery = 'SELECT id, department_id FROM spaces WHERE id = ?';
    let checkParams = [req.params.id];

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
      `SELECT e.*, ec.name as category_name, ec.color as category_color
       FROM equipment e
       LEFT JOIN equipment_categories ec ON e.category_id = ec.id
       WHERE e.space_id = ?
       ORDER BY e.name`,
      [req.params.id]
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

module.exports = router;
