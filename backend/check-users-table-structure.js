const mysql = require('mysql2/promise');

async function checkUsersTableStructure() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔍 Verificando estructura de la tabla users...');
        
        // Describir la tabla users
        const [columns] = await connection.execute('DESCRIBE users');
        
        console.log('\n📋 Estructura de la tabla users:');
        columns.forEach(col => {
            console.log(`- ${col.Field} (${col.Type}) - NULL: ${col.Null} - Default: ${col.Default} - Key: ${col.Key}`);
        });
        
        // Ver la consulta CREATE TABLE
        const [createTable] = await connection.execute('SHOW CREATE TABLE users');
        console.log('\n🏗️ SQL de creación de la tabla:');
        console.log(createTable[0]['Create Table']);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkUsersTableStructure();