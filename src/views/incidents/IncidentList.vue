<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navegación -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800">
              ← Volver al Dashboard
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex space-x-3">
              <router-link 
                to="/incidents/periods"
                class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Ver Períodos
              </router-link>
              <router-link 
                v-if="canCreate"
                to="/incidents/create"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Nueva Incidencia
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <!-- Encabezado y Filtros -->
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Gestión de Incidencias</h1>
          
          <!-- Filtros -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select 
                v-model="filters.status"
                @change="applyFilters"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="open">Abierta</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelta</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select 
                v-model="filters.priority"
                @change="applyFilters"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input 
                v-model="searchQuery"
                @input="applyFilters"
                type="text"
                placeholder="Buscar incidencias..."
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div class="flex items-end">
              <button 
                @click="clearFilters"
                class="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de Incidencias -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Título
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado a
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-4 text-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
              
              <tr v-else-if="filteredIncidents.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No se encontraron incidencias
                </td>
              </tr>
              
              <tr 
                v-else
                v-for="incident in paginatedIncidents" 
                :key="incident.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      #{{ incident.id }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ incident.title }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="incident.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge :priority="incident.priority" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ incident.assigned_to_name || 'Sin asignar' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(incident.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link 
                    :to="`/incidents/${incident.id}`"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Ver
                  </router-link>
                  <button 
                    v-if="canEdit(incident)"
                    @click="editIncident(incident)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button 
                    v-if="canDelete(incident)"
                    @click="deleteIncident(incident)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ startIndex }}</span> a <span class="font-medium">{{ endIndex }}</span> de <span class="font-medium">{{ filteredIncidents.length }}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="goToPage(page)"
                  :class="page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                <button 
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useIncidentStore } from '@/stores/incidents'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'

const router = useRouter()
const authStore = useAuthStore()
const incidentStore = useIncidentStore()

const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filters = ref({
  status: 'all',
  priority: 'all'
})

const canCreate = computed(() => {
  return authStore.hasRole(['admin', 'department_head'])
})

const filteredIncidents = computed(() => {
  let incidents = incidentStore.filteredIncidents

  if (searchQuery.value) {
    incidents = incidents.filter(incident =>
      incident.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      incident.id.toString().includes(searchQuery.value)
    )
  }

  return incidents
})

const totalPages = computed(() => {
  return Math.ceil(filteredIncidents.value.length / itemsPerPage)
})

const paginatedIncidents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredIncidents.value.slice(start, end)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredIncidents.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const canEdit = (incident) => {
  return authStore.canManageIncident(incident)
}

const canDelete = (incident) => {
  return authStore.hasRole('admin') || (
    authStore.hasRole('department_head') && 
    incident.department_id === authStore.userDepartment?.id
  )
}

const applyFilters = () => {
  incidentStore.updateFilters(filters.value)
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    status: 'all',
    priority: 'all'
  }
  searchQuery.value = ''
  incidentStore.clearFilters()
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const editIncident = (incident) => {
  router.push(`/incidents/${incident.id}/edit`)
}

const deleteIncident = async (incident) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la incidencia #${incident.id}?`)) {
    const result = await incidentStore.deleteIncident(incident.id)
    if (!result.success) {
      alert('Error al eliminar la incidencia: ' + result.error)
    }
  }
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
  loading.value = false
})
</script>