// Script para verificar los departamentos en la base de datos
const mysql = require('mysql2/promise');

async function checkDepartments() {
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
    
    // Verificar departamentos existentes
    const [departments] = await connection.execute('SELECT * FROM departments ORDER BY id');
    
    console.log(`\n📊 Total de departamentos: ${departments.length}`);
    console.log('\n📋 Departamentos en la base de datos:');
    
    if (departments.length === 0) {
      console.log('   ❌ No hay departamentos en la base de datos');
    } else {
      departments.forEach(dept => {
        console.log(`   ${dept.id}. ${dept.name} (${dept.status || 'sin status'})`);
        console.log(`      Descripción: ${dept.description || 'Sin descripción'}`);
        console.log(`      Manager ID: ${dept.manager_id || 'Sin manager'}`);
        console.log('');
      });
    }

    // Verificar también usuarios
    const [users] = await connection.execute('SELECT id, name, role FROM users ORDER BY id');
    console.log(`\n👥 Total de usuarios: ${users.length}`);
    console.log('\n📋 Usuarios en la base de datos:');
    users.forEach(user => {
      console.log(`   ${user.id}. ${user.name} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

checkDepartments();