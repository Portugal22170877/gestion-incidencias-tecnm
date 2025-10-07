const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'gestion_incidencias'
};

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('🔍 Debug - Authorization header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('🔍 Debug - Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // TEMPORAL: Tokens de prueba para desarrollo
    if (token === 'test-token-desarrollo' || token.startsWith('mock-jwt-token')) {
      console.log('✅ Using test token for development');
      req.user = {
        id: 6,
        email: 'admin@tecnm.mx',
        name: 'Administrador TECNM',
        role: 'administrador',
        department_id: 1
      };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_super_secreta_para_jwt_2024');
    console.log('✅ Token decoded successfully:', decoded);
    
    // Verificar que el usuario existe en la base de datos
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute(
      'SELECT id, email, name, role, department_id FROM users WHERE id = ? AND status = "activo"',
      [decoded.userId]
    );
    await connection.end();

    if (users.length === 0) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.log('✅ User authenticated:', users[0]);
    req.user = users[0];
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error.name, error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = auth;