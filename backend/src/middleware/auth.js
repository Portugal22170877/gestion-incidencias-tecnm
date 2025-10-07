const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Middleware para verificar JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const user = await executeQuery(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?',
      [decoded.userId]
    );

    if (user.length === 0 || !user[0].activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
    }

    // Agregar información del usuario al request
    req.user = user[0];
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Si roles es string, convertir a array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes para esta acción'
      });
    }

    next();
  };
};

// Middleware para verificar si es administrador
const requireAdmin = requireRole('administrador');

// Middleware para verificar si es jefe de departamento o admin
const requireManager = requireRole(['administrador', 'jefe_departamento']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireManager
};