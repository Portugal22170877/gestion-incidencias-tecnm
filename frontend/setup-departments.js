// Script para crear departamentos básicos usando Node.js
const mysql = require('mysql2/promise');

const departments = [
  {
    name: 'Tecnologías de la Información',
    description: 'Departamento encargado de la infraestructura tecnológica y sistemas informáticos'
  },
  {
    name: 'Académico',
    description: 'Departamento académico y de coordinación educativa'
  },
  {
    name: 'Administración',
    description: 'Departamento de administración y recursos financieros'
  },
  {
    name: 'Recursos Humanos',
    description: 'Departamento de gestión de personal y recursos humanos'
  },
  {
    name: 'Mantenimiento',
    description: 'Departamento de mantenimiento y servicios generales'
  },
  {
    name: 'Servicios Escolares',
    description: 'Departamento de servicios escolares y control académico'
  }
];

async function createDepartments() {
  let connection;
  
  try {
    // Configuración de conexión (ajusta según tu configuración)
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Cambia por tu password de MySQL
      database: 'gestion_incidencias'
    });

    console.log('🔗 Conectado a la base de datos');
    
    // Crear departamentos
    let created = 0;
    let skipped = 0;
    
    for (const dept of departments) {
      try {
        const [result] = await connection.execute(
          'INSERT INTO departments (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
          [dept.name, dept.description]
        );
        
        console.log(`✅ Creado: ${dept.name} (ID: ${result.insertId})`);
        created++;
        
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⏭️  Ya existe: ${dept.name}`);
          skipped++;
        } else {
          console.log(`❌ Error creando ${dept.name}:`, err.message);
        }
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Departamentos creados: ${created}`);
    console.log(`⏭️  Departamentos existentes: ${skipped}`);
    console.log(`📂 Total disponibles: ${created + skipped}`);
    
    // Verificar que existen
    const [rows] = await connection.execute('SELECT id, name FROM departments ORDER BY id');
    console.log('\n📋 DEPARTAMENTOS EN BASE DE DATOS:');
    rows.forEach(row => {
      console.log(`   ${row.id}. ${row.name}`);
    });
    
    console.log('\n🎉 ¡Proceso completado! Ahora puedes crear usuarios sin problemas.');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verificar que MySQL esté ejecutándose');
    console.log('2. Verificar credenciales en este script');
    console.log('3. Verificar que existe la base de datos "gestion_incidencias"');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
createDepartments();