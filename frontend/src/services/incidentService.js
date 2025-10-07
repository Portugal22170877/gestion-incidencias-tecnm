import api from './api'

const incidentService = {
  async getAll(params = {}) {
    try {
      const response = await api.get('/incidents', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener incidencias')
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/incidents/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener incidencia')
    }
  },

  async create(incidentData) {
    try {
      const response = await api.post('/incidents', incidentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear incidencia')
    }
  },

  async update(id, incidentData) {
    try {
      const response = await api.put(`/incidents/${id}`, incidentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar incidencia')
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/incidents/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar incidencia')
    }
  },

  async assign(id, technicianId) {
    try {
      const response = await api.patch(`/incidents/${id}/assign`, { 
        assigned_to: technicianId 
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al asignar incidencia')
    }
  },

  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/incidents/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar estado')
    }
  },

  async addComment(incidentId, comment) {
    try {
      const response = await api.post(`/incidents/${incidentId}/comments`, { 
        comment 
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al agregar comentario')
    }
  },

  async getComments(incidentId) {
    try {
      const response = await api.get(`/incidents/${incidentId}/comments`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener comentarios')
    }
  },

  async uploadFile(incidentId, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post(`/incidents/${incidentId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir archivo')
    }
  },

  async getStatistics() {
    try {
      const response = await api.get('/incidents/statistics')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas')
    }
  }
}

export default incidentService