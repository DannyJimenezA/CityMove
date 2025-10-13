# 🆓 Uso de CityMove SIN Google Maps API (100% Gratis)

## 🎉 ¡Buenas Noticias!

**CityMove funciona perfectamente SIN necesidad de configurar Google Maps API ni agregar tarjeta de crédito.**

El sistema usa **rutas simuladas realistas** que calculan automáticamente:
- ✅ Distancias reales entre las ubicaciones seleccionadas
- ✅ Tiempos de viaje basados en la distancia
- ✅ Costos estimados según tarifas de Costa Rica
- ✅ CO₂ ahorrado vs usar carro
- ✅ Múltiples opciones de rutas (rápida, económica, caminata)

---

## 🚀 Cómo Usar (Modo Gratis)

### 1. **NO necesitas hacer nada especial**

El sistema detecta automáticamente que no tienes Google Maps configurado y usa rutas simuladas.

### 2. **Usa la aplicación normalmente:**

#### 📍 **Planificar un Viaje:**
1. Ve a **"Planificar viaje"** (`/trip-planner`)
2. En "Desde", escribe y selecciona origen (ej: **"UCR"**)
3. En "Hasta", escribe y selecciona destino (ej: **"Teatro Nacional"**)
4. Haz clic en **"Buscar rutas"**

#### 🗺️ **El sistema calculará automáticamente:**
- Distancia real entre las dos ubicaciones (usando coordenadas GPS)
- Tiempo estimado de viaje
- Costo aproximado
- 2-3 opciones de rutas diferentes:
  - **Ruta recomendada:** Bus + caminata (más equilibrada)
  - **Ruta económica:** Más caminata, menos costo
  - **Solo caminata:** Si la distancia es menor a 5 km

#### ✨ **Las rutas varían según las ubicaciones:**
- **Distancia diferente** → Tiempo y costo diferentes
- **Ubicaciones más lejanas** → Más pasos y tiempo
- **Ubicaciones cercanas** → Opción de caminar

---

## 🎯 Ejemplo de Uso

### Caso 1: Viaje Corto

```
Origen: Parque Central de San José
Destino: Teatro Nacional
Distancia: ~0.5 km

Resultado:
- Ruta 1: Caminata (5 min, $0.00)
```

### Caso 2: Viaje Mediano

```
Origen: Universidad de Costa Rica (UCR)
Destino: Aeropuerto Juan Santamaría
Distancia: ~20 km

Resultado:
- Ruta 1: Bus Línea 45 (40 min, $2.80) ⭐ Recomendada
- Ruta 2: Bus Línea 32 + Caminata (48 min, $2.00) 💰 Económica
```

### Caso 3: Viaje Largo

```
Origen: San José
Destino: Cartago
Distancia: ~25 km

Resultado:
- Ruta 1: Bus Expreso (50 min, $3.20) ⭐ Recomendada
- Ruta 2: Tren + Caminata (58 min, $2.50) 💰 Económica
```

---

## 📊 Cálculos Automáticos

El sistema calcula todo automáticamente:

### 🗺️ **Distancia:**
```
Fórmula de Haversine (precisión GPS)
Distancia real entre coordenadas GPS de cada ubicación
```

### ⏱️ **Tiempo:**
```
Transporte público: distancia ÷ 20 km/h
Caminata: distancia ÷ 5 km/h
```

### 💵 **Costo:**
```
Tarifa base: ₡300 colones
+ (distancia_km × ₡50) por kilómetro
Convertido a dólares: total ÷ 500
```

### 🌱 **CO₂ Ahorrado:**
```
Carro: 0.12 kg CO₂/km
Transporte público: 0.04 kg CO₂/km
Caminata: 0 kg CO₂/km

CO₂ ahorrado = (CO₂_carro - CO₂_transporte) × distancia
```

---

## 🎮 Simulación Completa en ActiveTrip

Una vez que inicies un viaje, tendrás:

### ✅ **Datos Reales:**
- Todos los pasos del viaje con instrucciones
- Distancias y tiempos calculados
- Detalles de líneas de bus
- Progreso en tiempo real

### ✅ **Controles de Simulación:**
```
┌─────────────────────────────────────┐
│ ⏩ Controles de Simulación          │
├─────────────────────────────────────┤
│ [⏭️ Siguiente paso] [⏩ Finalizar] │
└─────────────────────────────────────┘
```

- **Temporizador automático** que cuenta hacia atrás
- **Botón "Siguiente paso"** para avanzar manualmente
- **Botón "Finalizar viaje"** para completar instantáneamente
- **Pausar/Reanudar** para controlar el tiempo

---

## 🔄 ¿Cuándo Cambiar a Google Maps API?

### **Usa Rutas Simuladas (Gratis) cuando:**
✅ Estás desarrollando/probando la aplicación
✅ Es un proyecto universitario o de aprendizaje
✅ No necesitas rutas 100% precisas del tráfico real
✅ No quieres agregar tarjeta de crédito

### **Cambia a Google Maps API cuando:**
🔹 Vas a desplegar en producción con usuarios reales
🔹 Necesitas rutas actualizadas con tráfico en tiempo real
🔹 Quieres horarios reales de transporte público
🔹 Necesitas precisión absoluta en las instrucciones

---

## 💡 Ventajas del Modo Simulado

### ✅ **Completamente Gratis**
- No necesitas tarjeta de crédito
- Sin límites de uso
- Sin preocupaciones de facturación

### ✅ **Rutas Realistas**
- Basadas en distancias GPS reales
- Cálculos coherentes de tiempo
- Costos estimados precisos
- Múltiples opciones de rutas

### ✅ **Totalmente Funcional**
- Todas las funcionalidades de la app funcionan
- Simulación completa del viaje
- Progreso en tiempo real
- Interfaz idéntica

### ✅ **Predictible**
- Perfecto para demos y presentaciones
- No depende de conexión a internet
- Siempre funciona igual
- Rápido y sin latencia

---

## 🛠️ Cómo Funciona Técnicamente

### Detección Automática:

```typescript
// En mapsService.ts
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Si no hay API key o es la default
if (!apiKey || apiKey === 'tu_api_key_de_google_maps') {
  console.log('🗺️ Google Maps no configurado - usando rutas simuladas');
  return getMockRoutes(origin, destination);
}

// Si hay API key, intenta usar Google Maps
try {
  return await getRealGoogleMapsRoutes(origin, destination);
} catch (error) {
  // Si falla, usa rutas simuladas como respaldo
  return getMockRoutes(origin, destination);
}
```

### Generación Dinámica de Rutas:

Las rutas NO son estáticas. El sistema:

1. **Calcula la distancia real** usando coordenadas GPS
2. **Estima el tiempo** basado en velocidades promedio
3. **Calcula el costo** según tarifas de Costa Rica
4. **Genera pasos** proporcionales a la distancia
5. **Crea múltiples opciones** (rápida, económica, caminata)

---

## 📋 Resumen

### ✅ **Lo que FUNCIONA sin Google Maps:**
- ✅ Planificación de viajes
- ✅ Búsqueda de rutas entre cualquier ubicación
- ✅ Cálculo de distancias, tiempos y costos
- ✅ Múltiples opciones de rutas
- ✅ Simulación completa del viaje
- ✅ Progreso en tiempo real
- ✅ Todos los controles de simulación
- ✅ Guardado de viajes en Supabase
- ✅ Historial de viajes
- ✅ Estadísticas

### ❌ **Lo que NO tendrás (sin Google Maps):**
- ❌ Rutas actualizadas con tráfico en tiempo real
- ❌ Horarios exactos de buses/metros
- ❌ Instrucciones de giro a giro específicas
- ❌ Alertas de retrasos en transporte público
- ❌ Mapa visual de la ruta

---

## 🎓 Perfecto para:

- 📚 **Proyectos universitarios**
- 🧪 **Desarrollo y pruebas**
- 🎯 **Demos y presentaciones**
- 💻 **Aprendizaje de React/TypeScript**
- 🚀 **Prototipos y MVP**

---

## 🎉 ¡Empieza a Usar CityMove Ahora!

```bash
# 1. Inicia el servidor
npm run dev

# 2. Abre el navegador
http://localhost:5173

# 3. Planifica tu primer viaje
- Ve a "Planificar viaje"
- Selecciona origen y destino
- ¡Disfruta las rutas simuladas!
```

**No necesitas configurar NADA más. Todo funciona automáticamente. 🚀**

---

## 🔮 Migración Futura (Opcional)

Si en el futuro decides usar Google Maps:

1. Obtén tu API key (con crédito gratis de $200/mes)
2. Agrégala al archivo `.env`
3. **¡Listo!** El sistema detecta automáticamente y usa rutas reales

No necesitas cambiar código. Todo está preparado para funcionar con ambos modos.

---

**¡Disfruta CityMove completamente gratis! 🎊🗺️**
