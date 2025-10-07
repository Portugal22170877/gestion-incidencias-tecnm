// Script para verificar y arreglar la tabla users
const mysql = require('mysql2/promise');

async function checkUsersTable() {
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
    
    // Verificar estructura de users
    console.log('📋 Estructura actual de users:');
    const [columns] = await connection.execute('DESCRIBE users');
    columns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default}`);
    });

    // Agregar columna password si no existe
    const hasPasswordColumn = columns.some(col => col.Field === 'password');
    if (!hasPasswordColumn) {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL AFTER email
      `);
      console.log('✅ Agregada columna password');
    }

    // Agregar columna role si no existe
    const hasRoleColumn = columns.some(col => col.Field === 'role');
    if (!hasRoleColumn) {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password
      `);
      console.log('✅ Agregada columna role');
    }

    // Agregar columna status si no existe
    const hasStatusColumn = columns.some(col => col.Field === 'status');
    if (!hasStatusColumn) {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN status ENUM('activo', 'inactivo') DEFAULT 'activo' AFTER role
      `);
      console.log('✅ Agregada columna status');
    }

    console.log('\n📋 Estructura final de users:');
    const [finalColumns] = await connection.execute('DESCRIBE users');
    finalColumns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

checkUsersTable();