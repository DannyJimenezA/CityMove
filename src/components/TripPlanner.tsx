import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { LocationAutocomplete } from './LocationAutocomplete';
import type { Location } from '../data/locations';
import { getDirections, type TripRoute } from '../services/mapsService';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Filter,
  Bus,
  Train,
  Car,
  Bike,
  Route,
  Star,
  Accessibility,
  DollarSign,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function TripPlanner() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [departureTime, setDepartureTime] = useState('now');
  const [customTime, setCustomTime] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    accessible: false,
    fastest: true,
    cheapest: false,
    ecoFriendly: false,
    maxWalking: 10
  });
  const [routes, setRoutes] = useState<TripRoute[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock route data
  const mockRoutes = [
    {
      id: '1',
      duration: '28 min',
      walking: '8 min',
      cost: '$2.50',
      co2: '1.2 kg',
      modes: [
        { type: 'walk', duration: '5 min', instruction: 'Camina a la parada de bus' },
        { type: 'bus', duration: '15 min', instruction: 'Bus Línea 42 hacia Centro' },
        { type: 'walk', duration: '3 min', instruction: 'Camina al Metro' },
        { type: 'metro', duration: '8 min', instruction: 'Metro Línea Azul' },
        { type: 'walk', duration: '2 min', instruction: 'Camina al destino' }
      ],
      rating: 4.5,
      accessibility: true,
      recommended: true
    },
    {
      id: '2',
      duration: '35 min',
      walking: '12 min',
      cost: '$1.80',
      co2: '0.8 kg',
      modes: [
        { type: 'walk', duration: '8 min', instruction: 'Camina a la estación de tren' },
        { type: 'train', duration: '22 min', instruction: 'Tren Regional hasta Plaza Central' },
        { type: 'walk', duration: '5 min', instruction: 'Camina al destino' }
      ],
      rating: 4.2,
      accessibility: true,
      recommended: false
    },
    {
      id: '3',
      duration: '22 min',
      walking: '6 min',
      cost: '$3.20',
      co2: '1.8 kg',
      modes: [
        { type: 'walk', duration: '3 min', instruction: 'Camina a la parada' },
        { type: 'bus', duration: '19 min', instruction: 'Bus Expreso 101' },
        { type: 'walk', duration: '3 min', instruction: 'Camina al destino' }
      ],
      rating: 4.7,
      accessibility: false,
      recommended: false
    }
  ];

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-4 w-4 text-blue-600" />;
      case 'metro': case 'train': return <Train className="h-4 w-4 text-green-600" />;
      case 'walk': return <MapPin className="h-4 w-4 text-gray-600" />;
      case 'bike': return <Bike className="h-4 w-4 text-orange-600" />;
      case 'car': return <Car className="h-4 w-4 text-red-600" />;
      default: return <Route className="h-4 w-4" />;
    }
  };

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError('Por favor ingresa origen y destino');
      return;
    }

    if (!selectedOrigin || !selectedDestination) {
      setError('Por favor selecciona ubicaciones de la lista');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const foundRoutes = await getDirections(selectedOrigin, selectedDestination);

      // Aplicar filtros
      let filteredRoutes = foundRoutes;

      if (filters.accessible) {
        filteredRoutes = filteredRoutes.filter(r => r.accessibility);
      }

      if (filters.maxWalking) {
        filteredRoutes = filteredRoutes.filter(
          r => r.walkingMeters <= filters.maxWalking * 1000
        );
      }

      // Ordenar según preferencias
      if (filters.fastest) {
        filteredRoutes.sort((a, b) => a.durationMinutes - b.durationMinutes);
      } else if (filters.cheapest) {
        filteredRoutes.sort((a, b) => a.costValue - b.costValue);
      } else if (filters.ecoFriendly) {
        filteredRoutes.sort((a, b) => b.co2Value - a.co2Value);
      }

      setRoutes(filteredRoutes);

      if (filteredRoutes.length === 0) {
        setError('No se encontraron rutas disponibles con los filtros seleccionados');
      }
    } catch (err) {
      console.error('Error searching routes:', err);
      setError('Error al buscar rutas. Verifica tu conexión o la configuración de Google Maps API.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartTrip = (route: TripRoute) => {
    const tripData = {
      id: Date.now().toString(),
      origin: selectedOrigin?.name || origin,
      destination: selectedDestination?.name || destination,
      originLocation: selectedOrigin,
      destinationLocation: selectedDestination,
      route,
      startTime: new Date().toISOString(),
      status: 'active'
    };
    navigate('/active-trip', { state: { tripData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Planificar viaje</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                <span>¿A dónde vamos?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Desde</Label>
                  <LocationAutocomplete
                    id="origin"
                    placeholder="Escribe tu ubicación de origen..."
                    value={origin}
                    onChange={(value) => setOrigin(value)}
                    onLocationSelect={(location) => setSelectedOrigin(location)}
                  />
                  {selectedOrigin && (
                    <p className="text-xs text-gray-500">
                      📍 {selectedOrigin.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Hasta</Label>
                  <LocationAutocomplete
                    id="destination"
                    placeholder="Escribe tu destino..."
                    value={destination}
                    onChange={(value) => setDestination(value)}
                    onLocationSelect={(location) => setSelectedDestination(location)}
                  />
                  {selectedDestination && (
                    <p className="text-xs text-gray-500">
                      📍 {selectedDestination.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora de salida</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                  >
                    <option value="now">Ahora</option>
                    <option value="custom">Hora específica</option>
                  </select>
                  {departureTime === 'custom' && (
                    <Input
                      type="datetime-local"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                    />
                  )}
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="mr-2"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                  <Button
                    onClick={handleSearch}
                    className="flex-1"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Buscando rutas...
                      </>
                    ) : (
                      'Buscar rutas'
                    )}
                  </Button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <h4 className="font-medium">Preferencias de viaje</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accessible" className="flex items-center space-x-2">
                        <Accessibility className="h-4 w-4" />
                        <span>Accesible</span>
                      </Label>
                      <Switch 
                        id="accessible"
                        checked={filters.accessible}
                        onCheckedChange={(checked) => setFilters({...filters, accessible: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fastest" className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Más rápido</span>
                      </Label>
                      <Switch 
                        id="fastest"
                        checked={filters.fastest}
                        onCheckedChange={(checked) => setFilters({...filters, fastest: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cheapest" className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Más barato</span>
                      </Label>
                      <Switch 
                        id="cheapest"
                        checked={filters.cheapest}
                        onCheckedChange={(checked) => setFilters({...filters, cheapest: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="eco" className="flex items-center space-x-2">
                        <span>🌱</span>
                        <span>Eco-friendly</span>
                      </Label>
                      <Switch 
                        id="eco"
                        checked={filters.ecoFriendly}
                        onCheckedChange={(checked) => setFilters({...filters, ecoFriendly: checked})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          {routes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rutas encontradas</h3>
              {routes.map((route) => (
                <Card key={route.id} className={`${route.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{route.duration}</div>
                          <div className="text-sm text-gray-500">duración</div>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {route.recommended && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Star className="h-3 w-3 mr-1" />
                                Recomendado
                              </Badge>
                            )}
                            {route.accessibility && (
                              <Badge variant="outline">
                                <Accessibility className="h-3 w-3 mr-1" />
                                Accesible
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>📍 {route.distance}</span>
                            <span>🚶 {route.walking}</span>
                            <span>💰 {route.cost}</span>
                            <span>🌱 {route.co2} CO₂</span>
                            <span>⭐ {route.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleStartTrip(route)}>
                        Iniciar viaje
                      </Button>
                    </div>

                    {/* Route Steps */}
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {route.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 min-w-0">
                          <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                            {getModeIcon(step.type)}
                            <span className="text-sm font-medium whitespace-nowrap">{step.duration}</span>
                          </div>
                          {index < route.steps.length - 1 && (
                            <div className="h-px w-4 bg-gray-300"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Detailed Instructions */}
                    <div className="mt-4 space-y-2">
                      {route.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            {getModeIcon(step.type)}
                          </div>
                          <span className="text-gray-600 flex-1">{step.instruction}</span>
                          <span className="text-gray-500">{step.distance}</span>
                          <span className="text-gray-400">({step.duration})</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {routes.length === 0 && !isSearching && (
            <Card>
              <CardContent className="text-center py-12">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Busca tu próximo destino
                </h3>
                <p className="text-gray-600">
                  Ingresa tu origen y destino para encontrar las mejores rutas multimodales
                </p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isSearching && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Buscando las mejores rutas...
                </h3>
                <p className="text-gray-600">
                  Analizando opciones de transporte público, tiempos y costos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}