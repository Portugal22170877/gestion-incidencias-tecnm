# 🚀 Guía de Despliegue - Sistema de Gestión de Incidencias

## 📋 Preparación para Despliegue

### 1. Preparar Base de Datos Remota

#### Opción A: PlanetScale (Recomendada - Gratis)
1. Ve a [planetscale.com](https://planetscale.com) y crea una cuenta gratuita
2. Crea una nueva base de datos llamada `gestion-incidencias`
3. Ejecuta estas consultas SQL en el dashboard de PlanetScale:

```sql
-- Crear tabla de departamentos
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE users (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('administrador', 'jefe_departamento', 'tecnico') NOT NULL,
  departamento_id INT,
  rfc VARCHAR(13),
  telefono VARCHAR(20),
  activo ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (departamento_id) REFERENCES departments(id)
);

-- Insertar departamentos de ejemplo
INSERT INTO departments (nombre, descripcion) VALUES
('Tecnologías de la Información', 'Departamento de TI y sistemas'),
('Recursos Humanos', 'Gestión de personal'),
('Contabilidad', 'Departamento financiero'),
('Administración', 'Administración general');

-- Crear usuario administrador por defecto (contraseña: admin123)
INSERT INTO users (nombre_usuario, correo, password_hash, rol, departamento_id) VALUES
('Administrador', 'admin@tecnm.mx', '$2b$10$8K1p/a9UOkknWxs.h5.rYuO97qE6KJ0bV7UM9mLJWvA4kgBZz7BG.', 'administrador', 1);
```

#### Opción B: ClearDB (Heroku MySQL)
1. Ve a [cleardb.com](https://cleardb.com) y crea una cuenta
2. Crea una base de datos MySQL gratuita
3. Ejecuta las mismas consultas SQL de arriba

### 2. Configurar Vercel

#### Paso 1: Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta con GitHub
2. Conecta tu repositorio de GitHub con el proyecto

#### Paso 2: Subir código a GitHub
```bash
# En la carpeta del proyecto frontend
git init
git add .
git commit -m "Initial commit - Sistema Gestión Incidencias"
git remote add origin https://github.com/TU_USUARIO/gestion-incidencias.git
git push -u origin main
```

#### Paso 3: Desplegar en Vercel
1. En Vercel, haz clic en "New Project"
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno:

**Variables de entorno requeridas:**
```
DB_HOST=your-planetscale-host.com
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=gestion_incidencias
JWT_SECRET=tu_jwt_secreto_super_seguro_cambiar
NODE_ENV=production
```

4. Haz clic en "Deploy"

### 3. Actualizar CORS en el código

Después del primer despliegue, actualiza el archivo `api/index.js` con tu dominio real:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-app-real.vercel.app'] // ⚠️ CAMBIAR POR TU DOMINIO REAL
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))
```

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## 🌐 URLs de Acceso

- **Frontend**: `https://tu-app.vercel.app`
- **API**: `https://tu-app.vercel.app/api`
- **Panel Admin**: `https://tu-app.vercel.app/admin`

## 👤 Credenciales de Administrador

- **Email**: `admin@tecnm.mx`
- **Contraseña**: `admin123`

## 🛠 Solución de Problemas

### Error de CORS
- Verificar que el dominio en `api/index.js` coincida con tu URL de Vercel
- Revisar las variables de entorno en Vercel

### Error de Base de Datos
- Verificar las credenciales de la base de datos
- Confirmar que las tablas se crearon correctamente

### Error 404 en API
- Verificar que el archivo `api/index.js` esté en la ubicación correcta
- Revisar que `vercel.json` esté configurado correctamente

## 📱 Demo para Profesor

1. **Acceso**: Compartir URL de Vercel
2. **Credenciales**: Proporcionar email y contraseña de admin
3. **Funcionalidades a mostrar**:
   - Login de administrador
   - Gestión de usuarios
   - Reseteo de contraseñas
   - Panel administrativo
   - Responsive design

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- JWT para autenticación
- Validación de roles y permisos
- Variables de entorno para datos sensibles