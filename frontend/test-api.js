// Test script para verificar las APIs del dashboard
const testAPIs = async () => {
  const baseURL = 'http://localhost:3001/api'
  
  try {
    console.log('🔍 Probando endpoint de salud...')
    const healthRes = await fetch(`${baseURL}/health`)
    const health = await healthRes.json()
    console.log('✅ Health:', health)
    
    console.log('\n🔍 Probando endpoint de departamentos...')
    const deptsRes = await fetch(`${baseURL}/departments`)
    const departments = await deptsRes.json()
    console.log('✅ Departamentos:', departments)
    console.log(`   Total departamentos: ${Array.isArray(departments) ? departments.length : 'No es array'}`)
    
    console.log('\n🔍 Probando endpoint de usuarios...')
    const usersRes = await fetch(`${baseURL}/users`)
    const users = await usersRes.json()
    console.log('✅ Usuarios:', users)
    console.log(`   Total usuarios: ${Array.isArray(users) ? users.length : 'No es array'}`)
    
    console.log('\n🔍 Probando endpoint de incidentes...')
    const incidentsRes = await fetch(`${baseURL}/incidents`)
    const incidents = await incidentsRes.json()
    console.log('✅ Incidentes:', incidents)
    console.log(`   Total incidentes: ${Array.isArray(incidents) ? incidents.length : 'No es array'}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Ejecutar las pruebas
testAPIs()