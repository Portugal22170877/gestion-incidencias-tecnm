// Script para crear departamentos básicos
const departamentos = [
  {
    name: 'Tecnologías de la Información',
    description: 'Departamento encargado de la infraestructura tecnológica y sistemas informáticos'
  },
  {
    name: 'Académico',
    description: 'Departamento académico y de coordinación educativa'
  },
  {
    name: 'Administración',
    description: 'Departamento de administración y recursos financieros'
  },
  {
    name: 'Recursos Humanos',
    description: 'Departamento de gestión de personal y recursos humanos'
  },
  {
    name: 'Mantenimiento',
    description: 'Departamento de mantenimiento y servicios generales'
  },
  {
    name: 'Servicios Escolares',
    description: 'Departamento de servicios escolares y control académico'
  }
];

async function crearDepartamentos() {
  console.log('🔧 Creando departamentos básicos...');
  
  for (let i = 0; i < departamentos.length; i++) {
    const dept = departamentos[i];
    
    try {
      const response = await fetch('http://localhost:3001/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAuthToken()
        },
        body: JSON.stringify(dept)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Creado: ${dept.name} (ID: ${result.id})`);
      } else {
        const error = await response.text();
        console.log(`❌ Error al crear ${dept.name}: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error de conexión para ${dept.name}: ${error.message}`);
    }
  }
  
  console.log('✅ Proceso completado');
}

function getAuthToken() {
  // Token básico para administrador
  return localStorage.getItem('auth_token') || '';
}

// Ejecutar cuando se cargue la página
if (typeof window !== 'undefined') {
  window.crearDepartamentos = crearDepartamentos;
  console.log('💡 Para crear departamentos, ejecuta: crearDepartamentos()');
} else {
  // Si está en Node.js
  crearDepartamentos();
}