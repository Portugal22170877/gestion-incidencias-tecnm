// Script para arreglar la estructura de la tabla departments
const mysql = require('mysql2/promise');

async function fixDepartmentsTable() {
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
    
    // Verificar estructura actual
    console.log('📋 Estructura actual de departments:');
    const [columns] = await connection.execute('DESCRIBE departments');
    columns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default}`);
    });

    // Agregar columnas faltantes si no existen
    const columnsToAdd = [
      { name: 'manager_id', type: 'INT NULL', description: 'ID del jefe de departamento' },
      { name: 'budget', type: 'DECIMAL(15,2) DEFAULT 0.00', description: 'Presupuesto del departamento' },
      { name: 'location', type: 'VARCHAR(255) DEFAULT NULL', description: 'Ubicación física' },
      { name: 'status', type: "VARCHAR(20) DEFAULT 'activo'", description: 'Estado del departamento' },
      { name: 'employee_count', type: 'INT DEFAULT 0', description: 'Número de empleados' },
      { name: 'open_incidents', type: 'INT DEFAULT 0', description: 'Incidencias abiertas' }
    ];

    console.log('\n🔧 Agregando columnas faltantes...');
    
    for (const column of columnsToAdd) {
      try {
        await connection.execute(
          `ALTER TABLE departments ADD COLUMN ${column.name} ${column.type}`
        );
        console.log(`✅ Agregada columna: ${column.name} - ${column.description}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`⏭️  La columna ${column.name} ya existe`);
        } else {
          console.log(`❌ Error agregando ${column.name}:`, err.message);
        }
      }
    }

    // Agregar clave foránea para manager_id si no existe
    try {
      await connection.execute(`
        ALTER TABLE departments 
        ADD CONSTRAINT fk_departments_manager 
        FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✅ Agregada clave foránea para manager_id');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('⏭️  La clave foránea para manager_id ya existe');
      } else {
        console.log('⚠️  No se pudo agregar clave foránea (puede ser normal si no hay usuarios)');
      }
    }

    // Verificar estructura final
    console.log('\n📋 Estructura final de departments:');
    const [finalColumns] = await connection.execute('DESCRIBE departments');
    finalColumns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default}`);
    });

    console.log('\n🎉 ¡Estructura de la tabla departments corregida!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

fixDepartmentsTable();