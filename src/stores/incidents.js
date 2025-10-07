import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import incidentService from '@/services/incidentService'

export const useIncidentStore = defineStore('incidents', () => {
  const incidents = ref([])
  const currentIncident = ref(null)
  const loading = ref(false)
  const filters = ref({
    status: 'all',
    priority: 'all',
    department: 'all',
    assignedTo: 'all',
    dateRange: null
  })
  
  // Getters computados
  const filteredIncidents = computed(() => {
    let filtered = incidents.value
    
    if (filters.value.status !== 'all') {
      filtered = filtered.filter(incident => incident.status === filters.value.status)
    }
    
    if (filters.value.priority !== 'all') {
      filtered = filtered.filter(incident => incident.priority === filters.value.priority)
    }
    
    if (filters.value.department !== 'all') {
      filtered = filtered.filter(incident => incident.department_id === filters.value.department)
    }
    
    if (filters.value.assignedTo !== 'all') {
      filtered = filtered.filter(incident => incident.assigned_to === filters.value.assignedTo)
    }
    
    return filtered
  })
  
  const incidentsByStatus = computed(() => {
    return {
      open: incidents.value.filter(i => i.status === 'open').length,
      in_progress: incidents.value.filter(i => i.status === 'in_progress').length,
      resolved: incidents.value.filter(i => i.status === 'resolved').length,
      closed: incidents.value.filter(i => i.status === 'closed').length
    }
  })
  
  const incidentsByPriority = computed(() => {
    return {
      low: incidents.value.filter(i => i.priority === 'low').length,
      medium: incidents.value.filter(i => i.priority === 'medium').length,
      high: incidents.value.filter(i => i.priority === 'high').length,
      critical: incidents.value.filter(i => i.priority === 'critical').length
    }
  })
  
  // Acciones
  const fetchIncidents = async () => {
    loading.value = true
    try {
      const response = await incidentService.getAll()
      incidents.value = response.data
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  const fetchIncident = async (id) => {
    loading.value = true
    try {
      const response = await incidentService.getById(id)
      currentIncident.value = response.data
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  const createIncident = async (incidentData) => {
    try {
      const response = await incidentService.create(incidentData)
      incidents.value.unshift(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const updateIncident = async (id, incidentData) => {
    try {
      const response = await incidentService.update(id, incidentData)
      const index = incidents.value.findIndex(i => i.id === id)
      if (index !== -1) {
        incidents.value[index] = response.data
      }
      if (currentIncident.value?.id === id) {
        currentIncident.value = response.data
      }
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const deleteIncident = async (id) => {
    try {
      await incidentService.delete(id)
      incidents.value = incidents.value.filter(i => i.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const assignIncident = async (id, technicianId) => {
    try {
      const response = await incidentService.assign(id, technicianId)
      const index = incidents.value.findIndex(i => i.id === id)
      if (index !== -1) {
        incidents.value[index] = response.data
      }
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const addComment = async (incidentId, comment) => {
    try {
      const response = await incidentService.addComment(incidentId, comment)
      if (currentIncident.value?.id === incidentId) {
        currentIncident.value.comments = currentIncident.value.comments || []
        currentIncident.value.comments.push(response.data)
      }
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  const clearFilters = () => {
    filters.value = {
      status: 'all',
      priority: 'all',
      department: 'all',
      assignedTo: 'all',
      dateRange: null
    }
  }
  
  return {
    incidents,
    currentIncident,
    loading,
    filters,
    filteredIncidents,
    incidentsByStatus,
    incidentsByPriority,
    fetchIncidents,
    fetchIncident,
    createIncident,
    updateIncident,
    deleteIncident,
    assignIncident,
    addComment,
    updateFilters,
    clearFilters
  }
})