const mysql = require('mysql2/promise');

async function cleanFictitiousUsers() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔍 Verificando usuarios en la base de datos...');
        
        // Consultar todos los usuarios
        const [users] = await connection.execute(
            'SELECT id, name, email, role, department_id FROM users ORDER BY id'
        );
        
        console.log('\n📋 Usuarios actuales:');
        users.forEach(user => {
            console.log(`ID: ${user.id} - ${user.name} (${user.email}) - Rol: ${user.role} - Dept: ${user.department_id}`);
        });
        
        // Usuarios reales que queremos mantener
        const realUsers = ['admin@tecnm.mx', 'bea@tecnm.mx', 'bea.gamez@empresa.com'];
        
        // Encontrar usuarios ficticios (que no están en la lista de reales)
        const fictitiousUsers = users.filter(user => !realUsers.includes(user.email.toLowerCase()));
        
        if (fictitiousUsers.length === 0) {
            console.log('\n✅ No se encontraron usuarios ficticios para eliminar.');
            return;
        }
        
        console.log('\n🗑️ Usuarios ficticios encontrados (serán eliminados):');
        fictitiousUsers.forEach(user => {
            console.log(`  ❌ ID ${user.id} - ${user.name} (${user.email})`);
        });
        
        console.log('\n✅ Usuarios reales (se mantendrán):');
        const realUsersInDb = users.filter(user => realUsers.includes(user.email.toLowerCase()));
        realUsersInDb.forEach(user => {
            console.log(`  ✅ ID ${user.id} - ${user.name} (${user.email})`);
        });
        
        // Eliminar usuarios ficticios
        console.log('\n🔄 Eliminando usuarios ficticios...');
        
        for (const user of fictitiousUsers) {
            // Primero verificar si el usuario tiene incidencias asignadas
            const [incidents] = await connection.execute(
                'SELECT COUNT(*) as count FROM incidents WHERE assignee_id = ?',
                [user.id]
            );
            
            if (incidents[0].count > 0) {
                console.log(`  ⚠️ Usuario ${user.name} tiene ${incidents[0].count} incidencias asignadas - actualizando a NULL`);
                await connection.execute(
                    'UPDATE incidents SET assignee_id = NULL WHERE assignee_id = ?',
                    [user.id]
                );
            }
            
            // Ahora eliminar el usuario
            await connection.execute('DELETE FROM users WHERE id = ?', [user.id]);
            console.log(`  ❌ Eliminado usuario: ${user.name} (${user.email})`);
        }
        
        console.log('\n🎉 Usuarios ficticios eliminados exitosamente!');
        
        // Mostrar resultado final
        const [finalUsers] = await connection.execute(
            'SELECT id, name, email, role, department_id FROM users ORDER BY id'
        );
        
        console.log('\n📋 Usuarios finales:');
        finalUsers.forEach(user => {
            console.log(`ID: ${user.id} - ${user.name} (${user.email}) - Rol: ${user.role} - Dept: ${user.department_id}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

cleanFictitiousUsers();