<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Espacios</h1>
          <p class="mt-2 text-sm text-gray-700">
            Administra las aulas, cubículos y oficinas de tu departamento
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            @click="openCreateSpaceModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Espacio
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Nombre del espacio..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            v-model="filterType"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="aula">Aula</option>
            <option value="cubiculo">Cubículo</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="oficina">Oficina</option>
            <option value="sala_juntas">Sala de Juntas</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filterStatus"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadSpaces"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Lista de espacios -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="space in filteredSpaces"
        :key="space.id"
        class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <!-- Header del espacio -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ space.name }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span :class="getTypeIconClass(space.type)" class="w-4 h-4"></span>
              <span class="text-sm text-gray-600 capitalize">{{ getTypeLabel(space.type) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="getStatusBadgeClass(space.status)" class="px-2 py-1 text-xs font-medium rounded-full capitalize">
              {{ space.status }}
            </span>
            <!-- Menú de acciones -->
            <div class="relative">
              <button
                @click="toggleMenu(space.id)"
                class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
              <div
                v-if="activeMenu === space.id"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
              >
                <button
                  @click="viewSpaceInventory(space)"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Ver Inventario
                </button>
                <button
                  @click="editSpace(space)"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Editar Espacio
                </button>
                <button
                  @click="generateQRCode(space)"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Generar QR
                </button>
                <hr class="my-1">
                <button
                  @click="deleteSpace(space)"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Información del espacio -->
        <div class="space-y-3">
          <div v-if="space.location" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {{ space.location }}
          </div>
          
          <div v-if="space.capacity" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Capacidad: {{ space.capacity }} personas
          </div>

          <div v-if="space.area_m2" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
            </svg>
            Área: {{ space.area_m2 }} m²
          </div>

          <!-- Resumen de inventario -->
          <div class="bg-gray-50 rounded-lg p-3 mt-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600">Equipos registrados:</span>
              <span class="font-semibold text-gray-900">{{ space.equipment_count || 0 }}</span>
            </div>
            <div class="flex justify-between items-center text-sm mt-1">
              <span class="text-gray-600">Valor total:</span>
              <span class="font-semibold text-green-600">${{ formatCurrency(space.total_value || 0) }}</span>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="space.description" class="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p>{{ space.description }}</p>
          </div>
        </div>

        <!-- Botón de ver inventario -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button
            @click="viewSpaceInventory(space)"
            class="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Gestionar Inventario ({{ space.equipment_count || 0 }} equipos)
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="!loading && !error && filteredSpaces.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay espacios registrados</h3>
      <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer aula o cubículo.</p>
      <div class="mt-6">
        <button
          @click="openCreateSpaceModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Crear Primer Espacio
        </button>
      </div>
    </div>

    <!-- Modal de crear/editar espacio -->
    <div v-if="showSpaceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditingSpace ? 'Editar' : 'Crear' }} Espacio
            </h3>
            <button @click="closeSpaceModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveSpace">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del espacio *</label>
                <input
                  v-model="spaceForm.name"
                  type="text"
                  required
                  placeholder="Ej: Aula A-101, Cubículo Director, Lab. Sistemas"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Tipo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de espacio *</label>
                <select
                  v-model="spaceForm.type"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="aula">Aula</option>
                  <option value="cubiculo">Cubículo</option>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="oficina">Oficina</option>
                  <option value="sala_juntas">Sala de Juntas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  v-model="spaceForm.status"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                </select>
              </div>

              <!-- Ubicación -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input
                  v-model="spaceForm.location"
                  type="text"
                  placeholder="Ej: Edificio A, Planta Baja, Aula 101"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Capacidad -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad (personas)</label>
                <input
                  v-model.number="spaceForm.capacity"
                  type="number"
                  min="1"
                  placeholder="Ej: 40"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Área -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input
                  v-model.number="spaceForm.area_m2"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 60.50"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <!-- Usuario responsable -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Usuario responsable</label>
                <select
                  v-model="spaceForm.responsible_user_id"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sin asignar</option>
                  <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                  </option>
                </select>
              </div>

              <!-- Descripción -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  v-model="spaceForm.description"
                  rows="3"
                  placeholder="Descripción detallada del espacio, características especiales, etc."
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeSpaceModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : (isEditingSpace ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estados reactivos
const spaces = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const filterType = ref('')
const filterStatus = ref('')
const activeMenu = ref(null)
const availableUsers = ref([])

// Modal de espacio
const showSpaceModal = ref(false)
const isEditingSpace = ref(false)
const saving = ref(false)

// Formulario de espacio
const spaceForm = ref({
  id: null,
  name: '',
  type: '',
  location: '',
  capacity: null,
  area_m2: null,
  description: '',
  status: 'activo',
  responsible_user_id: null
})

// API configuration
const API_BASE = 'http://localhost:3001/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

// Computed properties
const filteredSpaces = computed(() => {
  return spaces.value.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         (space.location && space.location.toLowerCase().includes(searchTerm.value.toLowerCase()))
    const matchesType = !filterType.value || space.type === filterType.value
    const matchesStatus = !filterStatus.value || space.status === filterStatus.value
    
    return matchesSearch && matchesType && matchesStatus
  })
})

// Utility functions
const getTypeLabel = (type) => {
  const labels = {
    'aula': 'Aula',
    'cubiculo': 'Cubículo',
    'laboratorio': 'Laboratorio',
    'oficina': 'Oficina',
    'sala_juntas': 'Sala de Juntas',
    'otro': 'Otro'
  }
  return labels[type] || type
}

const getTypeIconClass = (type) => {
  const icons = {
    'aula': 'text-blue-500',
    'cubiculo': 'text-green-500',
    'laboratorio': 'text-purple-500',
    'oficina': 'text-yellow-500',
    'sala_juntas': 'text-red-500',
    'otro': 'text-gray-500'
  }
  return icons[type] || 'text-gray-500'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'activo': 'bg-green-100 text-green-800',
    'inactivo': 'bg-red-100 text-red-800',
    'mantenimiento': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX').format(amount)
}

const toggleMenu = (spaceId) => {
  activeMenu.value = activeMenu.value === spaceId ? null : spaceId
}

// API functions
const loadSpaces = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_BASE}/spaces`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar espacios')
    }
    
    const data = await response.json()
    spaces.value = data.data || []
  } catch (err) {
    error.value = 'Error al cargar espacios: ' + err.message
    console.error('Error loading spaces:', err)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return
    
    const data = await response.json()
    const users = data.data || []
    
    // Filtrar usuarios del mismo departamento
    availableUsers.value = users.map(user => ({
      id: user.id_usuario || user.id,
      name: user.nombre_usuario || user.name,
      email: user.correo || user.email
    }))
  } catch (err) {
    console.error('Error loading users:', err)
  }
}

// Modal functions
const openCreateSpaceModal = () => {
  resetSpaceForm()
  isEditingSpace.value = false
  showSpaceModal.value = true
  activeMenu.value = null
}

const editSpace = (space) => {
  spaceForm.value = { ...space }
  isEditingSpace.value = true
  showSpaceModal.value = true
  activeMenu.value = null
}

const closeSpaceModal = () => {
  showSpaceModal.value = false
  resetSpaceForm()
}

const resetSpaceForm = () => {
  spaceForm.value = {
    id: null,
    name: '',
    type: '',
    location: '',
    capacity: null,
    area_m2: null,
    description: '',
    status: 'activo',
    responsible_user_id: null
  }
}

const saveSpace = async () => {
  saving.value = true
  
  try {
    const url = isEditingSpace.value 
      ? `${API_BASE}/spaces/${spaceForm.value.id}`
      : `${API_BASE}/spaces`
    
    const method = isEditingSpace.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(spaceForm.value)
    })
    
    if (!response.ok) {
      throw new Error('Error al guardar espacio')
    }
    
    closeSpaceModal()
    loadSpaces()
  } catch (err) {
    error.value = 'Error al guardar espacio: ' + err.message
  } finally {
    saving.value = false
  }
}

const deleteSpace = async (space) => {
  if (!confirm(`¿Estás seguro de eliminar el espacio "${space.name}"? Esta acción no se puede deshacer.`)) {
    return
  }
  
  try {
    const response = await fetch(`${API_BASE}/spaces/${space.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al eliminar espacio')
    }
    
    loadSpaces()
    activeMenu.value = null
  } catch (err) {
    error.value = 'Error al eliminar espacio: ' + err.message
  }
}

// Navigation functions
const viewSpaceInventory = (space) => {
  activeMenu.value = null
  router.push(`/spaces/${space.id}/inventory`)
}

const generateQRCode = (space) => {
  activeMenu.value = null
  // TODO: Implementar generación de código QR
  alert(`Generando código QR para: ${space.name}`)
}

// Lifecycle
onMounted(() => {
  loadSpaces()
  loadUsers()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>