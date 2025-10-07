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
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Configuración del Sistema</h1>
        
        <!-- Tabs de configuración -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button v-for="tab in tabs" :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    class="py-2 px-1 border-b-2 font-medium text-sm">
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Configuración General -->
        <div v-show="activeTab === 'general'" class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración General</h3>
          
          <form @submit.prevent="saveConfiguration" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa</label>
                <input v-model="config.general.companyName" type="text"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
                <input v-model="config.general.contactEmail" type="email"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono de soporte</label>
                <input v-model="config.general.supportPhone" type="tel"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Zona horaria</label>
                <select v-model="config.general.timezone"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                  <option value="America/Monterrey">Monterrey (GMT-6)</option>
                  <option value="America/Cancun">Cancún (GMT-5)</option>
                  <option value="America/Tijuana">Tijuana (GMT-8)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Idioma del sistema</label>
                <select v-model="config.general.language"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Logo de la empresa</label>
                <input type="file" accept="image/*" @change="handleLogoUpload"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección de la empresa</label>
              <textarea v-model="config.general.companyAddress" rows="3"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
          </form>
        </div>

        <!-- Configuración de Incidencias -->
        <div v-show="activeTab === 'incidents'" class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Incidencias</h3>
          
          <form @submit.prevent="saveConfiguration" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo límite para respuesta (horas)</label>
                <input v-model.number="config.incidents.responseTimeLimit" type="number" min="1"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo límite para resolución (horas)</label>
                <input v-model.number="config.incidents.resolutionTimeLimit" type="number" min="1"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Auto-asignar incidencias</label>
                <select v-model="config.incidents.autoAssign"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="true">Activado</option>
                  <option value="false">Desactivado</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Requerir aprobación RFC para cerrar</label>
                <select v-model="config.incidents.requireRfcApproval"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="true">Activado</option>
                  <option value="false">Desactivado</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Máximo de archivos adjuntos</label>
                <input v-model.number="config.incidents.maxAttachments" type="number" min="1" max="10"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tamaño máximo por archivo (MB)</label>
                <input v-model.number="config.incidents.maxFileSize" type="number" min="1" max="100"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
            </div>

            <!-- Configuración de prioridades -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Configuración de Prioridades</h4>
              <div class="space-y-3">
                <div v-for="priority in config.incidents.priorities" :key="priority.id" 
                     class="flex items-center space-x-4 p-3 border rounded-lg">
                  <div class="flex-1">
                    <input v-model="priority.name" placeholder="Nombre de la prioridad"
                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  </div>
                  <div class="flex-1">
                    <input v-model="priority.color" type="color"
                           class="w-full h-10 rounded-md border-gray-300">
                  </div>
                  <div class="flex-1">
                    <input v-model.number="priority.sla" type="number" placeholder="SLA (horas)"
                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  </div>
                  <button @click="removePriority(priority.id)" type="button" 
                          class="text-red-600 hover:text-red-800">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                
                <button @click="addPriority" type="button" 
                        class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400">
                  + Agregar Prioridad
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Configuración de Notificaciones -->
        <div v-show="activeTab === 'notifications'" class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
          
          <form @submit.prevent="saveConfiguration" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Servidor SMTP</label>
                <input v-model="config.notifications.smtpHost" type="text"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Puerto SMTP</label>
                <input v-model.number="config.notifications.smtpPort" type="number"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Usuario SMTP</label>
                <input v-model="config.notifications.smtpUser" type="text"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña SMTP</label>
                <input v-model="config.notifications.smtpPassword" type="password"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email remitente</label>
                <input v-model="config.notifications.fromEmail" type="email"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Usar SSL</label>
                <select v-model="config.notifications.useSsl"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="true">Activado</option>
                  <option value="false">Desactivado</option>
                </select>
              </div>
            </div>

            <!-- Tipos de notificaciones -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Tipos de Notificaciones</h4>
              <div class="space-y-3">
                <div v-for="notification in config.notifications.types" :key="notification.id"
                     class="flex items-center justify-between p-3 border rounded-lg">
                  <div class="flex-1">
                    <h5 class="font-medium">{{ notification.name }}</h5>
                    <p class="text-sm text-gray-600">{{ notification.description }}</p>
                  </div>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input v-model="notification.email" type="checkbox" class="mr-2">
                      Email
                    </label>
                    <label class="flex items-center">
                      <input v-model="notification.system" type="checkbox" class="mr-2">
                      Sistema
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Configuración de Seguridad -->
        <div v-show="activeTab === 'security'" class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
          
          <form @submit.prevent="saveConfiguration" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo de sesión (minutos)</label>
                <input v-model.number="config.security.sessionTimeout" type="number" min="5"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Intentos de login fallidos máximos</label>
                <input v-model.number="config.security.maxLoginAttempts" type="number" min="1"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Longitud mínima de contraseña</label>
                <input v-model.number="config.security.minPasswordLength" type="number" min="6"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Requerir caracteres especiales</label>
                <select v-model="config.security.requireSpecialChars"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="true">Activado</option>
                  <option value="false">Desactivado</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Caducidad de contraseña (días)</label>
                <input v-model.number="config.security.passwordExpiry" type="number" min="0"
                       class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Autenticación de dos factores</label>
                <select v-model="config.security.twoFactorAuth"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="disabled">Desactivado</option>
                  <option value="optional">Opcional</option>
                  <option value="required">Requerido</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <!-- Botones de acción -->
        <div class="mt-8 flex justify-end space-x-4">
          <button @click="resetToDefaults" type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Restaurar Predeterminados
          </button>
          <button @click="saveConfiguration" type="button" class="btn-primary">
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estados reactivos
const activeTab = ref('general')
const config = ref({
  general: {
    companyName: 'Mi Empresa',
    contactEmail: 'contacto@miempresa.com',
    supportPhone: '555-0100',
    timezone: 'America/Mexico_City',
    language: 'es',
    companyAddress: 'Calle Principal #123, Ciudad, CP 12345',
    logo: null
  },
  incidents: {
    responseTimeLimit: 4,
    resolutionTimeLimit: 24,
    autoAssign: 'true',
    requireRfcApproval: 'true',
    maxAttachments: 5,
    maxFileSize: 10,
    priorities: [
      { id: 1, name: 'Crítica', color: '#ef4444', sla: 2 },
      { id: 2, name: 'Alta', color: '#f97316', sla: 8 },
      { id: 3, name: 'Media', color: '#eab308', sla: 24 },
      { id: 4, name: 'Baja', color: '#22c55e', sla: 72 }
    ]
  },
  notifications: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@miempresa.com',
    useSsl: 'true',
    types: [
      {
        id: 1,
        name: 'Nueva incidencia',
        description: 'Se creó una nueva incidencia',
        email: true,
        system: true
      },
      {
        id: 2,
        name: 'Incidencia asignada',
        description: 'Se asignó una incidencia a un técnico',
        email: true,
        system: true
      },
      {
        id: 3,
        name: 'Cambio de estado',
        description: 'Cambió el estado de una incidencia',
        email: true,
        system: false
      },
      {
        id: 4,
        name: 'Comentario agregado',
        description: 'Se agregó un comentario a la incidencia',
        email: false,
        system: true
      },
      {
        id: 5,
        name: 'SLA vencido',
        description: 'Se venció el tiempo límite de resolución',
        email: true,
        system: true
      }
    ]
  },
  security: {
    sessionTimeout: 120,
    maxLoginAttempts: 5,
    minPasswordLength: 8,
    requireSpecialChars: 'true',
    passwordExpiry: 90,
    twoFactorAuth: 'optional'
  }
})

// Tabs de configuración
const tabs = ref([
  { id: 'general', name: 'General' },
  { id: 'incidents', name: 'Incidencias' },
  { id: 'notifications', name: 'Notificaciones' },
  { id: 'security', name: 'Seguridad' }
])

// Cargar configuración al montar el componente
onMounted(() => {
  loadConfiguration()
})

const loadConfiguration = () => {
  // En producción, esto cargaría la configuración desde la API
  console.log('Configuración cargada')
}

const saveConfiguration = () => {
  // En producción, esto enviaría la configuración a la API
  alert('Configuración guardada correctamente')
}

const resetToDefaults = () => {
  if (confirm('¿Está seguro de restaurar la configuración predeterminada?')) {
    // Restaurar valores por defecto
    loadConfiguration()
    alert('Configuración restaurada a valores predeterminados')
  }
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // En producción, aquí se subiría el archivo al servidor
    config.value.general.logo = file.name
    alert('Logo cargado correctamente')
  }
}

const addPriority = () => {
  const newId = Math.max(...config.value.incidents.priorities.map(p => p.id)) + 1
  config.value.incidents.priorities.push({
    id: newId,
    name: '',
    color: '#6b7280',
    sla: 24
  })
}

const removePriority = (priorityId) => {
  if (config.value.incidents.priorities.length > 1) {
    const index = config.value.incidents.priorities.findIndex(p => p.id === priorityId)
    if (index !== -1) {
      config.value.incidents.priorities.splice(index, 1)
    }
  } else {
    alert('Debe haber al menos una prioridad configurada')
  }
}
</script>