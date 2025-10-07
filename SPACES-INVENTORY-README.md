# 🏢 Módulo de Gestión de Espacios e Inventario

Este módulo permite a los **jefes de departamento** gestionar completamente los espacios físicos de su área y llevar un inventario detallado del equipamiento que contienen.

## ✨ Características Principales

### 🏛️ Gestión de Espacios
- **Registro de espacios**: Aulas, cubículos, laboratorios, oficinas, salas de juntas
- **Información detallada**: Ubicación, capacidad, área en m², responsable
- **Estados**: Activo, inactivo, en mantenimiento
- **Códigos QR**: Generación automática para identificación rápida

### 📦 Inventario de Equipos
- **Categorías predefinidas**: Mobiliario, tecnología, audio/video, herramientas, etc.
- **Información completa**: Marca, modelo, número de serie, fecha de compra
- **Control de estados**: Activo, prestado, mantenimiento, baja
- **Condiciones**: Excelente, bueno, regular, malo, fuera de servicio
- **Valorización**: Registro de precios y cálculo de valores totales

### 🔧 Gestión de Mantenimiento
- **Programación**: Mantenimiento semanal, mensual, trimestral, semestral, anual
- **Historial completo**: Registro de todas las intervenciones
- **Tipos**: Preventivo, correctivo, revisión, calibración, limpieza
- **Proveedores externos**: Control de servicios tercerizados

### 📊 Reportes y Analytics
- **Estadísticas por espacio**: Total de equipos, valor del inventario
- **Estado del inventario**: Equipos que necesitan atención
- **Exportación**: Reportes en Excel/PDF (próximamente)
- **Vista consolidada**: Inventario por departamento

## 👥 Roles y Permisos

### 🔑 Administrador
- ✅ Ver todos los espacios de todos los departamentos
- ✅ Crear, editar y eliminar cualquier espacio
- ✅ Gestionar inventario de cualquier espacio
- ✅ Acceso a reportes consolidados

### 👔 Jefe de Departamento
- ✅ Ver y gestionar solo los espacios de su departamento
- ✅ Crear nuevos espacios en su área
- ✅ Administrar completamente el inventario de sus espacios
- ✅ Generar reportes de su departamento

### 🔧 Técnico
- 👁️ Solo visualización (sin permisos de edición)

## 🚀 Instalación

### 1. Ejecutar Migración de Base de Datos
```bash
# Desde la raíz del proyecto
install-spaces-module.bat
```

### 2. Verificar Instalación
1. Inicia el backend: `cd backend && npm run dev`
2. Inicia el frontend: `cd frontend && npm run dev`
3. Accede como jefe de departamento o administrador
4. Ve al Dashboard y busca "Gestión de Espacios"

## 🗃️ Estructura de Base de Datos

### Tablas Principales
- **`spaces`**: Espacios físicos (aulas, cubículos, etc.)
- **`equipment_categories`**: Categorías de equipos
- **`equipment`**: Inventario de equipos
- **`maintenance_history`**: Historial de mantenimiento

### Categorías de Equipos Predefinidas
- 🪑 **Mobiliario**: Mesas, sillas, escritorios, estantes
- 💻 **Tecnología**: Computadoras, laptops, tablets
- 📽️ **Audio y Video**: Proyectores, pantallas, bocinas
- 🔧 **Herramientas**: Herramientas de trabajo y mantenimiento
- 💡 **Iluminación**: Lámparas, focos, reflectores
- 🔌 **Conectividad**: Cables, adaptadores, extensiones
- ⌨️ **Periféricos**: Monitores, teclados, ratones, impresoras
- ❄️ **Aire Acondicionado**: Aires acondicionados, ventiladores
- 🛡️ **Seguridad**: Cámaras, cerraduras, extintores
- 🏠 **Electrodomésticos**: Refrigeradores, microondas, cafeteras
- 📚 **Material Didáctico**: Pizarrones, marcadores, material educativo
- 📦 **Otro**: Equipos que no encajan en otras categorías

## 🎯 Casos de Uso Típicos

### Jefe de Departamento - Primera Configuración
1. **Registrar espacios**: Aula A-101, Cubículo Director, Lab. Sistemas
2. **Agregar equipos**: 30 mesas, 60 sillas, 1 proyector, 25 computadoras
3. **Configurar mantenimiento**: Limpieza semanal, revisión mensual
4. **Generar códigos QR**: Para identificación rápida de espacios

### Mantenimiento de Inventario
1. **Actualizar condiciones**: Marcar equipos dañados
2. **Registrar reparaciones**: Historial de mantenimientos
3. **Control de préstamos**: Equipos prestados a otros departamentos
4. **Gestión de bajas**: Equipos dados de baja por obsolescencia

### Reportes y Control
1. **Revisión mensual**: Estado general del inventario
2. **Planificación presupuestal**: Valor total del equipamiento
3. **Identificación de necesidades**: Equipos que requieren reemplazo
4. **Auditorías**: Reportes para control administrativo

## 🔗 Navegación

### Acceso Directo
- **URL**: `/spaces`
- **Desde Dashboard**: Botón "Gestión de Espacios"

### Flujo de Navegación
1. **Lista de Espacios** → Crear/editar espacios
2. **Inventario por Espacio** → Gestionar equipos específicos
3. **Formularios Detallados** → Información completa de equipos

## 🔮 Próximas Funcionalidades

### Versión 1.1
- 📱 **Códigos QR funcionales**: Escaneo para acceso rápido
- 📄 **Exportación de reportes**: Excel, PDF
- 📷 **Fotos de equipos**: Galería de imágenes
- 🔔 **Notificaciones**: Mantenimientos programados

### Versión 1.2
- 📱 **App móvil**: Inventario desde dispositivos móviles
- 🏷️ **Etiquetas inteligentes**: Códigos de barras y RFID
- 📈 **Analytics avanzados**: Tendencias y proyecciones
- 🔄 **Integración**: Sistemas externos de inventario

## 🐛 Solución de Problemas

### Error: "No se pueden cargar los espacios"
- Verificar que el backend esté ejecutándose
- Confirmar que la migración de BD se ejecutó correctamente
- Revisar permisos de usuario

### Error: "No aparece el menú de espacios"
- Verificar que el usuario tenga rol de `jefe_departamento` o `administrador`
- Limpiar caché del navegador
- Verificar que las rutas estén configuradas correctamente

### Error en la base de datos
- Ejecutar nuevamente `install-spaces-module.bat`
- Verificar que MySQL esté ejecutándose
- Confirmar permisos de la base de datos

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de TI del TECNM Culiacán.

---

**Sistema de Gestión de Incidencias - TECNM Culiacán**  
*Módulo de Espacios e Inventario v1.0*