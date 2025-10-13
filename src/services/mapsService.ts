import { Loader } from '@googlemaps/js-api-loader';
import type { Location } from '../data/locations';

// Tipos personalizados para las rutas
export interface RouteStep {
  type: 'walk' | 'bus' | 'metro' | 'train' | 'bike' | 'transit';
  instruction: string;
  distance: string;
  distanceMeters: number;
  duration: string;
  durationMinutes: number;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  transitDetails?: {
    line: string;
    vehicle: string;
    departure: string;
    arrival: string;
    numStops: number;
  };
}

export interface TripRoute {
  id: string;
  duration: string;
  durationMinutes: number;
  distance: string;
  distanceMeters: number;
  walking: string;
  walkingMeters: number;
  cost: string;
  costValue: number;
  co2: string;
  co2Value: number;
  steps: RouteStep[];
  rating: number;
  accessibility: boolean;
  recommended: boolean;
  polyline?: string;
  bounds?: google.maps.LatLngBounds;
}

// Inicializar el loader de Google Maps
let loader: Loader | null = null;
let googleMaps: typeof google | null = null;

export async function initGoogleMaps(): Promise<typeof google> {
  if (googleMaps) return googleMaps;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('Google Maps API key not found. Using mock data.');
    throw new Error('Google Maps API key not configured');
  }

  if (!loader) {
    loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry', 'directions'],
    });
  }

  googleMaps = await loader.load();
  return googleMaps;
}

// Calcular costo estimado basado en distancia y modo de transporte
function calculateCost(distanceMeters: number, transitUsed: boolean): number {
  const distanceKm = distanceMeters / 1000;

  if (transitUsed) {
    // Tarifa base de transporte público en Costa Rica
    const baseFare = 300; // colones
    const perKmCost = 50; // colones por km
    const totalColones = baseFare + (distanceKm * perKmCost);
    return totalColones / 500; // Convertir a dólares (aproximado)
  } else {
    // Solo caminata o bicicleta
    return 0;
  }
}

// Calcular CO2 ahorrado vs usar carro
function calculateCO2Saved(distanceMeters: number, transitUsed: boolean): number {
  const distanceKm = distanceMeters / 1000;
  const carCO2PerKm = 0.12; // kg de CO2 por km en carro
  const transitCO2PerKm = 0.04; // kg de CO2 por km en transporte público

  if (transitUsed) {
    return (carCO2PerKm - transitCO2PerKm) * distanceKm;
  } else {
    // Caminata o bicicleta: todo el CO2 del carro es ahorrado
    return carCO2PerKm * distanceKm;
  }
}

// Mapear tipo de vehículo de Google a nuestro tipo
function mapTransitType(vehicleType?: string): RouteStep['type'] {
  if (!vehicleType) return 'walk';

  const type = vehicleType.toLowerCase();
  if (type.includes('bus')) return 'bus';
  if (type.includes('metro') || type.includes('subway')) return 'metro';
  if (type.includes('train') || type.includes('rail')) return 'train';
  if (type.includes('walk')) return 'walk';

  return 'transit';
}

// Obtener rutas usando Google Directions API
export async function getDirections(
  origin: Location,
  destination: Location
): Promise<TripRoute[]> {
  // Verificar si Google Maps API está configurada
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Si no hay API key o es la default, usar datos mock mejorados directamente
  if (!apiKey || apiKey === 'tu_api_key_de_google_maps') {
    console.log('🗺️ Google Maps API no configurada - usando rutas simuladas realistas');
    return getMockRoutes(origin, destination);
  }

  try {
    const google = await initGoogleMaps();
    const directionsService = new google.maps.DirectionsService();

    // Solicitar rutas con transporte público
    const transitRequest: google.maps.DirectionsRequest = {
      origin: origin.coordinates
        ? new google.maps.LatLng(origin.coordinates.lat, origin.coordinates.lng)
        : origin.address,
      destination: destination.coordinates
        ? new google.maps.LatLng(destination.coordinates.lat, destination.coordinates.lng)
        : destination.address,
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: {
        modes: [
          google.maps.TransitMode.BUS,
          google.maps.TransitMode.RAIL,
          google.maps.TransitMode.SUBWAY,
          google.maps.TransitMode.TRAIN,
        ],
        routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
      },
      provideRouteAlternatives: true,
      region: 'CR', // Costa Rica
    };

    const transitResult = await directionsService.route(transitRequest);

    // También solicitar ruta caminando
    const walkingRequest: google.maps.DirectionsRequest = {
      origin: origin.coordinates
        ? new google.maps.LatLng(origin.coordinates.lat, origin.coordinates.lng)
        : origin.address,
      destination: destination.coordinates
        ? new google.maps.LatLng(destination.coordinates.lat, destination.coordinates.lng)
        : destination.address,
      travelMode: google.maps.TravelMode.WALKING,
    };

    const walkingResult = await directionsService.route(walkingRequest);

    const routes: TripRoute[] = [];

    // Procesar rutas de transporte público
    if (transitResult.routes) {
      transitResult.routes.forEach((route, index) => {
        const leg = route.legs[0];
        if (!leg) return;

        let totalWalkingMeters = 0;
        let hasTransit = false;

        const steps: RouteStep[] = leg.steps.map((step) => {
          const isWalking = step.travel_mode === 'WALKING';
          const distance = step.distance?.value || 0;

          if (isWalking) {
            totalWalkingMeters += distance;
          } else {
            hasTransit = true;
          }

          const routeStep: RouteStep = {
            type: isWalking ? 'walk' : mapTransitType(step.transit?.line.vehicle.type),
            instruction: step.instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
            distance: step.distance?.text || '',
            distanceMeters: distance,
            duration: step.duration?.text || '',
            durationMinutes: Math.round((step.duration?.value || 0) / 60),
            startLocation: {
              lat: step.start_location.lat(),
              lng: step.start_location.lng(),
            },
            endLocation: {
              lat: step.end_location.lat(),
              lng: step.end_location.lng(),
            },
          };

          // Agregar detalles de transporte si es tránsito
          if (step.transit) {
            routeStep.transitDetails = {
              line: step.transit.line.short_name || step.transit.line.name,
              vehicle: step.transit.line.vehicle.name,
              departure: step.transit.departure_time?.text || '',
              arrival: step.transit.arrival_time?.text || '',
              numStops: step.transit.num_stops || 0,
            };
          }

          return routeStep;
        });

        const distanceMeters = leg.distance?.value || 0;
        const durationMinutes = Math.round((leg.duration?.value || 0) / 60);
        const cost = calculateCost(distanceMeters, hasTransit);
        const co2 = calculateCO2Saved(distanceMeters, hasTransit);

        routes.push({
          id: `transit-${index}`,
          duration: leg.duration?.text || '',
          durationMinutes,
          distance: leg.distance?.text || '',
          distanceMeters,
          walking: `${Math.round(totalWalkingMeters / 1000 * 10) / 10} km`,
          walkingMeters: totalWalkingMeters,
          cost: `$${cost.toFixed(2)}`,
          costValue: cost,
          co2: `${co2.toFixed(1)} kg`,
          co2Value: co2,
          steps,
          rating: 4.5 - (index * 0.3),
          accessibility: totalWalkingMeters < 1000,
          recommended: index === 0,
          polyline: route.overview_polyline,
          bounds: route.bounds,
        });
      });
    }

    // Agregar ruta caminando
    if (walkingResult.routes && walkingResult.routes[0]) {
      const route = walkingResult.routes[0];
      const leg = route.legs[0];

      const steps: RouteStep[] = leg.steps.map((step) => ({
        type: 'walk',
        instruction: step.instructions.replace(/<[^>]*>/g, ''),
        distance: step.distance?.text || '',
        distanceMeters: step.distance?.value || 0,
        duration: step.duration?.text || '',
        durationMinutes: Math.round((step.duration?.value || 0) / 60),
        startLocation: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng(),
        },
        endLocation: {
          lat: step.end_location.lat(),
          lng: step.end_location.lng(),
        },
      }));

      const distanceMeters = leg.distance?.value || 0;
      const durationMinutes = Math.round((leg.duration?.value || 0) / 60);
      const co2 = calculateCO2Saved(distanceMeters, false);

      routes.push({
        id: 'walking',
        duration: leg.duration?.text || '',
        durationMinutes,
        distance: leg.distance?.text || '',
        distanceMeters,
        walking: leg.distance?.text || '',
        walkingMeters: distanceMeters,
        cost: '$0.00',
        costValue: 0,
        co2: `${co2.toFixed(1)} kg`,
        co2Value: co2,
        steps,
        rating: 4.0,
        accessibility: distanceMeters < 2000,
        recommended: false,
        polyline: route.overview_polyline,
        bounds: route.bounds,
      });
    }

    return routes;
  } catch (error) {
    console.error('Error getting directions:', error);

    // Si falla, retornar datos mock
    return getMockRoutes(origin, destination);
  }
}

// Función de respaldo con datos mock mejorados si Google Maps falla
function getMockRoutes(origin: Location, destination: Location): TripRoute[] {
  // Calcular distancia aproximada entre las dos ubicaciones
  const originCoords = origin.coordinates || { lat: 9.9336, lng: -84.0771 };
  const destCoords = destination.coordinates || { lat: 9.9396, lng: -84.0731 };
  const distanceMeters = calculateDistance(originCoords, destCoords);
  const distanceKm = distanceMeters / 1000;

  // Estimar tiempo basado en distancia (promedio 20 km/h para transporte público)
  const estimatedMinutes = Math.round((distanceKm / 20) * 60);
  const walkingMinutes = Math.round((distanceKm / 5) * 60); // 5 km/h caminando

  // Calcular costo y CO2
  const cost = calculateCost(distanceMeters, true);
  const co2 = calculateCO2Saved(distanceMeters, true);
  const walkCo2 = calculateCO2Saved(distanceMeters, false);

  // Distribuir la distancia en pasos
  const walkToStop = Math.min(400, distanceMeters * 0.1);
  const transitDistance = distanceMeters - (walkToStop * 2);
  const walkToDestination = walkToStop;

  const walkToStopMinutes = Math.max(3, Math.round(walkToStop / 80)); // ~80m/min caminando
  const transitMinutes = Math.max(10, estimatedMinutes - (walkToStopMinutes * 2));
  const walkToDestMinutes = walkToStopMinutes;

  const routes: TripRoute[] = [];

  // Ruta 1: Bus + Caminata (recomendada)
  routes.push({
    id: 'mock-bus',
    duration: `${estimatedMinutes} min`,
    durationMinutes: estimatedMinutes,
    distance: `${distanceKm.toFixed(1)} km`,
    distanceMeters: Math.round(distanceMeters),
    walking: `${((walkToStop * 2) / 1000).toFixed(1)} km`,
    walkingMeters: Math.round(walkToStop * 2),
    cost: `$${cost.toFixed(2)}`,
    costValue: cost,
    co2: `${co2.toFixed(1)} kg`,
    co2Value: co2,
    steps: [
      {
        type: 'walk',
        instruction: `Camina hacia la parada de bus más cercana a ${origin.name}`,
        distance: `${Math.round(walkToStop)} m`,
        distanceMeters: Math.round(walkToStop),
        duration: `${walkToStopMinutes} min`,
        durationMinutes: walkToStopMinutes,
        startLocation: originCoords,
        endLocation: {
          lat: originCoords.lat + 0.002,
          lng: originCoords.lng + 0.002,
        },
      },
      {
        type: 'bus',
        instruction: `Toma el Bus Línea ${Math.floor(Math.random() * 80) + 10} hacia ${destination.city}`,
        distance: `${(transitDistance / 1000).toFixed(1)} km`,
        distanceMeters: Math.round(transitDistance),
        duration: `${transitMinutes} min`,
        durationMinutes: transitMinutes,
        startLocation: {
          lat: originCoords.lat + 0.002,
          lng: originCoords.lng + 0.002,
        },
        endLocation: {
          lat: destCoords.lat - 0.002,
          lng: destCoords.lng - 0.002,
        },
        transitDetails: {
          line: `${Math.floor(Math.random() * 80) + 10}`,
          vehicle: 'Bus',
          departure: 'En 5 min',
          arrival: `+${transitMinutes} min`,
          numStops: Math.max(3, Math.floor(distanceKm * 2)),
        },
      },
      {
        type: 'walk',
        instruction: `Camina hasta ${destination.name}`,
        distance: `${Math.round(walkToDestination)} m`,
        distanceMeters: Math.round(walkToDestination),
        duration: `${walkToDestMinutes} min`,
        durationMinutes: walkToDestMinutes,
        startLocation: {
          lat: destCoords.lat - 0.002,
          lng: destCoords.lng - 0.002,
        },
        endLocation: destCoords,
      },
    ],
    rating: 4.5,
    accessibility: walkToStop < 500,
    recommended: true,
  });

  // Ruta 2: Más económica (más caminata, menos transporte)
  if (distanceKm > 2) {
    const economicWalkDistance = distanceMeters * 0.3;
    const economicTransitDistance = distanceMeters * 0.7;
    const economicCost = cost * 0.7;
    const economicMinutes = estimatedMinutes + 8;

    routes.push({
      id: 'mock-economic',
      duration: `${economicMinutes} min`,
      durationMinutes: economicMinutes,
      distance: `${distanceKm.toFixed(1)} km`,
      distanceMeters: Math.round(distanceMeters),
      walking: `${(economicWalkDistance / 1000).toFixed(1)} km`,
      walkingMeters: Math.round(economicWalkDistance),
      cost: `$${economicCost.toFixed(2)}`,
      costValue: economicCost,
      co2: `${(co2 * 1.2).toFixed(1)} kg`,
      co2Value: co2 * 1.2,
      steps: [
        {
          type: 'walk',
          instruction: `Camina desde ${origin.name} hacia la estación`,
          distance: `${Math.round(economicWalkDistance * 0.4)} m`,
          distanceMeters: Math.round(economicWalkDistance * 0.4),
          duration: `${Math.round((economicWalkDistance * 0.4) / 80)} min`,
          durationMinutes: Math.round((economicWalkDistance * 0.4) / 80),
          startLocation: originCoords,
          endLocation: {
            lat: originCoords.lat + 0.004,
            lng: originCoords.lng + 0.003,
          },
        },
        {
          type: 'bus',
          instruction: `Bus Línea ${Math.floor(Math.random() * 50) + 20} (ruta económica)`,
          distance: `${(economicTransitDistance / 1000).toFixed(1)} km`,
          distanceMeters: Math.round(economicTransitDistance),
          duration: `${Math.round(economicTransitDistance / 300)} min`,
          durationMinutes: Math.round(economicTransitDistance / 300),
          startLocation: {
            lat: originCoords.lat + 0.004,
            lng: originCoords.lng + 0.003,
          },
          endLocation: {
            lat: destCoords.lat - 0.003,
            lng: destCoords.lng - 0.004,
          },
          transitDetails: {
            line: `${Math.floor(Math.random() * 50) + 20}`,
            vehicle: 'Bus',
            departure: 'En 8 min',
            arrival: `+${Math.round(economicTransitDistance / 300)} min`,
            numStops: Math.max(5, Math.floor(distanceKm * 3)),
          },
        },
        {
          type: 'walk',
          instruction: `Camina hasta ${destination.name}`,
          distance: `${Math.round(economicWalkDistance * 0.6)} m`,
          distanceMeters: Math.round(economicWalkDistance * 0.6),
          duration: `${Math.round((economicWalkDistance * 0.6) / 80)} min`,
          durationMinutes: Math.round((economicWalkDistance * 0.6) / 80),
          startLocation: {
            lat: destCoords.lat - 0.003,
            lng: destCoords.lng - 0.004,
          },
          endLocation: destCoords,
        },
      ],
      rating: 4.2,
      accessibility: false,
      recommended: false,
    });
  }

  // Ruta 3: Solo caminata (si la distancia lo permite)
  if (distanceKm < 5) {
    routes.push({
      id: 'mock-walking',
      duration: `${walkingMinutes} min`,
      durationMinutes: walkingMinutes,
      distance: `${distanceKm.toFixed(1)} km`,
      distanceMeters: Math.round(distanceMeters),
      walking: `${distanceKm.toFixed(1)} km`,
      walkingMeters: Math.round(distanceMeters),
      cost: '$0.00',
      costValue: 0,
      co2: `${walkCo2.toFixed(1)} kg`,
      co2Value: walkCo2,
      steps: [
        {
          type: 'walk',
          instruction: `Camina desde ${origin.name} hacia ${destination.name}`,
          distance: `${distanceKm.toFixed(1)} km`,
          distanceMeters: Math.round(distanceMeters),
          duration: `${walkingMinutes} min`,
          durationMinutes: walkingMinutes,
          startLocation: originCoords,
          endLocation: destCoords,
        },
      ],
      rating: 4.0,
      accessibility: distanceMeters < 2000,
      recommended: false,
    });
  }

  return routes;
}

// Función auxiliar para calcular distancia entre dos puntos
export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}
