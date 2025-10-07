const express = require('express');
const router = express.Router();

const { 
  login, 
  getProfile, 
  updateProfile, 
  verifyToken 
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');

// POST /api/auth/login - Iniciar sesión
router.post('/login', validate(userSchemas.login), login);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, getProfile);

// PUT /api/auth/profile - Actualizar perfil del usuario autenticado
router.put('/profile', 
  authenticateToken, 
  validate(userSchemas.update), 
  updateProfile
);

// GET /api/auth/verify - Verificar token válido
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;