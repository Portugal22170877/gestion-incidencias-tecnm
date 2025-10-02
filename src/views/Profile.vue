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
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Perfil Principal -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="p-6 border-b border-gray-200">
              <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p class="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
            </div>

            <div class="p-6">
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div v-if="message" :class="messageClass" class="p-4 rounded-md">
                  {{ message }}
                </div>

                <!-- Información Personal -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <input
                        v-model="profileForm.name"
                        type="text"
                        required
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                      <input
                        v-model="profileForm.email"
                        type="email"
                        required
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        v-model="profileForm.phone"
                        type="tel"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Extensión</label>
                      <input
                        v-model="profileForm.extension"
                        type="text"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Información del Trabajo -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Trabajo</h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <input
                        :value="getRoleName(authStore.userRole)"
                        type="text"
                        readonly
                        class="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                      <input
                        :value="authStore.userDepartment?.name || 'No asignado'"
                        type="text"
                        readonly
                        class="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                      <input
                        v-model="profileForm.position"
                        type="text"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                      <input
                        v-model="profileForm.hire_date"
                        type="date"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Notificaciones -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Preferencias de Notificación</h3>
                  
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input
                        v-model="profileForm.notifications.email"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">Recibir notificaciones por email</span>
                    </label>

                    <label class="flex items-center">
                      <input
                        v-model="profileForm.notifications.incident_assigned"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">Notificar cuando se me asigne una incidencia</span>
                    </label>

                    <label class="flex items-center">
                      <input
                        v-model="profileForm.notifications.status_updates"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">Notificar cambios de estado en mis incidencias</span>
                    </label>

                    <label class="flex items-center">
                      <input
                        v-model="profileForm.notifications.daily_summary"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">Resumen diario de actividad</span>
                    </label>
                  </div>
                </div>

                <!-- Botones -->
                <div class="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    @click="resetForm"
                    class="btn-secondary"
                  >
                    Restablecer
                  </button>
                  <button
                    type="submit"
                    :disabled="updating"
                    class="btn-primary"
                  >
                    {{ updating ? 'Actualizando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Avatar y estadísticas -->
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <div class="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-white">
                {{ authStore.userName.charAt(0).toUpperCase() }}
              </span>
            </div>
            <h3 class="text-lg font-medium text-gray-900">{{ authStore.userName }}</h3>
            <p class="text-sm text-gray-600">{{ getRoleName(authStore.userRole) }}</p>
            
            <!-- Estadísticas del usuario -->
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div class="text-2xl font-bold text-blue-600">{{ userStats.incidentsCreated }}</div>
                <div class="text-xs text-gray-500">Creadas</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600">{{ userStats.incidentsResolved }}</div>
                <div class="text-xs text-gray-500">Resueltas</div>
              </div>
            </div>
          </div>

          <!-- Cambiar Contraseña -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
            
            <form @submit.prevent="changePassword" class="space-y-4">
              <div v-if="passwordMessage" :class="passwordMessageClass" class="p-3 rounded-md text-sm">
                {{ passwordMessage }}
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                :disabled="updatingPassword"
                class="w-full btn-primary"
              >
                {{ updatingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
            </form>
          </div>

          <!-- Actividad Reciente -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
            
            <div class="space-y-3">
              <div 
                v-for="activity in recentActivity" 
                :key="activity.id"
                class="text-sm"
              >
                <div class="font-medium text-gray-900">{{ activity.description }}</div>
                <div class="text-gray-500">{{ formatDate(activity.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estado reactivo
const updating = ref(false)
const updatingPassword = ref(false)
const message = ref('')
const passwordMessage = ref('')

// Formulario de perfil
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  extension: '',
  position: '',
  hire_date: '',
  notifications: {
    email: true,
    incident_assigned: true,
    status_updates: true,
    daily_summary: false
  }
})

// Formulario de contraseña
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Estadísticas del usuario
const userStats = ref({
  incidentsCreated: 12,
  incidentsResolved: 8
})

// Actividad reciente
const recentActivity = ref([
  {
    id: 1,
    description: 'Comentario agregado en incidencia #15',
    date: '2024-12-25T14:30:00Z'
  },
  {
    id: 2,
    description: 'Incidencia #12 marcada como resuelta',
    date: '2024-12-25T11:15:00Z'
  },
  {
    id: 3,
    description: 'Perfil actualizado',
    date: '2024-12-24T16:45:00Z'
  }
])

// Computed properties
const messageClass = computed(() => {
  return message.value.includes('Error') 
    ? 'bg-red-50 border border-red-200 text-red-700'
    : 'bg-green-50 border border-green-200 text-green-700'
})

const passwordMessageClass = computed(() => {
  return passwordMessage.value.includes('Error') 
    ? 'bg-red-50 border border-red-200 text-red-700'
    : 'bg-green-50 border border-green-200 text-green-700'
})

// Methods
const getRoleName = (role) => {
  const roles = {
    admin: 'Administrador',
    department_head: 'Jefe de Departamento',
    technician: 'Técnico de Mantenimiento'
  }
  return roles[role] || 'Usuario'
}

const loadProfile = () => {
  // Cargar datos del usuario desde el store
  if (authStore.user) {
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
    profileForm.phone = authStore.user.phone || ''
    profileForm.extension = authStore.user.extension || ''
    profileForm.position = authStore.user.position || ''
    profileForm.hire_date = authStore.user.hire_date || ''
    
    // Cargar preferencias de notificación (simuladas)
    profileForm.notifications = {
      email: true,
      incident_assigned: true,
      status_updates: true,
      daily_summary: false
    }
  }
}

const updateProfile = async () => {
  updating.value = true
  message.value = ''
  
  try {
    // Simular actualización de perfil
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // En una implementación real, aquí llamarías al servicio de API
    // const result = await authStore.updateProfile(profileForm)
    
    message.value = 'Perfil actualizado exitosamente'
  } catch (error) {
    message.value = 'Error al actualizar el perfil: ' + error.message
  } finally {
    updating.value = false
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordMessage.value = 'Error: Las contraseñas no coinciden'
    return
  }
  
  updatingPassword.value = true
  passwordMessage.value = ''
  
  try {
    // Simular cambio de contraseña
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // En una implementación real:
    // await authService.changePassword({
    //   currentPassword: passwordForm.currentPassword,
    //   newPassword: passwordForm.newPassword
    // })
    
    passwordMessage.value = 'Contraseña cambiada exitosamente'
    
    // Limpiar formulario
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    passwordMessage.value = 'Error al cambiar la contraseña: ' + error.message
  } finally {
    updatingPassword.value = false
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      passwordMessage.value = ''
    }, 3000)
  }
}

const resetForm = () => {
  loadProfile()
  message.value = ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar datos al montar el componente
onMounted(() => {
  loadProfile()
})
</script>