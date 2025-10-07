<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navegación Superior -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-3">
            <img 
              src="/images/tecnm-culiacan-logo.svg" 
              alt="TECNM Culiacán"
              class="h-10 w-auto"
            />
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                Sistema de Gestión de Incidencias
              </h1>
              <p class="text-xs text-gray-600">
                Instituto Tecnológico de Culiacán
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Bienvenido, {{ authStore.userName }}
            </span>
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span class="text-white font-medium">
                    {{ authStore.userName.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </button>
              
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </router-link>
                <button 
                  @click="handleLogout" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Estadísticas Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Incidencias Abiertas"
          :value="statistics.open"
          icon="exclamation-triangle"
          color="yellow"
        />
        <StatCard
          title="En Progreso"
          :value="statistics.in_progress"
          icon="clock"
          color="blue"
        />
        <StatCard
          title="Resueltas Hoy"
          :value="statistics.resolved_today"
          icon="check-circle"
          color="green"
        />
        <StatCard
          title="Promedio Resolución"
          :value="statistics.avg_resolution_time"
          icon="chart-bar"
          color="purple"
        />
      </div>

      <!-- Contenido Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Panel de Navegación -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            <div class="space-y-2">
              <router-link 
                v-if="canCreateIncident"
                to="/incidents/create"
                class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <ExclamationTriangleIcon class="w-4 h-4 inline mr-2" />
                Nueva Incidencia
              </router-link>
              
              <router-link 
                to="/incidents"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <ListBulletIcon class="w-4 h-4 inline mr-2" />
                Ver Todas las Incidencias
              </router-link>
              
              <router-link 
                to="/incidents/periods"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Incidencias por Período
              </router-link>
              
              <router-link 
                v-if="authStore.hasRole(['administrador', 'jefe_departamento'])"
                to="/spaces"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Gestión de Espacios
              </router-link>
              
              <router-link 
                v-if="authStore.hasRole('administrador')"
                to="/admin"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <CogIcon class="w-4 h-4 inline mr-2" />
                Panel de Administración
              </router-link>
            </div>
          </div>

          <!-- Incidencias por Prioridad -->
          <div class="bg-white rounded-lg shadow p-6 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Por Prioridad</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-red-600">Crítica</span>
                <span class="text-sm font-medium">{{ priorityStats.critical }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-orange-600">Alta</span>
                <span class="text-sm font-medium">{{ priorityStats.high }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-yellow-600">Media</span>
                <span class="text-sm font-medium">{{ priorityStats.medium }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-green-600">Baja</span>
                <span class="text-sm font-medium">{{ priorityStats.low }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Incidencias Recientes -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Incidencias Recientes</h3>
            </div>
            <div class="p-6">
              <div v-if="loading" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              
              <div v-else-if="recentIncidents.length === 0" class="text-center py-8 text-gray-500">
                No hay incidencias recientes
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="incident in recentIncidents" 
                  :key="incident.id"
                  class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  @click="router.push(`/incidents/${incident.id}`)"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ incident.title }}
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ incident.description }}
                      </p>
                      <div class="flex items-center mt-2 space-x-4">
                        <StatusBadge :status="incident.status" />
                        <PriorityBadge :priority="incident.priority" />
                        <span class="text-xs text-gray-500">
                          {{ formatDate(incident.created_at) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useIncidentStore } from '@/stores/incidents'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import { 
  ExclamationTriangleIcon, 
  ListBulletIcon, 
  CogIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const incidentStore = useIncidentStore()

const showUserMenu = ref(false)
const loading = ref(false)

const statistics = ref({
  open: 0,
  in_progress: 0,
  resolved_today: 0,
  avg_resolution_time: '0 días'
})

const priorityStats = computed(() => incidentStore.incidentsByPriority)

const recentIncidents = computed(() => {
  return incidentStore.incidents.slice(0, 5)
})

const canCreateIncident = computed(() => {
  return authStore.hasRole(['administrador', 'jefe_departamento'])
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  loading.value = true
  await incidentStore.fetchIncidents()
  
  // Calcular estadísticas reales
  const today = new Date().toDateString()
  const resolvedToday = incidentStore.incidents.filter(incident => {
    const resolvedDate = incident.resolved_at ? new Date(incident.resolved_at).toDateString() : null
    return resolvedDate === today && ['resuelta', 'cerrada', 'resolved', 'closed'].includes(incident.status)
  }).length
  
  // Calcular tiempo promedio de resolución
  const resolvedIncidents = incidentStore.incidents.filter(i => 
    ['resuelta', 'cerrada', 'resolved', 'closed'].includes(i.status) && i.resolved_at && i.created_at
  )
  
  let avgResolutionTime = '0 días'
  if (resolvedIncidents.length > 0) {
    const totalHours = resolvedIncidents.reduce((sum, incident) => {
      const created = new Date(incident.created_at)
      const resolved = new Date(incident.resolved_at)
      const hours = (resolved - created) / (1000 * 60 * 60) // diferencia en horas
      return sum + hours
    }, 0)
    
    const avgHours = totalHours / resolvedIncidents.length
    const avgDays = (avgHours / 24).toFixed(1)
    avgResolutionTime = `${avgDays} días`
  }
  
  statistics.value = {
    open: incidentStore.incidentsByStatus.open,
    in_progress: incidentStore.incidentsByStatus.in_progress,
    resolved_today: resolvedToday,
    avg_resolution_time: avgResolutionTime
  }
  
  loading.value = false
})
</script>