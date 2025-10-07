import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar vistas
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import AdminPanel from '@/views/admin/AdminPanel.vue'
import UserManagement from '@/views/admin/UserManagement.vue'
import DepartmentManagement from '@/views/admin/DepartmentManagement.vue'
import SystemConfiguration from '@/views/admin/SystemConfiguration.vue'
import IncidentList from '@/views/incidents/IncidentList.vue'
import IncidentCreate from '@/views/incidents/IncidentCreate.vue'
import IncidentDetail from '@/views/incidents/IncidentDetail.vue'
import IncidentPeriods from '@/views/incidents/IncidentPeriods.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  {
    path: '/',
    redirect: to => {
      // Al arrancar la aplicación, siempre ir al login
      // Solo redirigir al dashboard si se navega explícitamente a "/"
      return '/login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresRole: 'administrador' }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiresRole: 'administrador' }
  },
  {
    path: '/admin/departments',
    name: 'DepartmentManagement',
    component: DepartmentManagement,
    meta: { requiresAuth: true, requiresRole: 'administrador' }
  },
  {
    path: '/admin/configuration',
    name: 'SystemConfiguration',
    component: SystemConfiguration,
    meta: { requiresAuth: true, requiresRole: 'administrador' }
  },
  {
    path: '/incidents',
    name: 'IncidentList',
    component: IncidentList,
    meta: { requiresAuth: true }
  },
  {
    path: '/incidents/periods',
    name: 'IncidentPeriods',
    component: IncidentPeriods,
    meta: { requiresAuth: true }
  },
  {
    path: '/incidents/create',
    name: 'IncidentCreate',
    component: IncidentCreate,
    meta: { requiresAuth: true, requiresRole: ['administrador', 'jefe_departamento'] }
  },
  {
    path: '/incidents/:id',
    name: 'IncidentDetail',
    component: IncidentDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAppStartup = sessionStorage.getItem('appStartup') === 'true'
  
  // Si es el arranque inicial de la aplicación, limpiar redirecciones
  if (isAppStartup) {
    localStorage.removeItem('redirectAfterLogin')
    sessionStorage.removeItem('appStartup')
  }
  
  // Si la aplicación se está cargando por primera vez, esperar a que se inicialice la auth
  if (!authStore.user && localStorage.getItem('token')) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.warn('Error al inicializar auth en router:', error)
    }
  }
  
  // Si requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Solo guardar la ruta si NO es arranque inicial y hay navegación previa
    if (from.name && !isAppStartup) {
      localStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    next('/login')
    return
  }
  
  // Si requiere ser invitado pero está autenticado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Verificar si hay una ruta guardada para redirigir (solo si no es arranque inicial)
    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath && redirectPath !== '/login' && !isAppStartup) {
      localStorage.removeItem('redirectAfterLogin')
      next(redirectPath)
      return
    }
    next('/dashboard')
    return
  }
  
  // Verificar roles si es necesario
  if (to.meta.requiresRole) {
    const requiredRoles = Array.isArray(to.meta.requiresRole) 
      ? to.meta.requiresRole 
      : [to.meta.requiresRole]
    
    if (!authStore.hasRole(requiredRoles)) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router