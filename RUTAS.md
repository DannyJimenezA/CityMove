# Sistema de Rutas - CityMove App

## Descripción General

El proyecto ahora cuenta con un sistema de rutas completo utilizando **React Router v7**, que permite navegación entre diferentes pantallas con URLs reales y rutas protegidas que requieren autenticación.

## Estructura de Rutas

### Rutas Públicas

#### `/` - Pantalla de Autenticación (Login/Registro)
- **Componente**: `AuthScreen`
- **Descripción**: Pantalla inicial donde los usuarios pueden iniciar sesión o registrarse
- **Funcionalidad**:
  - Login con email y contraseña
  - Registro de nuevos usuarios
  - Login demo rápido
  - Redirige a `/dashboard` después del login exitoso

### Rutas Protegidas

Todas estas rutas requieren que el usuario esté autenticado. Si intentas acceder sin estar logueado, serás redirigido automáticamente a `/`.

#### `/dashboard` - Panel Principal
- **Componente**: `Dashboard`
- **Descripción**: Vista principal de la aplicación después del login
- **Funcionalidad**:
  - Resumen de viajes recientes
  - Acceso rápido a planificar viajes
  - Estadísticas del mes
  - Rutas favoritas
  - Navegación a otras secciones

#### `/trip-planner` - Planificador de Viajes
- **Componente**: `TripPlanner`
- **Descripción**: Herramienta para planificar nuevos viajes multimodales
- **Funcionalidad**:
  - Búsqueda de rutas desde origen a destino
  - Filtros de viaje (accesible, más rápido, económico, eco-friendly)
  - Selección de hora de salida
  - Comparación de diferentes rutas
  - Inicio de viaje activo

#### `/active-trip` - Viaje en Progreso
- **Componente**: `ActiveTrip`
- **Descripción**: Vista de navegación en tiempo real durante un viaje activo
- **Funcionalidad**:
  - Seguimiento paso a paso del viaje
  - Instrucciones de navegación
  - Mapa interactivo
  - Pausar/reanudar viaje
  - Finalizar viaje
  - **Nota**: Recibe datos del viaje a través de `state` en la navegación

#### `/profile` - Perfil de Usuario
- **Componente**: `UserProfile`
- **Descripción**: Configuración de perfil y preferencias del usuario
- **Funcionalidad**:
  - Editar información personal
  - Configurar preferencias de viaje
  - Gestionar métodos de pago
  - Ubicaciones favoritas
  - Estadísticas personales
  - Cerrar sesión

#### `/history` - Historial de Viajes
- **Componente**: `TripHistory`
- **Descripción**: Historial completo de viajes realizados
- **Funcionalidad**:
  - Lista de todos los viajes pasados
  - Búsqueda y filtrado
  - Detalles de cada viaje
  - Repetir viajes anteriores
  - Exportar datos

## Arquitectura del Sistema

### 1. Context API - Autenticación

**Archivo**: `src/contexts/AuthContext.tsx`

```typescript
- AuthProvider: Proveedor del contexto de autenticación
- useAuth(): Hook para acceder al estado de autenticación
- Funciones disponibles:
  - login(user): Autenticar usuario
  - logout(): Cerrar sesión
  - user: Información del usuario actual
  - isAuthenticated: Estado de autenticación
```

### 2. Rutas Protegidas

**Archivo**: `src/components/PrivateRoute.tsx`

Componente que envuelve las rutas que requieren autenticación. Si el usuario no está autenticado, lo redirige automáticamente a la página de login (`/`).

### 3. Configuración de Rutas

**Archivo**: `src/App.tsx`

El archivo principal contiene:
- `BrowserRouter`: Enrutador principal de React Router
- `AuthProvider`: Proveedor del contexto de autenticación
- `Routes`: Contenedor de todas las rutas
- Configuración de cada ruta con su componente correspondiente

## Navegación Entre Pantallas

### Usando el hook `useNavigate()`

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navegación simple
navigate('/dashboard');

// Navegación con datos (state)
navigate('/active-trip', { state: { tripData } });

// Navegar hacia atrás
navigate(-1);
```

### Recibir Datos en la Navegación

```typescript
import { useLocation } from 'react-router-dom';

const location = useLocation();
const tripData = location.state?.tripData;
```

## Flujo de Navegación Típico

1. **Inicio**: Usuario accede a `/` (AuthScreen)
2. **Login**: Usuario inicia sesión → Redirige a `/dashboard`
3. **Planificar viaje**: Click en "Planificar viaje" → `/trip-planner`
4. **Iniciar viaje**: Selecciona ruta → `/active-trip` (con datos del viaje)
5. **Finalizar**: Completa viaje → Regresa a `/dashboard`
6. **Ver historial**: Click en "Historial" → `/history`
7. **Perfil**: Click en avatar → `/profile`
8. **Logout**: Cierra sesión desde perfil → Regresa a `/`

## Protección de Rutas

El componente `PrivateRoute` verifica la autenticación:

```typescript
if (!isAuthenticated) {
  return <Navigate to="/" replace />;
}
```

Esto garantiza que solo usuarios autenticados puedan acceder a:
- Dashboard
- Trip Planner
- Active Trip
- Profile
- History

## Ventajas del Nuevo Sistema

1. **URLs reales**: Cada pantalla tiene su propia URL, permitiendo:
   - Bookmarks/favoritos
   - Compartir enlaces específicos
   - Navegación del navegador (back/forward)

2. **Rutas protegidas**: Seguridad automática en rutas que requieren autenticación

3. **Navegación declarativa**: Código más limpio y mantenible

4. **Estado persistente**: El contexto de autenticación mantiene el estado del usuario

5. **SEO-friendly**: URLs semánticas y navegables

## Próximos Pasos Sugeridos

1. **Persistencia de sesión**: Implementar localStorage o sessionStorage para mantener la sesión después de refrescar
2. **Lazy Loading**: Cargar componentes de rutas bajo demanda para mejorar rendimiento
3. **Animaciones de transición**: Agregar transiciones suaves entre rutas
4. **Rutas dinámicas**: Implementar rutas con parámetros como `/trip/:tripId`
5. **Breadcrumbs**: Agregar navegación de migas de pan
6. **404 Page**: Crear página personalizada para rutas no encontradas

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Estructura de Archivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── components/
│   ├── PrivateRoute.tsx         # Componente de rutas protegidas
│   ├── AuthScreen.tsx           # Pantalla de login/registro
│   ├── Dashboard.tsx            # Dashboard principal
│   ├── TripPlanner.tsx          # Planificador de viajes
│   ├── ActiveTrip.tsx           # Viaje activo
│   ├── UserProfile.tsx          # Perfil de usuario
│   └── TripHistory.tsx          # Historial de viajes
└── App.tsx                      # Configuración de rutas principal
```

---

**Nota**: Este es un prototipo funcional. Las funciones de backend (autenticación real, almacenamiento de viajes, etc.) están simuladas con mocks y deberán ser implementadas con un backend real en el futuro.
