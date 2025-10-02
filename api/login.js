const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  // Verificar variables de entorno
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL no está configurado');
    return res.status(500).json({ 
      success: false, 
      message: 'Error de configuración del servidor' 
    });
  }

  let pool;
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña requeridos' 
      });
    }

    // Crear conexión a la base de datos
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Intentando login para:', email);

    const result = await pool.query(`
      SELECT id_usuario, nombre_usuario, correo, password_hash, rol, departamento_id, activo
      FROM users 
      WHERE correo = $1 AND activo = 'activo'
    `, [email]);

    console.log('Usuarios encontrados:', result.rows.length);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const user = result.rows[0];
    console.log('Usuario encontrado:', user.correo);

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Actualizar último login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id_usuario = $1', 
      [user.id_usuario]
    );

    // Crear token JWT
    const token = jwt.sign(
      { 
        id: user.id_usuario,
        email: user.correo,
        role: user.rol,
        department_id: user.departamento_id
      },
      process.env.JWT_SECRET || 'tu_clave_secreta_aqui',
      { expiresIn: '24h' }
    );

    console.log('Login exitoso para:', email);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id_usuario,
        name: user.nombre_usuario,
        email: user.correo,
        role: user.rol,
        department_id: user.departamento_id
      }
    });

  } catch (error) {
    console.error('Error detallado en login:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Error cerrando conexión:', closeError);
      }
    }
  }
};