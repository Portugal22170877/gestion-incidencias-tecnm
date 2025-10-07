import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  
  // Getters computados
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userDepartment = computed(() => user.value?.department || null)
  
  // Acciones
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('redirectAfterLogin')
  }
  
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      user.value = { ...user.value, ...response.user }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const hasRole = (roles) => {
    if (!user.value) return false
    const userRoles = Array.isArray(user.value.role) ? user.value.role : [user.value.role]
    const requiredRoles = Array.isArray(roles) ? roles : [roles]
    return requiredRoles.some(role => userRoles.includes(role))
  }
  
  const canManageIncident = (incident) => {
    if (!user.value) return false
    
    // Admin puede gestionar todas las incidencias
    if (user.value.role === 'administrador') return true
    
    // Jefe de departamento puede gestionar incidencias de su departamento
    if (user.value.role === 'jefe_departamento' && 
        incident.department_id === user.value.department_id) return true
    
    // Técnico puede gestionar incidencias asignadas a él
    if (user.value.role === 'tecnico' && 
        incident.assigned_to === user.value.id) return true
    
    return false
  }
  
  // Inicializar usuario si hay token
  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        
        // Verificar que el token sigue siendo válido
        const response = await authService.getProfile()
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      } catch (error) {
        console.warn('Token inválido, cerrando sesión:', error)
        logout()
      }
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    userRole,
    userName,
    userDepartment,
    login,
    logout,
    updateProfile,
    hasRole,
    canManageIncident,
    initializeAuth
  }
})