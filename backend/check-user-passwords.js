const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function checkUserPasswords() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔍 Verificando usuarios y contraseñas...');
        
        // Obtener todos los usuarios
        const [users] = await connection.execute(
            'SELECT id, name, email, password, role, department_id FROM users ORDER BY id'
        );
        
        console.log('\n📋 Usuarios en la base de datos:');
        users.forEach(user => {
            console.log(`ID: ${user.id} - ${user.name} (${user.email})`);
            console.log(`  Rol: ${user.role}`);
            console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
            console.log(`  Departamento: ${user.department_id}`);
            console.log('');
        });
        
        // Verificar si las contraseñas están hasheadas correctamente
        console.log('🔐 Verificando formato de contraseñas...');
        
        for (const user of users) {
            const isBcrypt = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
            console.log(`${user.email}: ${isBcrypt ? '✅ Hash bcrypt' : '❌ Texto plano o formato incorrecto'}`);
            
            // Si no es bcrypt, crear hash para contraseña por defecto
            if (!isBcrypt) {
                let defaultPassword;
                if (user.email === 'admin@tecnm.mx') {
                    defaultPassword = 'admin123';
                } else if (user.email.includes('bea')) {
                    defaultPassword = 'bea123';
                } else {
                    defaultPassword = '123456';
                }
                
                const hashedPassword = await bcrypt.hash(defaultPassword, 10);
                
                await connection.execute(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedPassword, user.id]
                );
                
                console.log(`  ✅ Hash creado para ${user.email} con contraseña: ${defaultPassword}`);
            }
        }
        
        console.log('\n✅ Verificación completada!');
        
        // Mostrar credenciales finales
        console.log('\n🔑 CREDENCIALES DE ACCESO:');
        console.log('Admin: admin@tecnm.mx / admin123');
        console.log('Beatriz: bea.gamez@tecnm.mx / bea123');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkUserPasswords();