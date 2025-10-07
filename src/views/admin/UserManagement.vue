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
      <!-- Header con botón de crear usuario -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <button @click="openCreateModal" class="btn-primary flex items-center" :disabled="loading">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Usuario
          </button>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Indicador de carga -->
        <div v-if="loading" class="mt-4 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando usuarios...
          </div>
        </div>
        
        <!-- Filtros -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input v-model="searchTerm" type="text" placeholder="Buscar por nombre o email" 
                   class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select v-model="filterRole" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="jefe_departamento">Jefe de Departamento</option>
              <option value="tecnico">Técnico</option>
            </select>
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

      <!-- Tabla de usuarios -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFC</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">{{ getUserInitials(user.name) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.department_name || user.department }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusBadgeClass(user.status)">
                  {{ user.status === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.rfc }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-3">
                  Editar
                </button>
                <button @click="resetPassword(user)" class="text-green-600 hover:text-green-900 mr-3" 
                        title="Resetear contraseña">
                  Resetear Contraseña
                </button>
                <button @click="toggleUserStatus(user)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                  {{ user.status === 'activo' ? 'Desactivar' : 'Activar' }}
                </button>
                <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Crear/Editar Usuario -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input v-model="userForm.name" type="text" required
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input v-model="userForm.email" type="email" required
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">RFC *</label>
              <input v-model="userForm.rfc" type="text" required maxlength="13"
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <select v-model="userForm.role" required
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Seleccionar rol</option>
                <option value="administrador">Administrador</option>
                <option value="jefe_departamento">Jefe de Departamento</option>
                <option value="tecnico">Técnico</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <select v-model="userForm.department_id" required
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Seleccionar departamento</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>

            <div v-if="!isEditing">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña inicial *
                <span class="text-xs text-gray-500">(mínimo 6 caracteres)</span>
              </label>
              <div class="flex gap-2">
                <div class="flex-1 relative">
                  <input v-model="userForm.password" :type="showPassword ? 'text' : 'password'" required minlength="6"
                         placeholder="Ingresa una contraseña segura"
                         class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <button type="button" @click="showPassword = !showPassword"
                          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <span class="text-sm">{{ showPassword ? '🙈' : '👁️' }}</span>
                  </button>
                </div>
                <button type="button" @click="generateRandomPassword"
                        class="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm border border-blue-300">
                  Generar
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                El usuario podrá cambiar esta contraseña después del primer acceso
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input v-model="userForm.phone" type="tel"
                     class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" @click="closeModal" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Actualizar' : 'Crear' }} Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Reset de Contraseña -->
    <div v-if="showPasswordResetModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Contraseña Reseteada</h3>
            <button @click="closePasswordResetModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Contraseña reseteada exitosamente
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  La contraseña de <strong>{{ passwordResetInfo.userName }}</strong> ha sido reseteada.
                </div>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  Nueva contraseña temporal
                </h3>
                <div class="mt-2">
                  <div class="bg-gray-100 p-3 rounded-md font-mono text-lg tracking-wider text-center">
                    {{ passwordResetInfo.newPassword }}
                  </div>
                  <p class="text-xs text-yellow-700 mt-2">
                    Proporcione esta contraseña al usuario de forma segura. El usuario deberá cambiarla en su primer acceso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button @click="copyPasswordToClipboard" 
                    class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200">
              📋 Copiar Contraseña
            </button>
            <button @click="closePasswordResetModal" 
                    class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API_BASE = 'http://localhost:3001/api'

// Estados reactivos
const users = ref([])
const departments = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const searchTerm = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Modal de reset de contraseña
const showPasswordResetModal = ref(false)
const passwordResetInfo = ref({
  userName: '',
  newPassword: ''
})

// Formulario de usuario
const userForm = ref({
  id: null,
  name: '',
  email: '',
  rfc: '',
  role: '',
  department_id: '',
  password: '',
  phone: '',
  status: 'activo'
})

// Usuarios filtrados
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesRole = !filterRole.value || user.role === filterRole.value
    const matchesStatus = !filterStatus.value || user.status === filterStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// Cargar datos iniciales
onMounted(() => {
  loadUsers()
  loadDepartments()
})

// Función para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

// Cargar usuarios desde la API
const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar usuarios')
    }
    
    const data = await response.json()
    // El backend devuelve un array de usuarios directamente
    users.value = data.data || data || []
    
    // Transformar los datos para que coincidan con el frontend
    users.value = users.value.map(user => ({
      id: user.id_usuario,
      name: user.nombre_usuario,
      email: user.correo,
      rfc: user.rfc || 'N/A',
      role: user.rol,
      department_id: user.departamento_id,
      department_name: user.nombre_departamento,
      phone: user.telefono,
      status: user.activo
    }))
  } catch (err) {
    error.value = 'Error al cargar usuarios: ' + err.message
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

// Cargar departamentos desde la API
const loadDepartments = async () => {
  try {
    const response = await fetch(`${API_BASE}/departments`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar departamentos')
    }
    
    const data = await response.json()
    // El backend devuelve un array de departamentos
    const departmentData = data.data || data || []
    
    if (departmentData.length > 0) {
      // Transformar los datos para que coincidan con el frontend
      departments.value = departmentData.map(dept => ({
        id: dept.id,
        name: dept.name
      }))
    } else {
      // Si no hay departamentos en la base de datos, usar los basados en los usuarios existentes
      departments.value = [
        { id: 1, name: 'Tecnologías de la Información' },
        { id: 2, name: 'Recursos Humanos' },
        { id: 3, name: 'Contabilidad' },
        { id: 4, name: 'Ventas' },
        { id: 5, name: 'Marketing' },
        { id: 6, name: 'Operaciones' }
      ]
    }
  } catch (err) {
    console.error('Error loading departments:', err)
    // Fallback con departamentos por defecto basados en los usuarios existentes
    departments.value = [
      { id: 1, name: 'Tecnologías de la Información' },
      { id: 2, name: 'Recursos Humanos' },
      { id: 3, name: 'Contabilidad' },
      { id: 4, name: 'Ventas' },
      { id: 5, name: 'Marketing' },
      { id: 6, name: 'Operaciones' }
    ]
  }
}

// Funciones de utilidad
const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getRoleLabel = (role) => {
  const labels = {
    'administrador': 'Administrador',
    'jefe_departamento': 'Jefe de Departamento',
    'tecnico': 'Técnico'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'administrador': 'bg-red-100 text-red-800',
    'jefe_departamento': 'bg-blue-100 text-blue-800',
    'tecnico': 'bg-green-100 text-green-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status) => {
  return status === 'activo' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

// Funciones de gestión de usuarios
const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const editUser = (user) => {
  userForm.value = { 
    id: user.id,
    name: user.name,
    email: user.email,
    rfc: user.rfc,
    role: user.role,
    department_id: user.department_id,
    phone: user.phone || '',
    status: user.status,
    password: '' // No mostrar contraseña en edición
  }
  isEditing.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  showPassword.value = false
  resetForm()
}

const resetForm = () => {
  userForm.value = {
    id: null,
    name: '',
    email: '',
    rfc: '',
    role: '',
    department_id: '',
    password: '',
    phone: '',
    status: 'activo'
  }
}

// Generar contraseña aleatoria segura
const generateRandomPassword = () => {
  const length = 10
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"
  let password = ""
  
  // Asegurar al menos un carácter de cada tipo
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]  // minúscula
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]  // mayúscula
  password += "0123456789"[Math.floor(Math.random() * 10)]                   // número
  password += "!@#$%&*"[Math.floor(Math.random() * 7)]                      // símbolo
  
  // Completar con caracteres aleatorios
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  // Mezclar la contraseña
  password = password.split('').sort(() => Math.random() - 0.5).join('')
  
  userForm.value.password = password
}

// Guardar usuario (crear o actualizar)
const saveUser = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Validación específica para nuevos usuarios
    if (!isEditing.value) {
      if (!userForm.value.password || userForm.value.password.trim() === '') {
        error.value = 'La contraseña es obligatoria para nuevos usuarios'
        return
      }
      if (userForm.value.password.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return
      }
    }

    const url = isEditing.value 
      ? `${API_BASE}/users/${userForm.value.id}`
      : `${API_BASE}/users`
    
    const method = isEditing.value ? 'PUT' : 'POST'
    
    // Transformar los datos del formulario al formato que espera el backend
    const userData = {
      name: userForm.value.name,
      email: userForm.value.email,
      rfc: userForm.value.rfc,
      role: userForm.value.role,
      department_id: parseInt(userForm.value.department_id),
      phone: userForm.value.phone,
      status: userForm.value.status
    }
    
    if (!isEditing.value) {
      // Para nuevos usuarios, incluir la contraseña (ya validada arriba)
      userData.password = userForm.value.password.trim()
    }
    
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al guardar usuario')
    }

    const data = await response.json()
    
    if (isEditing.value) {
      // Recargar la lista de usuarios después de editar
      await loadUsers()
      alert('Usuario actualizado correctamente')
    } else {
      // Recargar la lista de usuarios después de crear
      await loadUsers()
      alert('Usuario creado correctamente')
    }
    
    closeModal()
  } catch (err) {
    error.value = 'Error al guardar usuario: ' + err.message
    alert(error.value)
    console.error('Error saving user:', err)
  } finally {
    loading.value = false
  }
}

// Cambiar estado del usuario
const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'activo' ? 'inactivo' : 'activo'
    
    const userData = {
      name: user.name,
      email: user.email,
      rfc: user.rfc,
      role: user.role,
      department_id: user.department_id,
      phone: user.phone,
      status: newStatus
    }
    
    const response = await fetch(`${API_BASE}/users/${user.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      throw new Error('Error al cambiar estado del usuario')
    }

    user.status = newStatus
    alert(`Usuario ${newStatus === 'activo' ? 'activado' : 'desactivado'} correctamente`)
  } catch (err) {
    alert('Error al cambiar estado: ' + err.message)
    console.error('Error toggling user status:', err)
  }
}

// Eliminar usuario
const deleteUser = async (user) => {
  if (!confirm(`¿Está seguro de eliminar al usuario ${user.name}?`)) {
    return
  }

  try {
    const response = await fetch(`${API_BASE}/users/${user.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Error al eliminar usuario')
    }

    // Remover usuario de la lista local
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
    
    alert('Usuario eliminado correctamente')
  } catch (err) {
    alert('Error al eliminar usuario: ' + err.message)
    console.error('Error deleting user:', err)
  }
}

// Resetear contraseña de usuario
const resetPassword = async (user) => {
  // Generar nueva contraseña temporal
  const newPassword = generateRandomPassword()
  
  const confirmReset = confirm(
    `¿Está seguro de resetear la contraseña de ${user.name}?\n\n` +
    `Nueva contraseña temporal: ${newPassword}\n\n` +
    `El usuario deberá cambiarla en su primer inicio de sesión.`
  )
  
  if (!confirmReset) {
    return
  }

  try {
    const response = await fetch(`${API_BASE}/users/${user.id}/reset-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        new_password: newPassword
      })
    })

    if (!response.ok) {
      throw new Error('Error al resetear contraseña')
    }

    // Mostrar la nueva contraseña al administrador
    alert(
      `Contraseña reseteada exitosamente para ${user.name}\n\n` +
      `Nueva contraseña: ${newPassword}\n\n` +
      `Asegúrese de proporcionarla al usuario de forma segura.`
    )
    
  } catch (err) {
    console.error('Error reseteando contraseña:', err)
    alert('Error al resetear contraseña')
  }
}
</script>