// Endpoint de departamentos para Vercel Functions
const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

// Configuración de base de datos
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}

// Middleware de autenticación
const authenticateToken = (req) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('Token requerido')
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui')
    return user
  } catch (err) {
    throw new Error('Token inválido')
  }
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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' })
  }

  try {
    // Verificar autenticación
    const user = authenticateToken(req)
    
    const pool = new Pool(dbConfig)
    
    const result = await pool.query(`
      SELECT id, nombre as name, descripcion as description, activo as status
      FROM departments
      ORDER BY nombre
    `)

    await pool.end()
    res.json({ success: true, data: result.rows })
    
  } catch (error) {
    console.error('Error obteniendo departamentos:', error)
    if (error.message === 'Token requerido' || error.message === 'Token inválido') {
      res.status(401).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Error al obtener departamentos' })
    }
  }
}