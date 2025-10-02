const { Client } = require('pg');
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

  let client;

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña requeridos' 
      });
    }

    // Conectar a la base de datos
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    // Buscar usuario en la base de datos
    const query = `
      SELECT u.id_usuario, u.nombre_usuario, u.correo, u.contrasena_hash, u.rol, u.id_departamento,
             d.nombre_departamento
      FROM usuarios u
      LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
      WHERE u.correo = $1
    `;
    
    const result = await client.query(query, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.contrasena_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user.id_usuario,
        email: user.correo,
        role: user.rol,
        department_id: user.id_departamento
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    return res.json({
      success: true,
      token,
      user: {
        id: user.id_usuario,
        name: user.nombre_usuario,
        email: user.correo,
        role: user.rol,
        department_id: user.id_departamento,
        department_name: user.nombre_departamento
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      details: error.message,
      env_check: {
        has_db_url: !!process.env.DATABASE_URL,
        has_jwt_secret: !!process.env.JWT_SECRET,
        node_env: process.env.NODE_ENV
      }
    });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error cerrando conexión:', error);
      }
    }
  }
};