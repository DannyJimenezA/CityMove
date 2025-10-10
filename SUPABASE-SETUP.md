# Configuración de Supabase para CityMove

Esta guía te llevará paso a paso para configurar Supabase y darle funcionalidad real a tu aplicación CityMove.

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Node.js instalado
- Proyecto CityMove clonado/descargado

## 🚀 Paso 1: Crear Proyecto en Supabase

1. **Ir a Supabase**
   - Visita [https://supabase.com](https://supabase.com)
   - Haz click en "Start your project"
   - Inicia sesión con GitHub (recomendado) o email

2. **Crear Nuevo Proyecto**
   - Click en "New Project"
   - Nombre del proyecto: `citymove` (o el que prefieras)
   - Database Password: **Guarda esta contraseña** (la necesitarás)
   - Region: Selecciona la más cercana (ej. `us-east-1`)
   - Click en "Create new project"
   - ⏳ Espera 2-3 minutos mientras se crea el proyecto

## 🔑 Paso 2: Obtener las Credenciales

1. **En el Dashboard de Supabase**
   - Ve a **Settings** (⚙️ en el menú lateral)
   - Click en **API**

2. **Copiar las credenciales:**
   - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: Es la clave pública (empieza con `eyJ...`)

   **¡IMPORTANTE!**: Copia estos valores, los necesitarás en el siguiente paso.

## 📝 Paso 3: Configurar Variables de Entorno

1. **Crear archivo `.env`** en la raíz del proyecto:
   ```bash
   # En la raíz del proyecto CityMove-App-Design
   # Copia el archivo .env.example
   cp .env.example .env
   ```

2. **Editar `.env`** y pegar tus credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   ⚠️ **Reemplaza** los valores con los que copiaste en el paso anterior.

## 🗄️ Paso 4: Crear las Tablas en la Base de Datos

1. **Ir al SQL Editor en Supabase**
   - En el dashboard de Supabase
   - Click en **SQL Editor** en el menú lateral
   - Click en "New Query"

2. **Ejecutar el esquema de la base de datos**
   - Abre el archivo `supabase-schema.sql` de tu proyecto
   - Copia TODO el contenido
   - Pégalo en el SQL Editor de Supabase
   - Click en **Run** (o presiona `Ctrl+Enter`)

3. **Verificar que se crearon las tablas**
   - Ve a **Table Editor** en el menú lateral
   - Deberías ver estas tablas:
     - ✅ `profiles`
     - ✅ `user_preferences`
     - ✅ `favorite_locations`
     - ✅ `trips`
     - ✅ `favorite_routes`

## 🔐 Paso 5: Configurar Autenticación

1. **Configurar Email Auth**
   - Ve a **Authentication** → **Providers**
   - **Email** debería estar habilitado por defecto ✅

2. **Configurar confirmación de email (Opcional)**
   - Ve a **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:5173` (para desarrollo)

3. **Desactivar confirmación de email (Solo para desarrollo)**
   - Ve a **Authentication** → **Email Templates**
   - En "Confirm signup", puedes desactivar temporalmente para desarrollo
   - O deja activo y verifica el email que te envíen

## ✅ Paso 6: Probar la Aplicación

1. **Instalar dependencias** (si no lo hiciste):
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   - Ir a `http://localhost:5173`

4. **Registrar un nuevo usuario**:
   - Click en la pestaña "Registro"
   - Completa el formulario
   - Click en "Crear Cuenta"

5. **Verificar en Supabase**:
   - Ve a **Authentication** → **Users** en Supabase
   - Deberías ver tu nuevo usuario ✅
   - Ve a **Table Editor** → **profiles**
   - Deberías ver tu perfil creado automáticamente ✅

## 🎯 Características Implementadas

### ✅ Autenticación
- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Persistencia de sesión (se mantiene al recargar)
- Verificación de email (opcional)

### ✅ Base de Datos
- **Perfiles de usuario**: Información personal extendida
- **Preferencias**: Configuración personalizada
- **Ubicaciones favoritas**: Casa, trabajo, otros
- **Viajes**: Historial completo de viajes
- **Rutas favoritas**: Rutas guardadas para acceso rápido

### ✅ Seguridad
- Row Level Security (RLS) activado
- Los usuarios solo pueden ver/editar sus propios datos
- Autenticación con JWT tokens
- Políticas de seguridad por tabla

## 📊 Funcionalidades Disponibles

### Servicios Creados

#### 1. **tripService** (`src/services/tripService.ts`)
```typescript
// Crear un viaje
await tripService.createTrip({
  origin: 'Casa',
  destination: 'Oficina',
  status: 'planned',
  route_data: {...}
});

// Obtener viajes del usuario
const trips = await tripService.getUserTrips(userId);

// Obtener estadísticas
const stats = await tripService.getUserStats(userId);
```

#### 2. **favoriteService** (`src/services/favoriteService.ts`)
```typescript
// Agregar ubicación favorita
await favoriteService.createFavoriteLocation({
  name: 'Casa',
  address: 'Mi dirección',
  type: 'home'
});

// Agregar ruta favorita
await favoriteService.createFavoriteRoute({
  name: 'Casa → Oficina',
  origin: 'Casa',
  destination: 'Oficina'
});
```

#### 3. **profileService** (`src/services/profileService.ts`)
```typescript
// Actualizar perfil
await profileService.updateUserProfile(userId, {
  full_name: 'Mi Nombre',
  phone: '123456789'
});

// Actualizar preferencias
await profileService.updateUserPreferences(userId, {
  notifications: true,
  eco_friendly: true
});
```

## 🔄 Próximos Pasos Sugeridos

### 1. Integrar los Servicios en los Componentes

Actualiza los componentes para usar datos reales de Supabase:

**Ejemplo en Dashboard:**
```typescript
import { tripService } from '../services/tripService';

function Dashboard() {
  const { user } = useAuth();
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    if (user) {
      tripService.getRecentTrips(user.id, 3)
        .then(setRecentTrips);
    }
  }, [user]);

  // Usar recentTrips en lugar de datos mock
}
```

### 2. Integrar API de Mapas (Opcional)

- Google Maps API
- Mapbox
- OpenStreetMap (gratuito)

### 3. Calcular Rutas Reales

- Google Directions API
- Mapbox Directions
- OpenRouteService (gratuito)

### 4. Almacenamiento de Imágenes

Supabase Storage para avatares:
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file);
```

## 🐛 Solución de Problemas

### Error: "Failed to fetch"
- ✅ Verifica que el `.env` existe y tiene las credenciales correctas
- ✅ Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Invalid JWT"
- ✅ Verifica que copiaste la clave `anon public` completa
- ✅ No uses la clave `service_role` (es peligrosa en el frontend)

### No se crean las tablas
- ✅ Ejecuta el script SQL completo en orden
- ✅ Verifica que no hay errores en el SQL Editor

### Usuario no se crea automáticamente en `profiles`
- ✅ Verifica que el trigger `on_auth_user_created` existe
- ✅ Ve a **Database** → **Functions** para ver los triggers

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth con React](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## 🎉 ¡Listo!

Ahora tienes una aplicación con:
- ✅ Autenticación real
- ✅ Base de datos funcional
- ✅ Usuarios persistentes
- ✅ Seguridad implementada
- ✅ API lista para usar

**Siguiente paso**: Integra los servicios en tus componentes para reemplazar los datos mock por datos reales de Supabase.

---

**¿Necesitas ayuda?** Revisa la documentación o pregunta en:
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
