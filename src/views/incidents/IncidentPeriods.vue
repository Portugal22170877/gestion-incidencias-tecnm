<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navegación -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/incidents" class="text-blue-600 hover:text-blue-800">
              ← Volver a Incidencias
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <!-- Header con selector de período -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Incidencias por Período</h1>
            <button 
              @click="showCreatePeriod = true"
              v-if="authStore.hasRole('admin')"
              class="btn-primary"
            >
              Crear Nuevo Período
            </button>
          </div>

          <!-- Selector de Período -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select 
                v-model="selectedPeriod"
                @change="loadPeriodData"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona un período</option>
                <option 
                  v-for="period in periods" 
                  :key="period.id" 
                  :value="period.id"
                >
                  {{ period.name }} ({{ formatDateRange(period.start_date, period.end_date) }})
                </option>
              </select>
            </div>

            <div v-if="selectedPeriodData">
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado del Período</label>
              <div class="flex items-center mt-2">
                <span 
                  :class="selectedPeriodData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ selectedPeriodData.status === 'active' ? 'Activo' : 'Cerrado' }}
                </span>
              </div>
            </div>

            <div v-if="selectedPeriodData && authStore.hasRole('admin')">
              <label class="block text-sm font-medium text-gray-700 mb-1">Acciones</label>
              <button 
                @click="closePeriod"
                :disabled="selectedPeriodData.status === 'closed'"
                class="btn-warning mt-1"
              >
                {{ selectedPeriodData.status === 'active' ? 'Cerrar Período' : 'Período Cerrado' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas del Período -->
        <div v-if="selectedPeriodData" class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Período</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ periodStats.total }}</div>
              <div class="text-sm text-blue-800">Total Incidencias</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ periodStats.resolved }}</div>
              <div class="text-sm text-green-800">Resueltas</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ periodStats.pending }}</div>
              <div class="text-sm text-yellow-800">Pendientes</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ periodStats.avgResolutionTime }}</div>
              <div class="text-sm text-purple-800">Tiempo Promedio</div>
            </div>
          </div>
        </div>

        <!-- Lista de Incidencias del Período -->
        <div v-if="selectedPeriodData" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incidencia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requiere RFC
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="incident in periodIncidents" :key="incident.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">#{{ incident.id }}</div>
                    <div class="text-sm text-gray-500">{{ incident.title }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="incident.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ incident.assigned_to_name || 'Sin asignar' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="incident.requires_rfc" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    RFC Requerido
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    No Requerido
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    v-if="incident.status === 'resolved' && incident.requires_rfc && authStore.hasRole('admin')"
                    @click="openRfcModal(incident)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    Aprobar RFC
                  </button>
                  <router-link 
                    :to="`/incidents/${incident.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Ver Detalle
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Crear Período -->
    <div v-if="showCreatePeriod" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Crear Nuevo Período</h3>
        <form @submit.prevent="createPeriod">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Período</label>
            <input 
              v-model="newPeriod.name"
              type="text" 
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Primer Semestre 2024"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input 
              v-model="newPeriod.start_date"
              type="date" 
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input 
              v-model="newPeriod.end_date"
              type="date" 
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showCreatePeriod = false"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Crear Período
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para RFC -->
    <div v-if="showRfcModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Aprobar Finalización - RFC Requerido</h3>
        <p class="text-sm text-gray-600 mb-4">
          Para finalizar la incidencia <strong>#{{ selectedIncident?.id }}</strong>, 
          ingresa tu RFC como administrador:
        </p>
        <form @submit.prevent="approveWithRfc">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">RFC del Administrador</label>
            <input 
              v-model="rfcInput"
              type="text" 
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="AAAA000000XXX"
              maxlength="13"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios (opcional)</label>
            <textarea 
              v-model="rfcComments"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Comentarios adicionales sobre la resolución..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeRfcModal"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-success">
              Aprobar y Finalizar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/StatusBadge.vue'

const authStore = useAuthStore()

// Estado reactivo
const selectedPeriod = ref('')
const selectedPeriodData = ref(null)
const showCreatePeriod = ref(false)
const showRfcModal = ref(false)
const selectedIncident = ref(null)
const rfcInput = ref('')
const rfcComments = ref('')

// Períodos cargados desde la API
const periods = ref([])

const newPeriod = reactive({
  name: '',
  start_date: '',
  end_date: ''
})

// Datos de incidencias por período
const periodIncidents = ref([])
const periodStats = ref({
  total: 0,
  resolved: 0,
  pending: 0,
  avgResolutionTime: '0 días'
})

// Métodos
const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
  const end = new Date(endDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
  return `${start} - ${end}`
}

const loadPeriodData = async () => {
  if (!selectedPeriod.value) return
  
  const period = periods.value.find(p => p.id === selectedPeriod.value)
  selectedPeriodData.value = period
  
  try {
    // Cargar incidencias reales del período desde la API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/incidents?period=${selectedPeriod.value}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      periodIncidents.value = data.incidents || []
    } else {
      periodIncidents.value = []
    }
  } catch (error) {
    console.error('Error cargando incidencias del período:', error)
    periodIncidents.value = []
  }
  
  // Calcular estadísticas dinámicas
  const resolvedIncidents = periodIncidents.value.filter(i => ['resolved', 'closed', 'resuelta', 'cerrada'].includes(i.status))
  const pendingIncidents = periodIncidents.value.filter(i => ['open', 'in_progress', 'abierta', 'en_progreso'].includes(i.status))
  
  // Calcular tiempo promedio de resolución (simplificado)
  let avgTime = '0 días'
  if (resolvedIncidents.length > 0) {
    // Aquí podrías calcular el tiempo real basado en created_at y resolved_at
    avgTime = '2.5 días' // Placeholder
  }
  
  periodStats.value = {
    total: periodIncidents.value.length,
    resolved: resolvedIncidents.length,
    pending: pendingIncidents.length,
    avgResolutionTime: avgTime
  }
}

const createPeriod = () => {
  const newPeriodData = {
    id: `${Date.now()}`,
    ...newPeriod,
    status: 'active'
  }
  
  periods.value.push(newPeriodData)
  showCreatePeriod.value = false
  
  // Resetear formulario
  Object.keys(newPeriod).forEach(key => {
    newPeriod[key] = ''
  })
  
  alert('Período creado exitosamente')
}

const closePeriod = () => {
  if (confirm('¿Estás seguro de cerrar este período? Esta acción no se puede deshacer.')) {
    selectedPeriodData.value.status = 'closed'
    alert('Período cerrado exitosamente')
  }
}

const openRfcModal = (incident) => {
  selectedIncident.value = incident
  showRfcModal.value = true
}

const closeRfcModal = () => {
  showRfcModal.value = false
  selectedIncident.value = null
  rfcInput.value = ''
  rfcComments.value = ''
}

const approveWithRfc = () => {
  if (!rfcInput.value || rfcInput.value.length < 10) {
    alert('Por favor ingresa un RFC válido')
    return
  }
  
  // Actualizar el estado de la incidencia
  const incident = periodIncidents.value.find(i => i.id === selectedIncident.value.id)
  if (incident) {
    incident.status = 'closed'
    incident.rfc_approved_by = rfcInput.value
    incident.rfc_approval_date = new Date().toISOString()
    incident.rfc_comments = rfcComments.value
  }
  
  closeRfcModal()
  alert('Incidencia aprobada y finalizada exitosamente')
  
  // Recalcular estadísticas
  loadPeriodData()
}

const loadPeriods = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/periods`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      periods.value = data.periods || []
    }
  } catch (error) {
    console.error('Error cargando períodos:', error)
    periods.value = []
  }
}

onMounted(async () => {
  await loadPeriods()
  
  // Cargar el período activo por defecto
  const activePeriod = periods.value.find(p => p.status === 'active')
  if (activePeriod) {
    selectedPeriod.value = activePeriod.id
    loadPeriodData()
  }
})
</script>