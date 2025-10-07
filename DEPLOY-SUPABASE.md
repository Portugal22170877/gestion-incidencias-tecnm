# 🚀 Guía de Despliegue con Supabase + Vercel

## 📋 Paso a Paso Completo

### 1. 🗄️ Configurar Supabase (Base de Datos)

#### Crear proyecto en Supabase:
1. Ve a [supabase.com](https://supabase.com)
2. Crea cuenta (GitHub, Google o email)
3. Clic en "New project"
4. Configuración:
   - **Name**: `gestion-incidencias`
   - **Database Password**: `Admin123456!` (anótalaa)
   - **Region**: South America (São Paulo) o la más cercana
   - **Pricing Plan**: Free (0$/mes)
5. Clic en "Create new project"

#### Configurar la base de datos:
1. **Espera 2-3 minutos** que se cree el proyecto
2. Ve a la pestaña **"SQL Editor"** (en el menú lateral)
3. **Copia y pega** el contenido del archivo `database-setup-supabase.sql`
4. **Clic en "RUN"** para ejecutar el script
5. Deberías ver: "Departamentos creados" y "Usuarios creados"

#### Obtener credenciales:
1. Ve a **"Settings"** > **"Database"**
2. En **"Connection string"** encontrarás algo como:
   ```
   postgresql://postgres:Admin123456!@db.abc123xyz.supabase.co:5432/postgres
   ```
3. **Copia esta URL completa** - la necesitarás para Vercel

### 2. 🌐 Desplegar en Vercel

#### Subir código a GitHub:
1. **Ve a [github.com](https://github.com) y crea cuenta**
2. **Crea nuevo repositorio**: `gestion-incidencias`
3. **En tu terminal, ejecuta**:
   ```bash
   git init
   git add .
   git commit -m "Sistema Gestión Incidencias - TECNM"
   git remote add origin https://github.com/TU_USUARIO/gestion-incidencias.git
   git push -u origin main
   ```

#### Desplegar en Vercel:
1. **Ve a [vercel.com](https://vercel.com)**
2. **Crea cuenta con GitHub**
3. **Clic en "New Project"**
4. **Importa tu repositorio** `gestion-incidencias`
5. **Configuración**:
   - Framework Preset: **Vite**
   - Root Directory: **/** (dejar por defecto)
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Variables de entorno en Vercel:
**ANTES de hacer deploy**, agrega estas variables:

```
DATABASE_URL = tu_url_completa_de_supabase_aqui
JWT_SECRET = mi_clave_secreta_super_segura_123
NODE_ENV = production
```

6. **Clic en "Deploy"**
7. **Espera 2-3 minutos**

### 3. ✅ Verificar que funciona

1. **Abre la URL** que te da Vercel (algo como `https://gestion-incidencias-abc123.vercel.app`)
2. **Credenciales de prueba**:
   - Email: `admin@tecnm.mx`
   - Contraseña: `admin123`
3. **Prueba funcionalidades**:
   - Login de administrador
   - Dashboard con estadísticas
   - Gestión de usuarios (`/admin/users`)
   - Crear/resetear contraseñas

## 🎯 Para tu Presentación

### **URL de demo**: `https://tu-proyecto.vercel.app`
### **Credenciales**: 
- **Admin**: `admin@tecnm.mx` / `admin123`
- **Jefe Dpto**: `juan.perez@tecnm.mx` / `admin123`
- **Técnico**: `maria.gonzalez@tecnm.mx` / `admin123`

### **Flujo de demostración**:
1. **Login como admin**
2. **Mostrar dashboard**
3. **Ir a gestión de usuarios**
4. **Crear nuevo usuario**
5. **Resetear contraseña**
6. **Mostrar en móvil** (responsive)

## 🔧 Comandos útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Subir cambios
git add .
git commit -m "Actualización"
git push
```

## 🆘 Solución de problemas

### Error de conexión a base de datos:
- Verificar que la URL de Supabase esté completa en Vercel
- Revisar que el proyecto de Supabase esté activo

### Error 404 en API:
- Verificar que `vercel.json` esté en la raíz
- Revisar que las variables de entorno estén configuradas

### Error de CORS:
- Verificar que el dominio en `api/index.js` coincida con Vercel

## 💰 Costos

- **Supabase**: Gratis hasta 500MB
- **Vercel**: Gratis hasta 100GB bandwidth
- **GitHub**: Gratis para repositorios públicos
- **Total**: **$0/mes** para demos y presentaciones

¡Tu aplicación estará lista para presentar en menos de 30 minutos!