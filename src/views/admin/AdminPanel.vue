<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navegación -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <img 
              src="/images/tecnm-culiacan-logo.svg" 
              alt="TECNM Culiacán"
              class="h-8 w-auto"
            />
            <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800 flex items-center">
              ← Volver al Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Gestión de Usuarios -->
          <div class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-4">
              <div class="bg-blue-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 class="ml-4 text-lg font-medium text-gray-900">Usuarios</h3>
            </div>
            <p class="text-gray-600 mb-4">Gestionar usuarios del sistema</p>
            <router-link to="/admin/users" class="btn-primary">
              Gestionar Usuarios
            </router-link>
          </div>

          <!-- Gestión de Departamentos -->
          <div class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-4">
              <div class="bg-green-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 class="ml-4 text-lg font-medium text-gray-900">Departamentos</h3>
            </div>
            <p class="text-gray-600 mb-4">Gestionar departamentos</p>
            <router-link to="/admin/departments" class="btn-primary">
              Gestionar Departamentos
            </router-link>
          </div>

          <!-- Configuración del Sistema -->
          <div class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 class="ml-4 text-lg font-medium text-gray-900">Configuración</h3>
            </div>
            <p class="text-gray-600 mb-4">Configurar parámetros del sistema</p>
            <router-link to="/admin/configuration" class="btn-primary">
              Configurar Sistema
            </router-link>
          </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Estadísticas del Sistema</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ stats.activeUsers }}</div>
              <div class="text-sm text-blue-800">Usuarios Activos</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ stats.totalDepartments }}</div>
              <div class="text-sm text-green-800">Departamentos</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ stats.openIncidents }}</div>
              <div class="text-sm text-yellow-800">Incidencias Abiertas</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ stats.resolvedIncidents }}</div>
              <div class="text-sm text-purple-800">Incidencias Resueltas</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Institucional -->
      <footer class="mt-8 py-6 border-t border-gray-200 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center text-sm text-gray-500">
            <p class="font-medium">Sistema de Gestión de Incidencias</p>
            <p>Instituto Tecnológico de Culiacán</p>
            <p>Versión 1.0.0 - 2025 | Administración de Servicios de TI</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

// Estados reactivos
const stats = ref({
  activeUsers: 0,
  totalDepartments: 0,
  openIncidents: 0,
  resolvedIncidents: 0
})

// Cargar estadísticas al montar el componente
onMounted(() => {
  loadStats()
})

const loadStats = async () => {
  try {
    console.log('Cargando estadísticas...')
    
    // Cargar estadísticas reales desde la API usando el servicio configurado
    const [usersRes, deptsRes] = await Promise.all([
      api.get('/users'),
      api.get('/departments')
    ])

    // Las respuestas vienen en formato { success: true, data: [...], count: N }
    const usersData = usersRes.data?.data || []
    const deptsData = deptsRes.data?.data || []

    console.log('Usuarios cargados:', usersData.length)
    console.log('Departamentos cargados:', deptsData.length)

    // Calcular estadísticas basadas en los datos reales
    stats.value = {
      activeUsers: Array.isArray(usersData) ? usersData.filter(u => u.activo === 'activo').length : 0,
      totalDepartments: Array.isArray(deptsData) ? deptsData.filter(d => d.status === 'activo').length : 0,
      openIncidents: 0, // Por ahora 0 hasta que tengamos el endpoint de incidentes
      resolvedIncidents: 0 // Por ahora 0 hasta que tengamos el endpoint de incidentes
    }

    console.log('Estadísticas calculadas:', stats.value)
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    // Datos por defecto en caso de error
    stats.value = {
      activeUsers: 0,
      totalDepartments: 0,
      openIncidents: 0,
      resolvedIncidents: 0
    }
  }
}
</script>