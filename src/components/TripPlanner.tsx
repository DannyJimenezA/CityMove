import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
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
  Zap
} from 'lucide-react';

interface TripPlannerProps {
  onBack: () => void;
  onStartTrip: (tripData: any) => void;
}

export function TripPlanner({ onBack, onStartTrip }: TripPlannerProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
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
  const [routes, setRoutes] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      alert('Por favor ingresa origen y destino');
      return;
    }

    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      setRoutes(mockRoutes);
      setIsSearching(false);
    }, 2000);
  };

  const handleStartTrip = (route: any) => {
    const tripData = {
      id: Date.now().toString(),
      origin,
      destination,
      route,
      startTime: new Date().toISOString(),
      status: 'active'
    };
    onStartTrip(tripData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Desde</Label>
                  <Input
                    id="origin"
                    placeholder="Tu ubicación actual"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Hasta</Label>
                  <Input
                    id="destination"
                    placeholder="¿A dónde quieres ir?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
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
                    {isSearching ? 'Buscando...' : 'Buscar rutas'}
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
                      {route.modes.map((mode: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 min-w-0">
                          <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                            {getModeIcon(mode.type)}
                            <span className="text-sm font-medium whitespace-nowrap">{mode.duration}</span>
                          </div>
                          {index < route.modes.length - 1 && (
                            <div className="h-px w-4 bg-gray-300"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Detailed Instructions */}
                    <div className="mt-4 space-y-2">
                      {route.modes.map((mode: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            {getModeIcon(mode.type)}
                          </div>
                          <span className="text-gray-600">{mode.instruction}</span>
                          <span className="text-gray-400">({mode.duration})</span>
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