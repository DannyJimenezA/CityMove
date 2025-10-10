import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tripService } from '../services/tripService';
import type { Trip } from '../services/tripService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
  MoreVertical,
  Loader2
} from 'lucide-react';

export function TripHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar viajes del usuario desde Supabase
  useEffect(() => {
    const loadTrips = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userTrips = await tripService.getUserTrips(user.id);
        setTrips(userTrips);
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [user]);

  // Filtrar viajes por búsqueda y filtros
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      searchTerm === '' ||
      trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase());

    // Obtener los modos de transporte del route_data
    const modes = trip.route_data?.modes || [];

    const matchesFilter =
      selectedFilter === 'all' ||
      trip.status === selectedFilter ||
      (selectedFilter === 'bus' && modes.some((mode: string) => mode.toLowerCase() === 'bus')) ||
      (selectedFilter === 'metro' && modes.some((mode: string) => mode.toLowerCase().includes('metro'))) ||
      (selectedFilter === 'train' && modes.some((mode: string) => mode.toLowerCase() === 'train'));

    return matchesSearch && matchesFilter;
  });

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

  // Calcular estadísticas totales de viajes completados
  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalStats = {
    totalTrips: completedTrips.length,
    totalCost: completedTrips.reduce((sum, trip) => sum + (trip.cost || 0), 0),
    totalTime: completedTrips.reduce((sum, trip) => sum + (trip.duration_minutes || 0), 0),
    totalCO2: completedTrips.reduce((sum, trip) => sum + (trip.co2_saved || 0), 0)
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
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
            {loading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Cargando viajes...</p>
                </CardContent>
              </Card>
            ) : filteredTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {trips.length === 0 ? 'No tienes viajes aún' : 'No se encontraron viajes'}
                  </h3>
                  <p className="text-gray-600">
                    {trips.length === 0 ? 'Planifica tu primer viaje para verlo aquí' : 'Intenta ajustar tus filtros de búsqueda'}
                  </p>
                  {trips.length === 0 && (
                    <Button onClick={() => navigate('/trip-planner')} className="mt-4">
                      Planificar viaje
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredTrips.map((trip) => {
                // Extraer datos del trip
                const date = trip.created_at ? new Date(trip.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : '';
                const time = trip.start_time || (trip.created_at ? new Date(trip.created_at).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '');
                const modes = trip.route_data?.modes || [];
                const steps = trip.route_data?.steps || [];
                const duration = trip.duration_minutes ? `${trip.duration_minutes} min` : '';
                const cost = trip.cost ? `$${trip.cost.toFixed(2)}` : '';

                return (
                  <Card key={trip.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {trip.origin} → {trip.destination}
                            </h3>
                            <Badge className={getStatusColor(trip.status)}>
                              {getStatusText(trip.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{time}</span>
                            </span>
                            {duration && <span>{duration}</span>}
                            {cost && <span>{cost}</span>}
                          </div>

                          {/* Transportation modes */}
                          {modes.length > 0 && (
                            <div className="flex items-center space-x-2 mb-3">
                              {modes.map((mode: string, index: number) => (
                                <div key={index} className="flex items-center space-x-1">
                                  <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                                    {getModeIcon(mode)}
                                    <span className="text-xs">{mode}</span>
                                  </div>
                                  {index < modes.length - 1 && (
                                    <ChevronRight className="h-3 w-3 text-gray-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Trip details for completed trips */}
                          {trip.status === 'completed' && (
                            <div className="flex items-center space-x-4 text-sm">
                              {trip.rating && trip.rating > 0 && (
                                <div className="flex">
                                  {Array.from({ length: trip.rating || 0 }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                  ))}
                                </div>
                              )}
                              {trip.co2_saved && trip.co2_saved > 0 && (
                                <span className="text-green-600">🌱 {trip.co2_saved.toFixed(1)} kg CO₂ ahorrado</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {trip.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('/trip-planner', { state: { trip } })}
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
                      {trip.status === 'completed' && steps.length > 0 && (
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                            Ver detalles del viaje
                          </summary>
                          <div className="mt-3 pt-3 border-t space-y-2">
                            {steps.map((step: any, index: number) => (
                              <div key={index} className="flex items-center space-x-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                  {getModeIcon(step.type || step.mode || 'walk')}
                                </div>
                                <span className="text-gray-600">{step.instruction || step.description || 'Paso del viaje'}</span>
                                <span className="text-gray-400">({step.duration || step.duration_minutes ? `${step.duration_minutes} min` : ''})</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                );
              })
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