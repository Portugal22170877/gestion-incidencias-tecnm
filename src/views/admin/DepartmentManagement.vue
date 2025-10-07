<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/admin" class="text-blue-600 hover:text-blue-800">
              ← Volver al Panel de Admin
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header con botón de crear departamento -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Departamentos</h1>
          <button @click="openCreateModal" class="btn-primary flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Departamento
          </button>
        </div>
        
        <!-- Filtros -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input v-model="searchTerm" type="text" placeholder="Buscar por nombre" 
                   class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="filterStatus" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Grid de departamentos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="department in filteredDepartments" :key="department.id" 
             class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ department.name }}</h3>
                <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusBadgeClass(department.status)">
                  {{ department.status === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>
            
            <!-- Menú de acciones -->
            <div class="relative">
              <button @click="toggleMenu(department.id)" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
              
              <div v-if="activeMenu === department.id" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div class="py-1">
                  <button @click="editDepartment(department)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Editar
                  </button>
                  <button @click="toggleDepartmentStatus(department)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {{ department.status === 'activo' ? 'Desactivar' : 'Activar' }}
                  </button>
                  <button @click="deleteDepartment(department)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p class="text-gray-600 text-sm mb-4">{{ department.description }}</p>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Jefe:</span>
              <span class="font-medium">{{ department.jefe_nombre || department.manager || 'Sin asignar' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Empleados:</span>
              <span class="font-medium">{{ department.employeeCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Incidencias Abiertas:</span>
              <span class="font-medium text-yellow-600">{{ department.openIncidents }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Presupuesto:</span>
              <span class="font-medium">${{ formatCurrency(department.budget) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Crear/Editar Departamento -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Editar Departamento' : 'Nuevo Departamento' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveDepartment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del departamento *</label>
              <input v-model="departmentForm.name" type="text" required
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea v-model="departmentForm.description" rows="3"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jefe de departamento</label>
              <select v-model="departmentForm.manager_id"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option :value="null">Seleccionar jefe</option>
                <option v-for="manager in availableManagers" :key="manager.id" :value="manager.id">
                  {{ manager.name }} ({{ manager.email }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Presupuesto anual</label>
              <input v-model.number="departmentForm.budget" type="number" step="0.01" min="0"
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input v-model="departmentForm.location" type="text"
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" @click="closeModal" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Actualizar' : 'Crear' }} Departamento
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

// Configuración de API
const API_BASE = 'http://localhost:3001/api'

// Headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

// Estados reactivos
const departments = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const activeMenu = ref(null)
const searchTerm = ref('')
const filterStatus = ref('')

// Gerentes disponibles (cargados desde API)
const availableManagers = ref([])

// Formulario de departamento
const departmentForm = ref({
  id: null,
  name: '',
  description: '',
  manager: '',
  budget: 0,
  location: '',
  status: 'activo',
  employeeCount: 0,
  openIncidents: 0
})

// Departamentos filtrados
const filteredDepartments = computed(() => {
  return departments.value.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = !filterStatus.value || dept.status === filterStatus.value
    
    return matchesSearch && matchesStatus
  })
})

// Cargar datos iniciales
onMounted(() => {
  loadDepartments()
  loadUsers()
})

const loadDepartments = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('🔄 Cargando departamentos...')
    const response = await fetch(`${API_BASE}/departments`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Error cargando departamentos')
    }

    const data = await response.json()
    console.log('✅ Departamentos cargados:', data)
    departments.value = data.data || []
    console.log('📊 Total departamentos en estado:', departments.value.length)
  } catch (err) {
    console.error('❌ Error cargando departamentos:', err)
    error.value = 'Error cargando departamentos'
    departments.value = []
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Error cargando usuarios')
    }

    const data = await response.json()
    const users = data.data || data || []
    
    // Filtrar solo usuarios que pueden ser jefes (administradores y jefes de departamento)
    availableManagers.value = users
      .filter(user => user.rol === 'administrador' || user.rol === 'jefe_departamento')
      .map(user => ({
        id: user.id_usuario,
        name: user.nombre_usuario,
        email: user.correo
      }))
    
    console.log('Usuarios cargados:', availableManagers.value)
  } catch (err) {
    console.error('Error cargando usuarios:', err)
    // Fallback con datos vacíos
    availableManagers.value = []
  }
}

// Funciones de utilidad
const getStatusBadgeClass = (status) => {
  return status === 'activo' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX').format(amount)
}

const toggleMenu = (departmentId) => {
  activeMenu.value = activeMenu.value === departmentId ? null : departmentId
}

// Funciones de gestión de departamentos
const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
  activeMenu.value = null
}

const editDepartment = (department) => {
  console.log('📝 Editando departamento:', department)
  
  // Mapear cuidadosamente los campos del departamento al formulario
  departmentForm.value = {
    id: department.id,
    name: department.name || '',
    description: department.description || '',
    manager_id: department.manager_id || null,
    budget: parseFloat(department.budget) || 0,
    location: department.location || '',
    status: department.status || 'activo',
    employeeCount: department.employee_count || 0,
    openIncidents: department.open_incidents || 0
  }
  
  console.log('📝 Formulario cargado:', departmentForm.value)
  console.log('📝 Manager ID actual:', department.manager_id)
  console.log('📝 Manager name actual:', department.jefe_nombre)
  isEditing.value = true
  showModal.value = true
  activeMenu.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  departmentForm.value = {
    id: null,
    name: '',
    description: '',
    manager_id: null,
    budget: 0,
    location: '',
    status: 'activo',
    employeeCount: 0,
    openIncidents: 0
  }
}

const saveDepartment = async () => {
  if (!departmentForm.value.name.trim()) {
    alert('El nombre del departamento es requerido')
    return
  }

  try {
    loading.value = true
    
    if (isEditing.value) {
      // Actualizar departamento existente
      const updateData = {
        name: departmentForm.value.name,
        description: departmentForm.value.description,
        manager_id: departmentForm.value.manager_id,
        budget: departmentForm.value.budget,
        location: departmentForm.value.location,
        status: departmentForm.value.status
      }
      
      console.log('🔄 Actualizando departamento con datos:', updateData)
      console.log('🆔 Manager ID seleccionado:', departmentForm.value.manager_id)
      
      const response = await fetch(`${API_BASE}/departments/${departmentForm.value.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('✅ Respuesta del servidor:', responseData)
        alert('Departamento actualizado correctamente')
        await loadDepartments()
        console.log('🔄 Datos recargados después de actualización')
      } else {
        const errorText = await response.text()
        console.error('❌ Error en respuesta:', errorText)
        throw new Error(`Error al actualizar departamento: ${errorText}`)
      }
    } else {
      // Crear nuevo departamento
      const response = await fetch(`${API_BASE}/departments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: departmentForm.value.name,
          description: departmentForm.value.description,
          manager_id: departmentForm.value.manager_id,
          budget: departmentForm.value.budget,
          location: departmentForm.value.location,
          status: departmentForm.value.status
        })
      })

      if (response.ok) {
        alert('Departamento creado correctamente')
        await loadDepartments()
      } else {
        const errorText = await response.text()
        throw new Error(`Error al crear departamento: ${errorText}`)
      }
    }
    
    closeModal()
  } catch (err) {
    console.error('Error guardando departamento:', err)
    alert(`Error: ${err.message}`)
  } finally {
    loading.value = false
  }
}

const toggleDepartmentStatus = (department) => {
  const newStatus = department.status === 'activo' ? 'inactivo' : 'activo'
  department.status = newStatus
  activeMenu.value = null
  alert(`Departamento ${newStatus === 'activo' ? 'activado' : 'desactivado'} correctamente`)
}

const deleteDepartment = async (department) => {
  if (!confirm(`¿Está seguro de eliminar el departamento ${department.name}?`)) {
    return
  }

  try {
    loading.value = true
    
    const response = await fetch(`${API_BASE}/departments/${department.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (response.ok) {
      alert('Departamento eliminado correctamente')
      await loadDepartments()
    } else {
      throw new Error('Error al eliminar departamento')
    }
    
    activeMenu.value = null
  } catch (err) {
    console.error('Error eliminando departamento:', err)
    alert(`Error: ${err.message}`)
  } finally {
    loading.value = false
  }
}
</script>