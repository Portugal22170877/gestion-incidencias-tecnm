const mysql = require('mysql2/promise');

async function removeDuplicateDepartments() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'gestion_incidencias'
    });

    try {
        console.log('🔍 Buscando departamentos duplicados...');
        
        // Consultar todos los departamentos para ver duplicados
        const [departments] = await connection.execute(
            'SELECT id, name, description FROM departments ORDER BY name, id'
        );
        
        console.log('\n📋 Departamentos actuales:');
        departments.forEach(dept => {
            console.log(`ID: ${dept.id} - ${dept.name}`);
        });
        
        // Encontrar duplicados por nombre
        const [duplicates] = await connection.execute(`
            SELECT MIN(name) as name, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
            FROM departments 
            GROUP BY LOWER(name) 
            HAVING COUNT(*) > 1
        `);
        
        if (duplicates.length === 0) {
            console.log('\n✅ No se encontraron departamentos duplicados.');
            return;
        }
        
        console.log('\n🔄 Departamentos duplicados encontrados:');
        duplicates.forEach(dup => {
            console.log(`${dup.name}: ${dup.count} copias (IDs: ${dup.ids})`);
        });
        
        // Para cada grupo de duplicados, mantener el primero (menor ID) y eliminar los demás
        for (const duplicate of duplicates) {
            const ids = duplicate.ids.split(',').map(id => parseInt(id));
            const keepId = Math.min(...ids); // Mantener el ID más pequeño
            const deleteIds = ids.filter(id => id !== keepId);
            
            console.log(`\n📝 Procesando "${duplicate.name}":`);
            console.log(`  ✅ Mantener ID: ${keepId}`);
            console.log(`  🗑️ Eliminar IDs: ${deleteIds.join(', ')}`);
            
            // Eliminar los duplicados
            for (const deleteId of deleteIds) {
                await connection.execute('DELETE FROM departments WHERE id = ?', [deleteId]);
                console.log(`  ❌ Eliminado departamento ID ${deleteId}`);
            }
        }
        
        console.log('\n🎉 Duplicados eliminados exitosamente!');
        
        // Mostrar resultado final
        const [finalDepartments] = await connection.execute(
            'SELECT id, name, description FROM departments ORDER BY name'
        );
        
        console.log('\n📋 Departamentos finales (sin duplicados):');
        finalDepartments.forEach(dept => {
            console.log(`ID: ${dept.id} - ${dept.name}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

removeDuplicateDepartments();