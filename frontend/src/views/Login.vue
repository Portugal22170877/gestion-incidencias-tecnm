<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- Logo del TECNM Culiacán -->
        <div class="mb-6">
          <img 
            src="/images/tecnm-culiacan-logo.svg" 
            alt="Instituto Tecnológico de Culiacán - TECNM"
            class="mx-auto h-20 w-auto"
          />
        </div>
        
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900">
          Sistema de Gestión de Incidencias
        </h2>
        <p class="mt-2 text-sm text-gray-600 mb-2">
          Instituto Tecnológico de Culiacán
        </p>
        <p class="text-xs text-gray-500">
          Ingresa tus credenciales para acceder
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                v-model="form.email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                v-model="form.password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="form.remember"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </div>
        </form>

        <!-- Pie de Página Institucional -->
        <div class="mt-6 pt-4 border-t border-gray-200 text-center">
          <div class="text-xs text-gray-500 space-y-1">
            <p class="font-medium">Sistema de Gestión de Incidencias</p>
            <p>Instituto Tecnológico de Culiacán</p>
            <p>Versión 1.0.0 - 2025</p>
            <p class="text-gray-400">Desarrollado para la Administración de Servicios de TI</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      // Verificar si hay una ruta guardada para redirigir
      const redirectPath = localStorage.getItem('redirectAfterLogin')
      
      if (redirectPath && redirectPath !== '/login') {
        localStorage.removeItem('redirectAfterLogin')
        router.push(redirectPath)
      } else {
        router.push('/dashboard')
      }
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error inesperado. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>