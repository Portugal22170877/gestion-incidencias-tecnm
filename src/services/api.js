import axios from 'axios'

// Configuración temporal: usar Supabase directamente
const API_BASE_URL = 'https://duacxiqdmrlpporfpkeh.supabase.co/rest/v1'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YWN4aXFkbXJscHBvcmZwa2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MjE5NDcsImV4cCI6MjA0MzM5Nzk0N30.0NSGHGm8Zq8nAPX_RNELFUQi68gJ-lYR-rYQN0z90YI'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  }
})

export default apiClient