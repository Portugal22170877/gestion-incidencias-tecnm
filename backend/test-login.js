// Test del endpoint de login
async function testLogin() {
    console.log('🧪 Probando endpoint de login...');
    
    try {
        // Probar con las credenciales del admin
        const loginData = {
            email: 'admin@tecnm.mx',
            password: 'admin123'
        };
        
        console.log('📤 Enviando petición POST a http://localhost:3001/api/login');
        console.log('📤 Datos:', loginData);
        
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        console.log('📥 Respuesta HTTP:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Login exitoso!');
            console.log('📄 Respuesta:', JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.log('❌ Error en login:');
            console.log('📄 Respuesta error:', errorText);
        }
        
    } catch (error) {
        console.error('💥 Error de conexión:', error.message);
    }
    
    // También probar con Beatriz
    console.log('\n🧪 Probando con Beatriz...');
    
    try {
        const loginData2 = {
            email: 'bea.gamez@tecnm.mx',
            password: 'bea123'
        };
        
        console.log('📤 Enviando petición POST a http://localhost:3001/api/login');
        console.log('📤 Datos:', loginData2);
        
        const response2 = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData2)
        });
        
        console.log('📥 Respuesta HTTP:', response2.status, response2.statusText);
        
        if (response2.ok) {
            const data2 = await response2.json();
            console.log('✅ Login de Beatriz exitoso!');
            console.log('📄 Respuesta:', JSON.stringify(data2, null, 2));
        } else {
            const errorText2 = await response2.text();
            console.log('❌ Error en login de Beatriz:');
            console.log('📄 Respuesta error:', errorText2);
        }
        
    } catch (error) {
        console.error('💥 Error de conexión:', error.message);
    }
}

testLogin();