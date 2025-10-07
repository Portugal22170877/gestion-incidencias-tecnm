const mysql = require('mysql2/promise');

async function checkIncidentsTable() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔍 Verificando estructura de la tabla incidents...');
        
        // Describir la tabla incidents
        const [columns] = await connection.execute('DESCRIBE incidents');
        
        console.log('\n📋 Columnas de la tabla incidents:');
        columns.forEach(col => {
            console.log(`- ${col.Field} (${col.Type}) - ${col.Null} - Default: ${col.Default}`);
        });
        
        // También ver si hay incidencias
        const [incidents] = await connection.execute('SELECT COUNT(*) as count FROM incidents');
        console.log(`\n📊 Total de incidencias: ${incidents[0].count}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkIncidentsTable();