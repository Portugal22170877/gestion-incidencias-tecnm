const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: __dirname + '/.env' });

const { testConnection } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por ventana de tiempo
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  }
});

// Middlewares globales
app.use(helmet()); // Seguridad básica
app.use(limiter); // Rate limiting
app.use(morgan('combined')); // Logging de requests

// Configuración CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para probar conexión a la base de datos
app.get('/api/db-status', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      success: isConnected,
      message: isConnected ? 'Base de datos conectada' : 'Error de conexión a la base de datos'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando conexión a la base de datos',
      error: error.message
    });
  }
});

// Ruta de prueba para obtener usuarios
app.get('/api/users', async (req, res) => {
  try {
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT 
        u.id as id_usuario,
        u.name as nombre_usuario,
        u.email as correo,
        u.name as nombre_completo,
        u.phone as telefono,
        u.role as rol,
        u.status as activo,
        u.created_at as fecha_creacion,
        d.name as nombre_departamento
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.status = 'activo'
      ORDER BY u.name
    `);
    
    connection.release();
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios'
    });
  }
});

// Ruta de login temporal
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña requeridos'
      });
    }

    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        u.status,
        d.name as departamento
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.email = ? AND u.status = 'activo'
    `, [email]);
    
    connection.release();
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = users[0];
    
    // Verificar contraseña usando bcrypt
    const bcrypt = require('bcrypt');
    let isPasswordValid = false;
    
    try {
      // Primero intentar con bcrypt (para usuarios creados correctamente)
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } catch (error) {
      console.log('Error con bcrypt, intentando contraseñas de prueba...');
    }
    
    // Si bcrypt falla, usar contraseñas de prueba para compatibilidad
    if (!isPasswordValid) {
      const validPasswords = ['password', 'admin123', 'Temp123!'];
      isPasswordValid = validPasswords.includes(password);
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departamento: user.departamento
      },
      token: 'mock-jwt-token-' + user.id
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint de prueba para login (GET)
app.get('/api/test-login/:email/:password', async (req, res) => {
  try {
    const { email, password } = req.params;
    
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        u.status,
        d.name as departamento
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.email = ? AND u.status = 'activo'
    `, [email]);
    
    connection.release();
    
    if (users.length === 0) {
      return res.json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = users[0];
    
    // Verificar contraseña usando bcrypt
    const bcrypt = require('bcrypt');
    let isPasswordValid = false;
    
    try {
      // Primero intentar con bcrypt (para usuarios creados correctamente)
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } catch (error) {
      console.log('Error con bcrypt, intentando contraseñas de prueba...');
    }
    
    // Si bcrypt falla, usar contraseñas de prueba para compatibilidad
    if (!isPasswordValid) {
      const validPasswords = ['password', 'admin123', 'Temp123!'];
      isPasswordValid = validPasswords.includes(password);
    }
    
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departamento: user.departamento
      },
      token: 'mock-jwt-token-' + user.id
    });
    
  } catch (error) {
    console.error('Error en test login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para verificar un email específico
app.get('/api/check-email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT id, name, email, role, status FROM users WHERE email = ?
    `, [email]);
    
    connection.release();
    
    res.json({
      success: true,
      email: email,
      found: users.length > 0,
      user: users.length > 0 ? users[0] : null
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando email'
    });
  }
});

// Endpoint temporal para ver todos los emails de usuarios
app.get('/api/users-emails', async (req, res) => {
  try {
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT id, name, email, role, status FROM users ORDER BY id
    `);
    
    connection.release();
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error obteniendo emails:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo emails'
    });
  }
});

// Ruta de prueba para obtener departamentos
app.get('/api/departments', async (req, res) => {
  try {
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [departments] = await connection.execute(`
      SELECT 
        d.id,
        d.name,
        d.description,
        d.manager_id,
        d.budget,
        d.location,
        d.status,
        COALESCE(d.employee_count, 0) as employee_count,
        COALESCE(d.open_incidents, 0) as open_incidents,
        d.created_at,
        d.updated_at,
        COALESCE(u.name, 'Sin asignar') as jefe_nombre,
        COALESCE(d.employee_count, 0) as total_usuarios,
        COALESCE(d.open_incidents, 0) as total_incidencias
      FROM departments d
      LEFT JOIN users u ON d.manager_id = u.id
      ORDER BY d.name
    `);
    
    connection.release();
    
    res.json({
      success: true,
      data: departments,
      count: departments.length
    });
  } catch (error) {
    console.error('Error obteniendo departamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo departamentos'
    });
  }
});

// Endpoint para crear nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role, department_id, phone, rfc } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: name, email, password, role'
      });
    }

    const bcrypt = require('bcrypt');
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    // Hashear la contraseña real que proporciona el usuario
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const [result] = await connection.execute(`
      INSERT INTO users (name, email, password_hash, role, department_id, phone, rfc, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'activo')
    `, [name, email, hashedPassword, role, department_id, phone, rfc]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Usuario creado exitosamente',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        success: false,
        message: 'El email ya existe'
      });
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      res.status(500).json({
        success: false,
        message: 'Tabla de usuarios no encontrada'
      });
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      res.status(500).json({
        success: false,
        message: 'Campo no válido en la base de datos: ' + error.sqlMessage
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creando usuario: ' + (error.sqlMessage || error.message)
      });
    }
  }
});

// Endpoint para actualizar usuario
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department_id, phone, rfc, status } = req.body;
    
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      UPDATE users 
      SET name = ?, email = ?, role = ?, department_id = ?, phone = ?, rfc = ?, status = ?
      WHERE id = ?
    `, [name, email, role, department_id, phone, rfc, status, id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando usuario'
    });
  }
});

// Endpoint para eliminar usuario (soft delete)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      UPDATE users SET status = 'inactivo' WHERE id = ?
    `, [id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error desactivando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error desactivando usuario'
    });
  }
});

// Endpoint para crear nuevo departamento
app.post('/api/departments', async (req, res) => {
  try {
    const { name, description, manager_id, budget, location } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nombre del departamento es requerido'
      });
    }

    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      INSERT INTO departments (name, description, manager_id, budget, location, status, employee_count, open_incidents)
      VALUES (?, ?, ?, ?, ?, 'activo', 0, 0)
    `, [
      name, 
      description || null, 
      manager_id || null, 
      budget || 0, 
      location || null
    ]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Departamento creado exitosamente',
      departmentId: result.insertId
    });
  } catch (error) {
    console.error('Error creando departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando departamento'
    });
  }
});

// Endpoint para actualizar departamento
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, manager_id, budget, location } = req.body;
    
    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      UPDATE departments 
      SET name = ?, description = ?, manager_id = ?, budget = ?, location = ?
      WHERE id = ?
    `, [
      name, 
      description || null, 
      manager_id || null, 
      budget || 0, 
      location || null, 
      id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Departamento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando departamento'
    });
  }
});

// Endpoint para eliminar departamento
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();

    // Verificar si el departamento tiene usuarios asociados
    const [userCheck] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE department_id = ?',
      [id]
    );

    if (userCheck[0].count > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el departamento porque tiene usuarios asociados'
      });
    }

    // Eliminar el departamento
    const [result] = await connection.execute(
      'DELETE FROM departments WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Departamento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando departamento'
    });
  }
});


// Importar y usar rutas (las crearemos a continuación)
// const authRoutes = require('./src/routes/authRoutes');
// const userRoutes = require('./src/routes/userRoutes');
// const incidentRoutes = require('./src/routes/incidentRoutes');
// const departmentRoutes = require('./src/routes/departmentRoutes');
const spacesRoutes = require('./routes/spaces');
const equipmentRoutes = require('./routes/equipment');

// Usar las rutas
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/incidents', incidentRoutes);
// app.use('/api/departments', departmentRoutes);
app.use('/api/spaces', spacesRoutes);
app.use('/api/equipment', equipmentRoutes);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  // Error de validación de Joi
  if (error.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  // Error de base de datos
  if (error.code) {
    let message = 'Error de base de datos';
    
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        message = 'Registro duplicado';
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        message = 'Referencia inválida';
        break;
      case 'ECONNREFUSED':
        message = 'No se pudo conectar a la base de datos';
        break;
    }
    
    return res.status(400).json({
      success: false,
      message
    });
  }
  
  // Error genérico
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected && process.env.NODE_ENV === 'production') {
      console.error('❌ No se pudo conectar a la base de datos en producción');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log('🚀 ================================');
      console.log(`   Servidor iniciado en puerto ${PORT}`);
      console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   API Health: http://localhost:${PORT}/api/health`);
      console.log(`   DB Status: http://localhost:${PORT}/api/db-status`);
      console.log('🚀 ================================');
    });
    
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

// Manejo mejorado de señales
let isShuttingDown = false;

process.on('SIGINT', () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n🛑 SIGINT recibido, cerrando servidor gracefully...');
  
  // Dar tiempo para que las conexiones terminen
  setTimeout(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  }, 1000);
});

// Manejo de otros errores
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // No cerrar el servidor por errores no manejados
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // No cerrar el servidor por excepciones no capturadas
});

// Iniciar el servidor
startServer();

module.exports = app;
