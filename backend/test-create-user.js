// Probar el endpoint POST /api/users directamente para ver qué pasa
async function testCreateUser() {
    console.log('🧪 Probando creación de usuario...');
    
    const userData = {
        name: "Test User",
        email: "test@tecnm.mx",
        rfc: "TEST123456789",
        role: "tecnico",
        department_id: 1,
        phone: "1234567890",
        status: "activo",
        password: "test123456"
    };
    
    console.log('📤 Datos a enviar:', JSON.stringify(userData, null, 2));
    
    try {
        const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mock-token' // Usar token mock para prueba
            },
            body: JSON.stringify(userData)
        });
        
        console.log('📥 Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Usuario creado exitosamente!');
            console.log('📄 Respuesta:', JSON.stringify(result, null, 2));
        } else {
            const errorText = await response.text();
            console.log('❌ Error del servidor:');
            console.log('📄 Respuesta error:', errorText);
        }
        
    } catch (error) {
        console.error('💥 Error de conexión:', error.message);
    }
}

testCreateUser();