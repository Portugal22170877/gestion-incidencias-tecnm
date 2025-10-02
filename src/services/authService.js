import api from './api'

const authService = {
  async login(credentials) {
    try {
      // Login real usando el backend
      const response = await api.post('/login', credentials)
      
      if (response.data.success) {
        return {
          token: response.data.token,
          user: response.data.user
        }
      } else {
        throw new Error(response.data.message || 'Credenciales inválidas')
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error(error.message || 'Error en el login')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro')
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Incluso si falla, limpiamos el localStorage
      console.error('Error al cerrar sesión:', error)
    }
  },

  async getProfile() {
    try {
      // Para demo, retornamos los datos del usuario guardados en localStorage
      const userString = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (token && userString) {
        const user = JSON.parse(userString)
        return { user }
      }
      
      throw new Error('Token inválido')
    } catch (error) {
      throw new Error(error.message || 'Error al obtener perfil')
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil')
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña')
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al solicitar recuperación')
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al restablecer contraseña')
    }
  }
}

export default authService