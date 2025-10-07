import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Inicializar autenticación antes de montar la app
const authStore = useAuthStore()

// Función para inicializar la aplicación
const initApp = async () => {
  try {
    // Marcar que es el arranque inicial de la aplicación
    sessionStorage.setItem('appStartup', 'true')
    
    await authStore.initializeAuth()
  } catch (error) {
    console.warn('Error inicializando autenticación:', error)
  } finally {
    app.use(router)
    app.mount('#app')
  }
}

// Inicializar la aplicación
initApp()