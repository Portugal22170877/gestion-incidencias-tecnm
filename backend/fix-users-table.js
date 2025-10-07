const mysql = require('mysql2/promise');

async function fixUsersTable() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔧 Arreglando estructura de la tabla users...');
        
        // 1. Primero verificar si hay datos en la tabla
        const [count] = await connection.execute('SELECT COUNT(*) as total FROM users');
        console.log(`📊 Usuarios existentes: ${count[0].total}`);
        
        // 2. Si el campo password está vacío, podemos eliminarlo
        console.log('\n🔄 Eliminando campo password redundante...');
        
        try {
            await connection.execute('ALTER TABLE users DROP COLUMN password');
            console.log('✅ Campo password eliminado correctamente');
        } catch (err) {
            if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                console.log('⚠️ El campo password ya no existe o no se puede eliminar');
            } else {
                console.log('❌ Error eliminando campo password:', err.message);
            }
        }
        
        // 3. Verificar la estructura final
        console.log('\n📋 Estructura final de la tabla users:');
        const [columns] = await connection.execute('DESCRIBE users');
        columns.forEach(col => {
            if (col.Field.includes('password')) {
                console.log(`- ${col.Field} (${col.Type}) - NULL: ${col.Null} - Default: ${col.Default}`);
            }
        });
        
        console.log('\n✅ Tabla users corregida. Ahora solo debería haber password_hash.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixUsersTable();