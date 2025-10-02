// Endpoint de login para Vercel Functions
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Configuración de base de datos
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' })
  }

  try {
    const { email, password } = req.body
    console.log('Intento de login:', email)

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' })
    }

    const pool = new Pool(dbConfig)
    
    const result = await pool.query(`
      SELECT id_usuario, nombre_usuario, correo, password_hash, rol, departamento_id, activo
      FROM users 
      WHERE correo = $1 AND activo = 'activo'
    `, [email])

    if (result.rows.length === 0) {
      await pool.end()
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' })
    }

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      await pool.end()
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' })
    }

    // Actualizar último login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id_usuario = $1', [user.id_usuario])
    await pool.end()

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
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.id_usuario,
        name: user.nombre_usuario,
        email: user.correo,
        role: user.rol,
        department_id: user.departamento_id
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}