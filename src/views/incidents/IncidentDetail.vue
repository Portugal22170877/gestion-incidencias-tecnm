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

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="incident" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Información Principal -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">
                    Incidencia #{{ incident.id }}
                  </h1>
                  <p class="text-lg text-gray-600 mt-1">{{ incident.title }}</p>
                </div>
                <div class="flex space-x-2">
                  <StatusBadge :status="incident.status" />
                  <PriorityBadge :priority="incident.priority" />
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="space-y-6">
                <!-- Descripción -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
                  <p class="text-gray-700">{{ incident.description }}</p>
                </div>

                <!-- Detalles adicionales -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span class="text-sm font-medium text-gray-500">Departamento:</span>
                    <p class="text-gray-900">{{ incident.department_name || 'No especificado' }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Ubicación:</span>
                    <p class="text-gray-900">{{ incident.location || 'No especificada' }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Categoría:</span>
                    <p class="text-gray-900">{{ getCategoryName(incident.category) }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Fecha de Creación:</span>
                    <p class="text-gray-900">{{ formatDate(incident.created_at) }}</p>
                  </div>
                </div>

                <!-- Archivos adjuntos -->
                <div v-if="incident.attachments?.length">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Archivos Adjuntos</h3>
                  <div class="space-y-2">
                    <div 
                      v-for="file in incident.attachments" 
                      :key="file.id"
                      class="flex items-center p-3 border rounded-md hover:bg-gray-50"
                    >
                      <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-sm text-gray-900">{{ file.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="bg-white shadow rounded-lg mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Historial y Comentarios</h2>
            </div>
            
            <div class="p-6">
              <!-- Lista de comentarios -->
              <div class="space-y-4 mb-6">
                <div 
                  v-for="comment in comments" 
                  :key="comment.id"
                  class="border-l-4 border-blue-200 pl-4 py-2"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <p class="text-sm text-gray-900">{{ comment.content }}</p>
                      <div class="mt-1 text-xs text-gray-500">
                        Por {{ comment.author_name }} - {{ formatDate(comment.created_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Agregar nuevo comentario -->
              <div v-if="canComment">
                <form @submit.prevent="addComment" class="space-y-3">
                  <textarea
                    v-model="newComment"
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Agregar comentario..."
                  ></textarea>
                  <button 
                    type="submit"
                    :disabled="!newComment.trim() || submittingComment"
                    class="btn-primary"
                  >
                    {{ submittingComment ? 'Agregando...' : 'Agregar Comentario' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="lg:col-span-1">
          <!-- Información del Estado -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Estado de la Incidencia</h3>
            
            <div class="space-y-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Estado Actual:</span>
                <div class="mt-1">
                  <StatusBadge :status="incident.status" />
                </div>
              </div>

              <div>
                <span class="text-sm font-medium text-gray-500">Asignado a:</span>
                <p class="text-gray-900">{{ incident.assigned_to_name || 'Sin asignar' }}</p>
              </div>

              <div v-if="incident.estimated_completion">
                <span class="text-sm font-medium text-gray-500">Fecha estimada:</span>
                <p class="text-gray-900">{{ formatDate(incident.estimated_completion) }}</p>
              </div>

              <!-- Requiere RFC -->
              <div>
                <label class="flex items-center">
                  <input 
                    v-model="incident.requires_rfc"
                    type="checkbox"
                    :disabled="!canEditRequireRfc"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">Requiere RFC para finalizar</span>
                </label>
              </div>
            </div>

            <!-- Acciones de Estado -->
            <div class="mt-6 space-y-3">
              <!-- Para técnicos -->
              <div v-if="authStore.hasRole('technician') && incident.assigned_to === authStore.user?.id">
                <button 
                  v-if="incident.status === 'open'"
                  @click="updateStatus('in_progress')"
                  class="w-full btn-primary"
                >
                  Comenzar Trabajo
                </button>
                
                <button 
                  v-if="incident.status === 'in_progress'"
                  @click="updateStatus('resolved')"
                  class="w-full btn-success"
                >
                  Marcar como Resuelta
                </button>
              </div>

              <!-- Para administradores -->
              <div v-if="authStore.hasRole('admin')" class="space-y-2">
                <select 
                  v-model="newStatus"
                  @change="updateStatus(newStatus)"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Cambiar Estado</option>
                  <option value="open">Abierta</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelta</option>
                  <option value="closed" v-if="!incident.requires_rfc || rfcApproved">Cerrada</option>
                </select>

                <!-- Botón especial para RFC -->
                <button 
                  v-if="incident.status === 'resolved' && incident.requires_rfc"
                  @click="showRfcApproval = true"
                  class="w-full btn-warning"
                >
                  Aprobar con RFC y Finalizar
                </button>
              </div>

              <!-- Asignar técnico -->
              <div v-if="authStore.hasRole(['admin', 'department_head'])">
                <select 
                  v-model="incident.assigned_to"
                  @change="assignTechnician"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Asignar Técnico</option>
                  <option value="1">Juan Pérez - Sistemas</option>
                  <option value="2">María García - Hardware</option>
                  <option value="3">Carlos López - Redes</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Historial de cambios -->
          <div class="bg-white shadow rounded-lg p-6 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Historial de Cambios</h3>
            <div class="space-y-3">
              <div 
                v-for="change in statusHistory" 
                :key="change.id"
                class="text-sm"
              >
                <div class="font-medium text-gray-900">
                  {{ change.description }}
                </div>
                <div class="text-gray-500">
                  {{ formatDate(change.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Aprobación RFC -->
    <div v-if="showRfcApproval" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Aprobación RFC Requerida</h3>
        <p class="text-sm text-gray-600 mb-4">
          Para finalizar esta incidencia, ingresa tu RFC como administrador:
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios de Aprobación</label>
            <textarea 
              v-model="rfcComments"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Comentarios sobre la aprobación..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showRfcApproval = false"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-success">
              Aprobar y Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error o incidencia no encontrada -->
    <div v-else-if="!loading" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6 text-center">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Incidencia no encontrada</h2>
        <p class="text-gray-600">La incidencia solicitada no existe o no tienes permisos para verla.</p>
        <router-link to="/incidents" class="btn-primary mt-4 inline-block">
          Volver a Incidencias
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'

const props = defineProps({
  id: String
})

const authStore = useAuthStore()
const loading = ref(true)
const incident = ref(null)
const comments = ref([])
const statusHistory = ref([])
const newComment = ref('')
const submittingComment = ref(false)
const newStatus = ref('')
const showRfcApproval = ref(false)
const rfcInput = ref('')
const rfcComments = ref('')
const rfcApproved = ref(false)

// Computed properties
const canComment = computed(() => {
  return authStore.isAuthenticated
})

const canEditRequireRfc = computed(() => {
  return authStore.hasRole(['admin', 'department_head'])
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryName = (category) => {
  const categories = {
    hardware: 'Hardware',
    software: 'Software',
    network: 'Red/Conectividad',
    security: 'Seguridad',
    maintenance: 'Mantenimiento',
    other: 'Otro'
  }
  return categories[category] || 'No especificada'
}

const loadIncident = () => {
  // Simular carga de datos
  setTimeout(() => {
    incident.value = {
      id: props.id,
      title: 'Problema con el servidor de correos',
      description: 'El servidor de correos electrónicos no está funcionando correctamente. Los usuarios reportan que no pueden enviar ni recibir emails desde esta mañana.',
      status: 'in_progress',
      priority: 'high',
      department_name: 'Sistemas e Informática',
      location: 'Sala de Servidores - Planta Baja',
      category: 'hardware',
      assigned_to: authStore.user?.role === 'technician' ? authStore.user.id : 3,
      assigned_to_name: 'Carlos López',
      requires_rfc: true,
      created_at: '2024-12-25T09:30:00Z',
      updated_at: '2024-12-25T14:15:00Z',
      estimated_completion: '2024-12-26T17:00:00Z',
      attachments: [
        { id: 1, name: 'error_log.txt', url: '#' },
        { id: 2, name: 'screenshot.png', url: '#' }
      ]
    }

    comments.value = [
      {
        id: 1,
        content: 'Se ha identificado el problema. Parece ser un fallo en el disco duro del servidor.',
        author_name: 'Carlos López',
        created_at: '2024-12-25T10:30:00Z'
      },
      {
        id: 2,
        content: 'Se está procediendo con el reemplazo del hardware defectuoso.',
        author_name: 'Carlos López',
        created_at: '2024-12-25T14:15:00Z'
      }
    ]

    statusHistory.value = [
      {
        id: 1,
        description: 'Incidencia creada',
        created_at: '2024-12-25T09:30:00Z'
      },
      {
        id: 2,
        description: 'Asignada a Carlos López',
        created_at: '2024-12-25T09:45:00Z'
      },
      {
        id: 3,
        description: 'Estado cambiado a "En Progreso"',
        created_at: '2024-12-25T10:00:00Z'
      }
    ]

    loading.value = false
  }, 1000)
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  submittingComment.value = true
  
  try {
    const comment = {
      id: Date.now(),
      content: newComment.value,
      author_name: authStore.userName,
      created_at: new Date().toISOString()
    }
    
    comments.value.push(comment)
    newComment.value = ''
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    submittingComment.value = false
  }
}

const updateStatus = (status) => {
  if (!status) return
  
  incident.value.status = status
  newStatus.value = ''
  
  // Agregar al historial
  statusHistory.value.push({
    id: Date.now(),
    description: `Estado cambiado a "${getStatusName(status)}"`,
    created_at: new Date().toISOString()
  })
  
  alert(`Estado actualizado a: ${getStatusName(status)}`)
}

const getStatusName = (status) => {
  const names = {
    open: 'Abierta',
    in_progress: 'En Progreso',
    resolved: 'Resuelta',
    closed: 'Cerrada'
  }
  return names[status] || status
}

const assignTechnician = () => {
  const technicians = {
    '1': 'Juan Pérez',
    '2': 'María García',
    '3': 'Carlos López'
  }
  
  incident.value.assigned_to_name = technicians[incident.value.assigned_to] || 'Sin asignar'
  
  statusHistory.value.push({
    id: Date.now(),
    description: `Asignada a ${incident.value.assigned_to_name}`,
    created_at: new Date().toISOString()
  })
  
  alert(`Incidencia asignada a ${incident.value.assigned_to_name}`)
}

const approveWithRfc = () => {
  if (!rfcInput.value || rfcInput.value.length < 10) {
    alert('Por favor ingresa un RFC válido')
    return
  }
  
  incident.value.status = 'closed'
  incident.value.rfc_approved_by = rfcInput.value
  incident.value.rfc_approval_date = new Date().toISOString()
  incident.value.rfc_approval_comments = rfcComments.value
  
  statusHistory.value.push({
    id: Date.now(),
    description: `Aprobada con RFC ${rfcInput.value} y cerrada`,
    created_at: new Date().toISOString()
  })
  
  showRfcApproval.value = false
  rfcInput.value = ''
  rfcComments.value = ''
  rfcApproved.value = true
  
  alert('Incidencia aprobada y cerrada exitosamente')
}

onMounted(() => {
  loadIncident()
})
</script>