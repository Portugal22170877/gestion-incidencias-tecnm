// API principal para Vercel Functions
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Configuración CORS para producción
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-app.vercel.app'] // Cambia por tu dominio real
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))

app.use(express.json())

// Configuración de base de datos PostgreSQL (Supabase)
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

let pool

// Función para inicializar la conexión
const initDB = () => {
  if (!pool) {
    pool = new Pool(dbConfig)
  }
  return pool
}

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido' })
    }
    req.user = user
    next()
  })
}

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const db = initDB()

    // Buscar usuario
    const result = await db.query(
      'SELECT * FROM users WHERE correo = $1 AND activo = $2',
      [email, 'activo']
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado o inactivo' 
      })
    }

    const user = result.rows[0]

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta' 
      })
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        email: user.correo, 
        role: user.rol 
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
})

// Rutas de usuarios
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const db = initDB()
    
    const result = await db.query(`
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.rol,
        u.departamento_id,
        u.rfc,
        u.telefono,
        u.activo,
        d.nombre as nombre_departamento
      FROM users u
      LEFT JOIN departments d ON u.departamento_id = d.id
      ORDER BY u.nombre_usuario
    `)

    res.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' })
  }
})

app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { name, email, rfc, role, department_id, password, phone, status } = req.body
    const db = initDB()

    // Verificar que el usuario autenticado es admin
    if (req.user.role !== 'administrador') {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    // Encriptar contraseña
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insertar usuario
    const result = await db.query(`
      INSERT INTO users (nombre_usuario, correo, rfc, rol, departamento_id, password_hash, telefono, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id_usuario
    `, [name, email, rfc, role, department_id, hashedPassword, phone, status])

    res.json({ 
      success: true, 
      message: 'Usuario creado exitosamente',
      user_id: result.rows[0].id_usuario 
    })
  } catch (error) {
    console.error('Error creando usuario:', error)
    res.status(500).json({ success: false, message: 'Error al crear usuario' })
  }
})

app.put('/api/users/:id/reset-password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { new_password } = req.body
    const db = initDB()

    // Verificar que el usuario autenticado es admin
    if (req.user.role !== 'administrador') {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    // Encriptar nueva contraseña
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(new_password, saltRounds)

    // Actualizar contraseña
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id_usuario = $2',
      [hashedPassword, id]
    )

    res.json({ success: true, message: 'Contraseña reseteada exitosamente' })
  } catch (error) {
    console.error('Error reseteando contraseña:', error)
    res.status(500).json({ success: false, message: 'Error al resetear contraseña' })
  }
})

// Rutas de departamentos
app.get('/api/departments', authenticateToken, async (req, res) => {
  try {
    const db = initDB()
    
    const result = await db.query(`
      SELECT id, nombre as name, descripcion as description, activo as status
      FROM departments
      ORDER BY nombre
    `)

    res.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error obteniendo departamentos:', error)
    res.status(500).json({ success: false, message: 'Error al obtener departamentos' })
  }
})

// Manejo de errores 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint no encontrado' })
})

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
  })
}

// Exportar para Vercel
module.exports = app