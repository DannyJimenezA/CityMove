# Configuración de Google Maps API

## 📋 Requisitos Previos

Para usar las funcionalidades de rutas reales en CityMove, necesitas configurar Google Maps API.

---

## 🔑 Paso 1: Obtener una API Key de Google Maps

### 1.1 Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Select a project" en la parte superior
4. Haz clic en "NEW PROJECT"
5. Ingresa un nombre para tu proyecto (ej: "CityMove App")
6. Haz clic en "CREATE"

### 1.2 Habilitar las APIs Necesarias

Necesitas habilitar las siguientes APIs en tu proyecto:

1. **Maps JavaScript API**
   - Ve a "APIs & Services" → "Library"
   - Busca "Maps JavaScript API"
   - Haz clic en "ENABLE"

2. **Directions API**
   - Busca "Directions API"
   - Haz clic en "ENABLE"

3. **Places API** (opcional, para autocompletado mejorado)
   - Busca "Places API"
   - Haz clic en "ENABLE"

4. **Geocoding API** (opcional, para convertir direcciones en coordenadas)
   - Busca "Geocoding API"
   - Haz clic en "ENABLE"

### 1.3 Crear una API Key

1. Ve a "APIs & Services" → "Credentials"
2. Haz clic en "CREATE CREDENTIALS" → "API key"
3. Se creará tu API key (guárdala en un lugar seguro)
4. **IMPORTANTE:** Haz clic en "RESTRICT KEY" para configurar restricciones de seguridad

### 1.4 Configurar Restricciones de la API Key (Recomendado)

Para desarrollo local:
- **Application restrictions:** HTTP referrers
- **Website restrictions:** Agrega `http://localhost:*` y `http://127.0.0.1:*`

Para producción:
- Agrega tu dominio real (ej: `https://citymove.com/*`)

**API restrictions:**
- Selecciona "Restrict key"
- Marca las APIs habilitadas anteriormente

---

## ⚙️ Paso 2: Configurar el Proyecto

### 2.1 Crear el archivo .env

1. Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

2. Abre el archivo `.env` y agrega tu API key:

```env
# Supabase Configuration
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
```

### 2.2 Reiniciar el Servidor de Desarrollo

Después de configurar el `.env`, reinicia el servidor:

```bash
npm run dev
```

---

## 🚀 Cómo Funciona

### Servicio de Google Maps ([src/services/mapsService.ts](src/services/mapsService.ts))

El servicio maneja toda la integración con Google Maps:

#### Funciones Principales:

1. **`initGoogleMaps()`**
   - Inicializa el SDK de Google Maps
   - Se llama automáticamente cuando se necesita

2. **`getDirections(origin, destination)`**
   - Obtiene rutas reales entre dos ubicaciones
   - Retorna múltiples opciones de rutas:
     - Rutas con transporte público
     - Ruta caminando
   - Cada ruta incluye:
     - Pasos detallados (caminar, bus, metro, tren)
     - Distancias en metros y formato legible
     - Tiempos de cada paso
     - Costos estimados
     - CO₂ ahorrado vs usar carro
     - Detalles de transporte público (líneas, horarios, paradas)

3. **`calculateCost(distance, transitUsed)`**
   - Calcula el costo estimado basado en:
     - Tarifa base: ₡300 colones
     - Costo por km: ₡50 colones
     - Conversión a dólares (aproximado)

4. **`calculateCO2Saved(distance, transitUsed)`**
   - Calcula el CO₂ ahorrado comparado con usar carro:
     - Carro: 0.12 kg CO₂/km
     - Transporte público: 0.04 kg CO₂/km
     - Caminata/bicicleta: 0 kg CO₂/km

---

## 🗺️ Integración en TripPlanner

El componente [TripPlanner](src/components/TripPlanner.tsx) ahora:

✅ Usa el servicio de Google Maps para buscar rutas reales
✅ Aplica filtros seleccionados por el usuario:
  - Accesibilidad
  - Distancia máxima a caminar
  - Preferencia: más rápido, más económico, o eco-friendly
✅ Muestra rutas ordenadas según las preferencias
✅ Incluye datos reales de distancia, tiempo y costo

### Flujo de Búsqueda:

1. Usuario selecciona origen y destino del autocompletado
2. Usuario hace clic en "Buscar rutas"
3. Sistema llama a `getDirections()` con las ubicaciones seleccionadas
4. Google Maps API retorna múltiples opciones de rutas
5. Sistema aplica filtros del usuario
6. Rutas se muestran ordenadas por preferencia

---

## 🏃 Simulación en ActiveTrip

El componente [ActiveTrip](src/components/ActiveTrip.tsx) ahora incluye:

### ✅ Datos Reales de la Ruta:
- Todos los pasos con instrucciones reales de Google Maps
- Distancias y tiempos exactos para cada paso
- Detalles de transporte público (líneas, horarios, paradas)
- Costo total y CO₂ ahorrado

### ✅ Controles de Simulación:
- **Temporizador en tiempo real:** Cuenta regresiva automática
- **Botón "Siguiente paso":** Avanza manualmente al siguiente paso
- **Botón "Finalizar viaje":** Salta al final instantáneamente
- **Pausar/Reanudar:** Control del temporizador
- **Progreso visual:** Barra de progreso que muestra el % completado

### ✅ Indicadores Visuales:
- Paso actual destacado con borde azul
- Pasos completados marcados con ✓ verde
- Pasos pendientes en gris
- Animación de pulso en el paso activo

### Funcionalidades de Simulación:

```typescript
// Avanzar un paso manualmente
handleNextStep() → Avanza al siguiente paso y ajusta el tiempo

// Finalizar el viaje instantáneamente
handleSkipToEnd() → Va al último paso y marca como completado

// Pausar/Reanudar
setIsPaused(true/false) → Pausa o reanuda el temporizador
```

---

## 🔄 Fallback a Datos Mock

Si Google Maps API no está configurado o falla:

1. El sistema detecta automáticamente el error
2. Muestra un mensaje al usuario: "Error al buscar rutas. Verifica tu conexión o la configuración de Google Maps API."
3. Usa datos mock predefinidos como respaldo
4. El usuario puede seguir usando la aplicación con datos de ejemplo

---

## 💰 Costos de Google Maps API

### Precios (al 2025):

- **Directions API:** $5 USD por 1,000 solicitudes
- **Maps JavaScript API:** $7 USD por 1,000 cargas de mapa
- **Crédito mensual gratuito:** $200 USD

### Estimación para desarrollo:

Con $200 USD de crédito mensual gratuito, puedes hacer aproximadamente:
- **40,000 solicitudes de direcciones** al mes gratis
- Para una app en desarrollo, esto es más que suficiente

### Recomendaciones:

1. **Desarrollo:** Usa la API sin preocupaciones (dentro del crédito gratuito)
2. **Producción:** Monitorea el uso en Google Cloud Console
3. **Optimización:** Implementa caché de rutas frecuentes
4. **Alertas:** Configura alertas de facturación en Google Cloud

---

## 🐛 Solución de Problemas

### Error: "Google Maps API key not configured"

**Causa:** La API key no está en el archivo `.env`

**Solución:**
1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Asegúrate de que la variable se llama exactamente `VITE_GOOGLE_MAPS_API_KEY`
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "This API key is not authorized to use this service or API"

**Causa:** Las APIs necesarias no están habilitadas en Google Cloud Console

**Solución:**
1. Ve a Google Cloud Console → APIs & Services → Library
2. Habilita: Maps JavaScript API, Directions API, Places API
3. Espera unos minutos y vuelve a intentar

### Error: "RefererNotAllowedMapError"

**Causa:** Tu dominio no está en la lista de referrers permitidos

**Solución:**
1. Ve a Google Cloud Console → APIs & Services → Credentials
2. Haz clic en tu API key
3. En "Application restrictions" → "HTTP referrers"
4. Agrega `http://localhost:*` para desarrollo

### Las rutas no aparecen o están vacías

**Causa:** Las ubicaciones seleccionadas pueden no tener rutas de transporte público

**Solución:**
1. Verifica que ambas ubicaciones están en Costa Rica
2. Prueba con ubicaciones urbanas populares (ej: UCR → Teatro Nacional)
3. Revisa la consola del navegador para ver errores específicos

---

## 📊 Monitoreo de Uso

### Ver estadísticas de uso:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a "APIs & Services" → "Dashboard"
4. Verás gráficas de uso de cada API

### Configurar alertas de facturación:

1. Ve a "Billing" → "Budgets & alerts"
2. Crea un presupuesto (ej: $10 USD/mes)
3. Configura alertas por email cuando alcances el 50%, 90%, 100%

---

## 🔒 Seguridad

### Mejores Prácticas:

1. ✅ **NUNCA** comitas el archivo `.env` al repositorio
2. ✅ El `.env` ya está en `.gitignore`
3. ✅ Usa restricciones de API key (HTTP referrers o IP addresses)
4. ✅ Diferentes API keys para desarrollo y producción
5. ✅ Rota tu API key si crees que ha sido comprometida

### Variables de Entorno en Producción:

Para desplegar en producción (Vercel, Netlify, etc.):

1. Agrega `VITE_GOOGLE_MAPS_API_KEY` en las variables de entorno del servicio
2. Usa una API key diferente con restricciones para tu dominio de producción

---

## 📚 Recursos Adicionales

- [Documentación de Google Maps Platform](https://developers.google.com/maps/documentation)
- [Directions API Reference](https://developers.google.com/maps/documentation/directions/overview)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Google Maps Platform Support](https://developers.google.com/maps/support)

---

## ✨ Resumen

Con Google Maps API configurado, CityMove ahora puede:

✅ Generar rutas reales entre cualquier ubicación de Costa Rica
✅ Calcular distancias, tiempos y costos precisos
✅ Mostrar instrucciones paso a paso con transporte público
✅ Simular el progreso del viaje de forma realista
✅ Ofrecer múltiples opciones de rutas con diferentes criterios

**¡Disfruta las rutas reales en CityMove! 🚀🗺️**
