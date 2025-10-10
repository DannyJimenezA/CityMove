# CityMove - Aplicación de Transporte Multimodal 🚌🚇🚴

Una aplicación moderna de planificación de viajes multimodales construida con React, TypeScript, Vite y Supabase.

**Diseño original**: [Figma - CityMove App Design](https://www.figma.com/design/FRpeGzQopIb9j4ENzweoAw/CityMove-App-Design)

## 🚀 Características

### ✅ Implementado

- **Autenticación Real con Supabase**
  - Registro de usuarios
  - Inicio de sesión
  - Cierre de sesión
  - Persistencia de sesión

- **Navegación con React Router**
  - URLs reales para cada pantalla
  - Rutas protegidas con autenticación
  - Navegación del navegador (back/forward)

- **Interfaz de Usuario Completa**
  - Dashboard interactivo
  - Planificador de viajes
  - Navegación en tiempo real
  - Historial de viajes
  - Perfil de usuario
  - Diseño responsive

- **Base de Datos Estructurada**
  - Perfiles de usuario
  - Preferencias personalizadas
  - Ubicaciones favoritas
  - Historial de viajes
  - Rutas favoritas

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratuita)

## 🔧 Instalación Rápida

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar Supabase** (IMPORTANTE)

   📖 **Sigue la guía completa en** [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)

   Resumen rápido:
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Copia `.env.example` a `.env`
   - Agrega tus credenciales de Supabase en `.env`
   - Ejecuta el script SQL en `supabase-schema.sql`

3. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
CityMove-App-Design/
├── src/
│   ├── components/          # Componentes de React
│   │   ├── AuthScreen.tsx   # Login/Registro
│   │   ├── Dashboard.tsx    # Panel principal
│   │   ├── TripPlanner.tsx  # Planificador de viajes
│   │   ├── ActiveTrip.tsx   # Viaje en progreso
│   │   ├── UserProfile.tsx  # Perfil de usuario
│   │   ├── TripHistory.tsx  # Historial
│   │   └── ui/              # Componentes UI reutilizables
│   ├── contexts/
│   │   └── AuthContext.tsx  # Contexto de autenticación
│   ├── services/            # Servicios de API
│   │   ├── tripService.ts
│   │   ├── favoriteService.ts
│   │   └── profileService.ts
│   ├── lib/
│   │   └── supabase.ts      # Cliente de Supabase
│   └── App.tsx              # Componente principal con rutas
├── supabase-schema.sql      # Esquema de base de datos
├── SUPABASE-SETUP.md        # 📖 Guía de configuración
├── RUTAS.md                 # Documentación de rutas
└── README.md                # Este archivo
```

## 🗺️ Rutas Disponibles

| Ruta | Componente | Protegida | Descripción |
|------|------------|-----------|-------------|
| `/` | AuthScreen | No | Login y registro |
| `/dashboard` | Dashboard | Sí | Panel principal |
| `/trip-planner` | TripPlanner | Sí | Planificar viaje |
| `/active-trip` | ActiveTrip | Sí | Viaje en progreso |
| `/profile` | UserProfile | Sí | Perfil de usuario |
| `/history` | TripHistory | Sí | Historial de viajes |

Ver [RUTAS.md](./RUTAS.md) para más detalles sobre el sistema de navegación.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **React Router 7** - Enrutamiento
- **Tailwind CSS** - Estilos utility-first
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos modernos

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de datos
  - Auth - Autenticación
  - Row Level Security - Seguridad a nivel de fila

## 📦 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo (puerto 5173)
npm run build        # Compila para producción
npm run preview      # Previsualiza build de producción
```

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ Row Level Security (RLS) en Supabase
- ✅ Autenticación con JWT
- ✅ Rutas protegidas en el frontend
- ✅ Validación de datos
- ✅ `.gitignore` configurado para proteger `.env`

⚠️ **IMPORTANTE**: Nunca subas tu archivo `.env` a Git

## 📚 Documentación

- 📖 [Configuración de Supabase](./SUPABASE-SETUP.md) - Guía completa paso a paso
- 📖 [Sistema de Rutas](./RUTAS.md) - Documentación de navegación
- 📖 [Esquema de BD](./supabase-schema.sql) - Estructura de la base de datos

## 🎯 Próximas Características Sugeridas

- [ ] Integración con Google Maps / Mapbox
- [ ] Cálculo de rutas reales
- [ ] Notificaciones push en tiempo real
- [ ] Compartir viajes
- [ ] Modo offline (PWA)
- [ ] Integración con APIs de transporte público
- [ ] Sistema de pagos

## 🐛 Solución de Problemas

### Error: "Missing environment variables"
**Solución**: Crea el archivo `.env` con tus credenciales de Supabase.
```bash
cp .env.example .env
# Luego edita .env con tus credenciales
```

### Build falla
**Solución**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors en el IDE
**Solución**: Reinicia el TypeScript server en VSCode:
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### No puedo hacer login
**Solución**:
1. Verifica que ejecutaste el script SQL en Supabase
2. Verifica las credenciales en `.env`
3. Revisa la consola del navegador para errores

## 👥 Autores

- Universidad Nacional de Costa Rica
- Curso: Interfaz de Usuarios 2025 II Ciclo

## 🙏 Agradecimientos

- [Figma to Code](https://www.figma.com/) - Diseño inicial
- [Supabase](https://supabase.com) - Backend as a Service
- [Radix UI](https://www.radix-ui.com/) - Componentes UI accesibles
- [shadcn/ui](https://ui.shadcn.com/) - Inspiración de diseño

---

**Nota**: Este es un proyecto académico para el curso de Interfaz de Usuarios.

Para comenzar, lee [SUPABASE-SETUP.md](./SUPABASE-SETUP.md) 📖
