import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  History, 
  Search,
  Filter,
  Calendar,
  Bus, 
  Train, 
  Car, 
  Bike,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Download,
  MoreVertical
} from 'lucide-react';

interface TripHistoryProps {
  onBack: () => void;
  onRepeatTrip: (trip: any) => void;
}

export function TripHistory({ onBack, onRepeatTrip }: TripHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock trip data
  const trips = [
    {
      id: '1',
      date: '2025-01-19',
      time: '08:30',
      from: 'Casa',
      to: 'Oficina',
      duration: '25 min',
      cost: '$2.50',
      modes: ['Bus', 'Metro'],
      status: 'completed',
      rating: 5,
      co2Saved: '1.2 kg',
      steps: [
        { type: 'walk', duration: '5 min', instruction: 'Camina a la parada' },
        { type: 'bus', duration: '15 min', instruction: 'Bus Línea 42' },
        { type: 'metro', duration: '8 min', instruction: 'Metro Línea Azul' }
      ]
    },
    {
      id: '2',
      date: '2025-01-18',
      time: '18:45',
      from: 'Oficina',
      to: 'Centro Comercial',
      duration: '18 min',
      cost: '$1.80',
      modes: ['Walk', 'Bus'],
      status: 'completed',
      rating: 4,
      co2Saved: '0.8 kg',
      steps: [
        { type: 'walk', duration: '8 min', instruction: 'Camina a la parada' },
        { type: 'bus', duration: '10 min', instruction: 'Bus Línea 23' }
      ]
    },
    {
      id: '3',
      date: '2025-01-17',
      time: '06:00',
      from: 'Casa',
      to: 'Aeropuerto',
      duration: '45 min',
      cost: '$4.20',
      modes: ['Metro', 'Train'],
      status: 'completed',
      rating: 5,
      co2Saved: '3.2 kg',
      steps: [
        { type: 'walk', duration: '5 min', instruction: 'Camina al metro' },
        { type: 'metro', duration: '20 min', instruction: 'Metro Línea Verde' },
        { type: 'train', duration: '20 min', instruction: 'Tren al Aeropuerto' }
      ]
    },
    {
      id: '4',
      date: '2025-01-16',
      time: '14:30',
      from: 'Centro',
      to: 'Universidad',
      duration: '30 min',
      cost: '$2.10',
      modes: ['Bus', 'Walk'],
      status: 'completed',
      rating: 3,
      co2Saved: '1.5 kg',
      steps: [
        { type: 'bus', duration: '25 min', instruction: 'Bus Línea Universidad' },
        { type: 'walk', duration: '5 min', instruction: 'Camina al campus' }
      ]
    },
    {
      id: '5',
      date: '2025-01-15',
      time: '19:15',
      from: 'Gimnasio',
      to: 'Casa',
      duration: '22 min',
      cost: '$2.00',
      modes: ['Metro'],
      status: 'completed',
      rating: 5,
      co2Saved: '1.0 kg',
      steps: [
        { type: 'walk', duration: '3 min', instruction: 'Camina al metro' },
        { type: 'metro', duration: '15 min', instruction: 'Metro Línea Roja' },
        { type: 'walk', duration: '4 min', instruction: 'Camina a casa' }
      ]
    },
    {
      id: '6',
      date: '2025-01-14',
      time: '12:00',
      from: 'Casa',
      to: 'Hospital',
      duration: '35 min',
      cost: '$3.00',
      modes: ['Bus', 'Walk'],
      status: 'cancelled',
      rating: 0,
      co2Saved: '0 kg',
      steps: []
    }
  ];

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'metro': case 'train': return <Train className="h-4 w-4" />;
      case 'car': case 'taxi': return <Car className="h-4 w-4" />;
      case 'bike': return <Bike className="h-4 w-4" />;
      case 'walk': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      case 'in-progress': return 'En progreso';
      default: return status;
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.modes.some(mode => mode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'completed' && trip.status === 'completed') ||
      (selectedFilter === 'cancelled' && trip.status === 'cancelled') ||
      (selectedFilter === 'bus' && trip.modes.some(mode => mode.toLowerCase() === 'bus')) ||
      (selectedFilter === 'metro' && trip.modes.some(mode => mode.toLowerCase().includes('metro'))) ||
      (selectedFilter === 'train' && trip.modes.some(mode => mode.toLowerCase() === 'train'));
    
    return matchesSearch && matchesFilter;
  });

  const totalStats = {
    totalTrips: trips.filter(t => t.status === 'completed').length,
    totalCost: trips.filter(t => t.status === 'completed').reduce((sum, trip) => sum + parseFloat(trip.cost.replace('$', '')), 0),
    totalTime: trips.filter(t => t.status === 'completed').reduce((sum, trip) => {
      const minutes = parseInt(trip.duration.split(' ')[0]);
      return sum + minutes;
    }, 0),
    totalCO2: trips.filter(t => t.status === 'completed').reduce((sum, trip) => sum + parseFloat(trip.co2Saved.split(' ')[0]), 0)
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Historial de viajes</h1>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalStats.totalTrips}</div>
                  <div className="text-sm text-gray-600">Viajes completados</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${totalStats.totalCost.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total gastado</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatTime(totalStats.totalTime)}</div>
                  <div className="text-sm text-gray-600">Tiempo total</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{totalStats.totalCO2.toFixed(1)} kg</div>
                  <div className="text-sm text-gray-600">CO₂ ahorrado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por origen, destino o transporte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'Todos' },
                      { value: 'completed', label: 'Completados' },
                      { value: 'cancelled', label: 'Cancelados' },
                      { value: 'bus', label: 'Bus' },
                      { value: 'metro', label: 'Metro' },
                      { value: 'train', label: 'Tren' }
                    ].map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.value)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trip List */}
          <div className="space-y-4">
            {filteredTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron viajes
                  </h3>
                  <p className="text-gray-600">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {trip.from} → {trip.to}
                          </h3>
                          <Badge className={getStatusColor(trip.status)}>
                            {getStatusText(trip.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{trip.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{trip.time}</span>
                          </span>
                          <span>{trip.duration}</span>
                          <span>{trip.cost}</span>
                        </div>
                        
                        {/* Transportation modes */}
                        <div className="flex items-center space-x-2 mb-3">
                          {trip.modes.map((mode, index) => (
                            <div key={index} className="flex items-center space-x-1">
                              <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                                {getModeIcon(mode)}
                                <span className="text-xs">{mode}</span>
                              </div>
                              {index < trip.modes.length - 1 && (
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Trip details for completed trips */}
                        {trip.status === 'completed' && (
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex">
                              {Array.from({ length: trip.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                              ))}
                            </div>
                            <span className="text-green-600">🌱 {trip.co2Saved} CO₂ ahorrado</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {trip.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRepeatTrip(trip)}
                          >
                            Repetir viaje
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expandable trip steps for completed trips */}
                    {trip.status === 'completed' && trip.steps.length > 0 && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                          Ver detalles del viaje
                        </summary>
                        <div className="mt-3 pt-3 border-t space-y-2">
                          {trip.steps.map((step, index) => (
                            <div key={index} className="flex items-center space-x-3 text-sm">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                {getModeIcon(step.type)}
                              </div>
                              <span className="text-gray-600">{step.instruction}</span>
                              <span className="text-gray-400">({step.duration})</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredTrips.length > 0 && (
            <div className="text-center">
              <Button variant="outline">
                Cargar más viajes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}