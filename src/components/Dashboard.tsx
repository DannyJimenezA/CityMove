import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tripService } from '../services/tripService';
import { favoriteService } from '../services/favoriteService';
import type { Trip } from '../services/tripService';
import type { FavoriteRoute } from '../services/favoriteService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  MapPin,
  Clock,
  Navigation,
  History,
  User,
  Bus,
  Train,
  Car,
  Plus,
  ChevronRight,
  Star,
  Zap,
  Loader2
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentLocation] = useState("Centro de la Ciudad");
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState<FavoriteRoute[]>([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalTime: '0h 0m',
    co2Saved: '0',
    totalMoney: '0',
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos reales de Supabase
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Cargar viajes recientes, rutas favoritas y estadísticas en paralelo
        const [trips, routes, userStats] = await Promise.all([
          tripService.getRecentTrips(user.id, 3),
          favoriteService.getFavoriteRoutes(user.id),
          tripService.getUserStats(user.id),
        ]);

        setRecentTrips(trips);
        setFavoriteRoutes(routes);
        setStats({
          totalTrips: userStats.totalTrips,
          totalTime: userStats.totalTimeFormatted,
          co2Saved: userStats.totalCO2Saved,
          totalMoney: userStats.totalMoney,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'metro': case 'tren': return <Train className="h-4 w-4" />;
      case 'car': case 'taxi': return <Car className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">CityMove</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Navigation className="h-4 w-4" />
                <span>{currentLocation}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user.name}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-semibold mb-2">
              ¡Hola, {user.name.split(' ')[0]}!
            </h2>
            <p className="text-blue-100 mb-4">
              ¿A dónde te gustaría ir hoy?
            </p>
            <Button
              onClick={() => navigate('/trip-planner')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Planificar nuevo viaje
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span>Acciones rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/trip-planner')}
                    className="h-auto p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Nuevo viaje</div>
                        <div className="text-sm text-gray-500">Planificar ruta</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/history')}
                    className="h-auto p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <History className="h-5 w-5 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium">Historial</div>
                        <div className="text-sm text-gray-500">Viajes anteriores</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Favorite Routes */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Rutas favoritas</h4>
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : favoriteRoutes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No tienes rutas favoritas aún
                    </p>
                  ) : (
                    favoriteRoutes.map((route) => (
                      <Button
                        key={route.id}
                        variant="ghost"
                        onClick={() => navigate('/trip-planner', { state: { route } })}
                        className="w-full h-auto p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-3">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{route.name}</div>
                            <div className="text-xs text-gray-500">
                              {route.estimated_time_minutes ? `${route.estimated_time_minutes} min` : ''}
                            </div>
                          </div>
                        </div>
                        {route.next_departure_info && (
                          <div className="text-right">
                            <div className="text-xs text-green-600">{route.next_departure_info}</div>
                          </div>
                        )}
                      </Button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalTrips}</div>
                      <div className="text-sm text-gray-600">Viajes realizados</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.totalTime}</div>
                      <div className="text-sm text-gray-600">Tiempo total</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.co2Saved} kg</div>
                      <div className="text-sm text-gray-600">CO₂ evitado</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Viajes recientes</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/history')}
              >
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : recentTrips.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No tienes viajes recientes.</p>
                  <Button
                    variant="link"
                    onClick={() => navigate('/trip-planner')}
                    className="mt-2"
                  >
                    Planifica tu primer viaje
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTrips.map((trip) => {
                    const date = trip.created_at ? new Date(trip.created_at).toLocaleDateString() : '';
                    const time = trip.start_time ? new Date(trip.start_time).toLocaleTimeString() : '';
                    const modes = trip.route_data?.modes || [];

                    return (
                      <div
                        key={trip.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          {modes.length > 0 && (
                            <div className="flex items-center space-x-2">
                              {modes.slice(0, 3).map((mode: any, index: number) => (
                                <div key={index} className="flex items-center">
                                  {getModeIcon(mode.type)}
                                  {index < Math.min(modes.length, 3) - 1 && (
                                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {trip.origin} → {trip.destination}
                            </div>
                            <div className="text-sm text-gray-500">
                              {date} {time && `• ${time}`} {trip.duration_minutes && `• ${trip.duration_minutes} min`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {trip.rating && (
                            <div className="flex">
                              {Array.from({ length: trip.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                              ))}
                            </div>
                          )}
                          <Badge className={getStatusColor(trip.status)}>
                            {trip.status === 'completed' ? 'Completado' : trip.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}