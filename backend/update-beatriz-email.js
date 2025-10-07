const mysql = require('mysql2/promise');

async function updateBeatrizEmail() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔄 Actualizando email de Beatriz a dominio institucional...');
        
        // Actualizar el email de Beatriz
        await connection.execute(
            'UPDATE users SET email = ? WHERE id = ?',
            ['bea.gamez@tecnm.mx', 5]
        );
        
        console.log('✅ Email actualizado exitosamente!');
        
        // Verificar el resultado
        const [users] = await connection.execute(
            'SELECT id, name, email, role, department_id FROM users ORDER BY id'
        );
        
        console.log('\n📋 Usuarios finales con emails institucionales:');
        users.forEach(user => {
            console.log(`ID: ${user.id} - ${user.name} (${user.email}) - Rol: ${user.role} - Dept: ${user.department_id}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

updateBeatrizEmail();