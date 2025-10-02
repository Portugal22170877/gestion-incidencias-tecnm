# 🎯 Sistema de Gestión de Incidencias - TECNM Culiacán

## 📄 Descripción

Sistema completo de gestión de incidencias desarrollado con Vue.js 3, que permite a diferentes tipos de usuarios (Administradores, Jefes de Departamento y Técnicos) gestionar reportes de incidencias de manera eficiente.

## 🚀 Despliegue Rápido a Internet

### Para subir tu proyecto a internet AHORA:

1. **🌐 Ve al archivo [DEPLOY.md](./DEPLOY.md)** - Guía completa paso a paso
2. **⚡ Resumen rápido**:
   - Crea cuenta en [PlanetScale](https://planetscale.com) (base de datos gratis)
   - Crea cuenta en [Vercel](https://vercel.com) (hosting gratis)
   - Sube código a GitHub
   - Conecta GitHub con Vercel
   - ¡Listo! Tu app estará en internet en 10 minutos

### 📱 Demo para tu Profesor
- **URL**: `https://tu-app.vercel.app` (obtienes tu URL real al desplegar)
- **Usuario Admin**: `admin@tecnm.mx`
- **Contraseña**: `admin123`

---

## ✨ Características Principales

### 👥 Roles de Usuario
- **🔑 Administrador**: Gestión completa del sistema, usuarios, departamentos e incidencias
- **👔 Jefe de Departamento**: Creación de incidencias y supervisión de las de su departamento  
- **🔧 Técnico de Mantenimiento**: Recepción y resolución de incidencias asignadas

### 🛠 Funcionalidades
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Sistema de autenticación y autorización por roles
- ✅ **Gestión completa de usuarios y contraseñas**
- ✅ Creación y gestión de incidencias
- ✅ Sistema de comentarios y seguimiento
- ✅ **Reseteo de contraseñas por administrador**
- ✅ Estados de incidencia (Abierta, En Progreso, Resuelta, Cerrada)
- ✅ Niveles de prioridad (Baja, Media, Alta, Crítica)
- ✅ Interfaz responsive con Tailwind CSS
- ✅ **Generador automático de contraseñas seguras**

---

## 🔧 Desarrollo Local

### Prerrequisitos
- Node.js (versión 16 o superior)
- Backend corriendo en puerto 3001

### Instalación Rápida
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ver en: http://localhost:5173
```

---

## 📊 Credenciales de Prueba

**Administrador (acceso completo)**:
- 📧 Email: `admin@tecnm.mx`
- 🔑 Contraseña: `admin123`

**Características del admin**:
- ✅ Ver y resetear contraseñas de usuarios
- ✅ Crear nuevos usuarios con contraseñas personalizadas
- ✅ Gestionar todos los departamentos
- ✅ Acceso a panel administrativo completo

---

## 🌟 Funcionalidades Destacadas para Demostrar

### 1. 🔐 **Gestión de Contraseñas (Como Administrador)**
- Crear usuarios con contraseñas personalizadas
- Generar contraseñas aleatorias seguras
- Resetear contraseñas de cualquier usuario
- Ver contraseñas temporales para entregar a usuarios

### 2. 📱 **Interfaz Responsive**
- Funciona perfecto en móvil, tablet y desktop
- Ideal para demostrar en cualquier dispositivo

### 3. 🎨 **Diseño Profesional**
- Interfaz moderna con Tailwind CSS
- Logos e identidad visual del TECNM
- Experiencia de usuario intuitiva

---

## 🔒 Seguridad Implementada

- 🛡️ Contraseñas encriptadas con bcrypt
- 🔑 JWT para autenticación segura
- ⚡ Validación de roles y permisos
- 🔐 Variables de entorno para datos sensibles
- 📝 Solo administradores pueden gestionar usuarios

---

## 💡 Para tu Presentación

### **Flujo recomendado para demostrar**:
1. **Login como admin** (`admin@tecnm.mx` / `admin123`)
2. **Mostrar dashboard** con estadísticas
3. **Ir a gestión de usuarios** (`/admin/users`)
4. **Crear un usuario nuevo** con contraseña generada
5. **Resetear contraseña** de un usuario existente
6. **Mostrar responsive design** en móvil

### **Puntos fuertes a destacar**:
- ✅ Sistema completo y funcional
- ✅ Buenas prácticas de seguridad
- ✅ Interfaz profesional y moderna
- ✅ Roles y permisos bien definidos
- ✅ Listo para producción

---

## 📁 Archivos Importantes

- `📄 DEPLOY.md` - Guía completa de despliegue
- `🗄️ database-setup.sql` - Script para crear la base de datos
- `⚙️ vercel.json` - Configuración para Vercel
- `🔌 api/index.js` - Backend API para producción

---

## 🚀 ¿Listo para subirlo?

1. **Lee el archivo [DEPLOY.md](./DEPLOY.md)** 
2. **En 10-15 minutos tendrás tu app en internet**
3. **Comparte la URL con tu profesor**
4. **¡Presenta tu proyecto sin necesidad de tu laptop!**

---

*Sistema desarrollado para el Instituto Tecnológico Nacional de México - Campus Culiacán*

## Características Principales

### Roles de Usuario
- **Administrador**: Gestión completa del sistema, usuarios, departamentos e incidencias
- **Jefe de Departamento**: Creación de incidencias y supervisión de las de su departamento
- **Técnico de Mantenimiento**: Recepción y resolución de incidencias asignadas

### Funcionalidades
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Sistema de autenticación y autorización por roles
- ✅ Creación y gestión de incidencias
- ✅ Asignación automática y manual de técnicos
- ✅ Sistema de comentarios y seguimiento
- ✅ Filtros y búsqueda avanzada
- ✅ Adjuntos de archivos
- ✅ Estados de incidencia (Abierta, En Progreso, Resuelta, Cerrada)
- ✅ Niveles de prioridad (Baja, Media, Alta, Crítica)
- ✅ **Gestión por períodos semestrales** 📅
- ✅ **Sistema RFC para aprobación de finalización** 🔐
- ✅ **Vista detallada de incidencias con historial completo** 📋
- ✅ **Perfil de usuario completo con configuraciones** 👤
- ✅ Interfaz responsive con Tailwind CSS

### 🆕 Nuevas Funcionalidades Implementadas

#### 📅 **Gestión de Períodos Semestrales**
- Creación y gestión de períodos de 6 meses
- Visualización de incidencias agrupadas por período
- Estadísticas específicas de cada período
- Cierre de períodos por parte del administrador

#### 🔐 **Sistema de Autenticación RFC**
- Requerimiento de RFC para finalizar incidencias críticas
- Solo administradores pueden aprobar con RFC
- Registro de aprobaciones con timestamp y comentarios
- Historial de aprobaciones por incidencia

#### 📋 **Vista Detallada de Incidencias**
- Información completa de la incidencia
- Sistema de comentarios integrado
- Historial de cambios de estado
- Gestión de archivos adjuntos
- Cambio de estado según rol del usuario

#### 👤 **Perfil de Usuario Completo**
- Información personal y laboral
- Preferencias de notificaciones
- Cambio de contraseña seguro
- Estadísticas personales de actividad
- Historial de actividad reciente

## Tecnologías Utilizadas

- **Vue.js 3** - Framework frontend
- **Vue Router** - Enrutamiento
- **Pinia** - Gestión de estado
- **Tailwind CSS** - Estilos y diseño
- **Axios** - Cliente HTTP
- **Heroicons** - Iconos
- **Vite** - Build tool

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   - Copia el archivo `.env.example` a `.env`
   - Ajusta la URL del backend en `src/services/api.js`

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Compilar para producción**
   ```bash
   npm run build
   ```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── StatCard.vue    # Tarjeta de estadísticas
│   ├── StatusBadge.vue # Badge de estado
│   └── PriorityBadge.vue # Badge de prioridad
├── views/              # Vistas principales
│   ├── Login.vue       # Página de login
│   ├── Dashboard.vue   # Panel principal
│   └── incidents/      # Gestión de incidencias
├── stores/             # Stores de Pinia
│   ├── auth.js         # Autenticación
│   └── incidents.js   # Gestión de incidencias
├── services/           # Servicios API
│   ├── api.js          # Cliente base de Axios
│   ├── authService.js  # Servicios de autenticación
│   └── incidentService.js # Servicios de incidencias
├── router/             # Configuración de rutas
└── utils/              # Utilidades
```

## Credenciales de Prueba

Para probar el sistema, puedes usar estas credenciales:

- **Administrador**: 
  - Email: admin@empresa.com
  - Password: password

- **Jefe de Departamento**:
  - Email: jefe@empresa.com  
  - Password: password

- **Técnico**:
  - Email: tecnico@empresa.com
  - Password: password

## Funcionalidades por Rol

### Administrador
- ✅ Dashboard completo con estadísticas
- ✅ Gestión de usuarios y departamentos
- ✅ Visualización de todas las incidencias
- ✅ Asignación de técnicos
- ✅ Configuración del sistema

### Jefe de Departamento
- ✅ Crear nuevas incidencias
- ✅ Ver incidencias de su departamento
- ✅ Seguimiento del progreso
- ✅ Agregar comentarios

### Técnico de Mantenimiento
- ✅ Ver incidencias asignadas
- ✅ Actualizar estado de incidencias
- ✅ Agregar comentarios y notas técnicas
- ✅ Marcar como resueltas

## Estados de Incidencia

1. **Abierta** - Recién creada, pendiente de asignación
2. **En Progreso** - Asignada y siendo trabajada
3. **Resuelta** - Problema solucionado, pendiente de verificación
4. **Cerrada** - Verificada y cerrada por el usuario

## Niveles de Prioridad

- **Crítica** - Sistema completamente inoperativo
- **Alta** - Problema que impide el trabajo normal
- **Media** - Problema que dificulta el trabajo
- **Baja** - Problema menor que no afecta el trabajo

## Configuración del Backend

Este frontend está diseñado para trabajar con una API REST. Las rutas esperadas son:

```
POST /api/auth/login
GET  /api/auth/profile
POST /api/incidents
GET  /api/incidents
GET  /api/incidents/:id
PUT  /api/incidents/:id
DELETE /api/incidents/:id
PATCH /api/incidents/:id/assign
POST /api/incidents/:id/comments
```

## Personalización

### Colores y Estilos
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### API URL
Cambiar la URL base en `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://tu-backend-url.com/api'
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilación para producción
- `npm run preview` - Preview de la compilación

## Contribución

1. Fork del proyecto
2. Crear una rama para la feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Soporte

Para soporte técnico o consultas sobre el sistema, contacta al equipo de desarrollo.

## Licencia

Este proyecto es de uso interno de la empresa.