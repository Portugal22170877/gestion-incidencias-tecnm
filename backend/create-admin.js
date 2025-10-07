// Script para crear usuario administrador
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'admin123',
      database: 'gestion_incidencias'
    });

    console.log('🔗 Conectado a la base de datos');
    
    // Verificar si ya existe un admin
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR role = ?', 
      ['admin@tecnm.mx', 'admin']
    );
    
    if (existing.length > 0) {
      console.log('⏭️  Ya existe un usuario administrador');
      return;
    }

    // Hash de la contraseña
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario administrador
    const [result] = await connection.execute(`
      INSERT INTO users (name, email, password, password_hash, rfc, role, status, department_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Administrador TECNM',
      'admin@tecnm.mx',
      hashedPassword,
      hashedPassword,
      'ADM000000AAA',
      'administrador',
      'activo',
      1  // Asignar al primer departamento (Tecnologías de la Información)
    ]);

    console.log(`✅ Usuario administrador creado con ID: ${result.insertId}`);
    console.log('📧 Email: admin@tecnm.mx');
    console.log('🔑 Contraseña: admin123');
    console.log('👤 Rol: admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

createAdminUser();