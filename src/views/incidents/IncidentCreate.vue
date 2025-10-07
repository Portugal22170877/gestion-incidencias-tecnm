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

    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Nueva Incidencia</h1>
          <p class="mt-1 text-sm text-gray-600">
            Completa el formulario para reportar una nueva incidencia
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <!-- Título -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Título *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Resumen breve del problema"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Descripción *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe detalladamente el problema, incluyendo pasos para reproducirlo si aplica"
            ></textarea>
          </div>

          <!-- Prioridad -->
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700">
              Prioridad *
            </label>
            <select
              id="priority"
              v-model="form.priority"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecciona una prioridad</option>
              <option value="low">Baja - Problema menor que no afecta el trabajo</option>
              <option value="medium">Media - Problema que dificulta el trabajo</option>
              <option value="high">Alta - Problema que impide el trabajo normal</option>
              <option value="critical">Crítica - Sistema completamente inoperativo</option>
            </select>
          </div>

          <!-- Departamento -->
          <div>
            <label for="department" class="block text-sm font-medium text-gray-700">
              Departamento Afectado *
            </label>
            <select
              id="department"
              v-model="form.department_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecciona un departamento</option>
              <option value="1">Sistemas e Informática</option>
              <option value="2">Recursos Humanos</option>
              <option value="3">Contabilidad</option>
              <option value="4">Ventas</option>
              <option value="5">Producción</option>
              <option value="6">Mantenimiento</option>
            </select>
          </div>

          <!-- Categoría -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="category"
              v-model="form.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Red/Conectividad</option>
              <option value="security">Seguridad</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <!-- Ubicación -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Oficina 203, Planta Baja, Sala de Servidores"
            />
          </div>

          <!-- Asignar a (solo para admins) -->
          <div v-if="authStore.hasRole('admin')">
            <label for="assigned_to" class="block text-sm font-medium text-gray-700">
              Asignar a
            </label>
            <select
              id="assigned_to"
              v-model="form.assigned_to"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sin asignar</option>
              <option value="1">Juan Pérez - Técnico de Sistemas</option>
              <option value="2">María García - Técnico de Hardware</option>
              <option value="3">Carlos López - Técnico de Redes</option>
            </select>
          </div>

          <!-- Adjuntar archivo -->
          <div>
            <label for="attachment" class="block text-sm font-medium text-gray-700">
              Adjuntar archivo
            </label>
            <input
              id="attachment"
              ref="fileInput"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
              @change="handleFileChange"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="mt-1 text-xs text-gray-500">
              Formatos permitidos: JPG, PNG, PDF, DOC, TXT. Máximo 5MB por archivo.
            </p>
            
            <!-- Lista de archivos seleccionados -->
            <div v-if="selectedFiles.length > 0" class="mt-2">
              <h4 class="text-sm font-medium text-gray-700">Archivos seleccionados:</h4>
              <ul class="mt-1 space-y-1">
                <li 
                  v-for="(file, index) in selectedFiles" 
                  :key="index"
                  class="flex items-center justify-between text-sm text-gray-600"
                >
                  <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                  <button 
                    @click="removeFile(index)"
                    type="button"
                    class="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-6">
            <router-link 
              to="/incidents"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Creando...' : 'Crear Incidencia' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useIncidentStore } from '@/stores/incidents'

const router = useRouter()
const authStore = useAuthStore()
const incidentStore = useIncidentStore()

const loading = ref(false)
const error = ref('')
const fileInput = ref(null)
const selectedFiles = ref([])

const form = reactive({
  title: '',
  description: '',
  priority: '',
  department_id: authStore.userDepartment?.id || '',
  category: '',
  location: '',
  assigned_to: null
})

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  
  // Validar tamaño de archivos
  const maxSize = 5 * 1024 * 1024 // 5MB
  const validFiles = files.filter(file => {
    if (file.size > maxSize) {
      alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`)
      return false
    }
    return true
  })
  
  selectedFiles.value = [...selectedFiles.value, ...validFiles]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Crear el objeto de datos de la incidencia
    const incidentData = {
      ...form,
      files: selectedFiles.value
    }
    
    const result = await incidentStore.createIncident(incidentData)
    
    if (result.success) {
      router.push(`/incidents/${result.data.id}`)
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error inesperado al crear la incidencia'
  } finally {
    loading.value = false
  }
}
</script>