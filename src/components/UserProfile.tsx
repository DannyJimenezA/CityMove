import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import { favoriteService } from '../services/favoriteService';
import { tripService } from '../services/tripService';
import type { FavoriteLocation } from '../services/favoriteService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  ArrowLeft,
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Accessibility,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  Plus,
  Star,
  LogOut,
  Loader2
} from 'lucide-react';

export function UserProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || { name: '', email: '', id: '' });
  const [preferences, setPreferences] = useState({
    notifications: true,
    locationTracking: true,
    accessibilityMode: false,
    ecoFriendly: true,
    autoSave: true,
    dataCollection: false
  });
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [statistics, setStatistics] = useState({
    totalTrips: 0,
    totalTime: '0h 0m',
    co2Saved: '0 kg',
    moneySaved: '$0',
    favoriteMode: '-',
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Payment methods - mock data (requiere integración con procesador de pagos)
  const paymentMethods = [
    { id: '1', type: 'Tarjeta', last4: '4242', brand: 'Visa', isDefault: true },
    { id: '2', type: 'PayPal', email: 'user@email.com', isDefault: false }
  ];

  // Cargar datos del usuario desde Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Cargar datos en paralelo
        const [userPreferences, locations, userStats] = await Promise.all([
          profileService.getUserPreferences(user.id),
          favoriteService.getFavoriteLocations(user.id),
          tripService.getUserStats(user.id)
        ]);

        // Actualizar preferencias si existen
        if (userPreferences) {
          setPreferences({
            notifications: userPreferences.notifications ?? true,
            locationTracking: userPreferences.location_tracking ?? true,
            accessibilityMode: userPreferences.accessibility_mode ?? false,
            ecoFriendly: userPreferences.eco_friendly ?? true,
            autoSave: userPreferences.auto_save ?? true,
            dataCollection: userPreferences.data_collection ?? false
          });
        }

        // Actualizar ubicaciones favoritas
        setFavoriteLocations(locations);

        // Actualizar estadísticas
        setStatistics({
          totalTrips: userStats.totalTrips,
          totalTime: userStats.totalTimeFormatted,
          co2Saved: `${userStats.totalCO2Saved} kg`,
          moneySaved: `$${userStats.totalCost.toFixed(2)}`,
          favoriteMode: userStats.favoriteMode || '-',
          averageRating: userStats.averageRating
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await profileService.updateUserProfile(user.id, {
        full_name: editedUser.name
      });
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    if (!user) return;

    // Actualizar estado local inmediatamente
    setPreferences({ ...preferences, [key]: value });

    // Guardar en Supabase
    try {
      const preferencesMap: Record<string, string> = {
        notifications: 'notifications',
        locationTracking: 'location_tracking',
        accessibilityMode: 'accessibility_mode',
        ecoFriendly: 'eco_friendly',
        autoSave: 'auto_save',
        dataCollection: 'data_collection'
      };

      const dbKey = preferencesMap[key];
      if (dbKey) {
        await profileService.updateUserPreferences(user.id, {
          [dbKey]: value
        });
      }
    } catch (error) {
      console.error('Error saving preference:', error);
      // Revertir el cambio local si falla
      setPreferences({ ...preferences, [key]: !value });
      alert('Error al actualizar la preferencia');
    }
  };

  const handleAddPaymentMethod = () => {
    // Mock add payment method
    alert('Funcionalidad de agregar método de pago (requiere integración con procesador de pagos)');
  };

  const handleAddLocation = () => {
    // Navegar a TripPlanner donde el usuario puede agregar ubicaciones
    navigate('/trip-planner');
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!user) return;

    try {
      await favoriteService.deleteFavoriteLocation(locationId);
      // Recargar ubicaciones
      const locations = await favoriteService.getFavoriteLocations(user.id);
      setFavoriteLocations(locations);
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error al eliminar la ubicación');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

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
              <h1 className="text-xl font-semibold text-gray-900">Mi perfil</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Información personal</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          disabled
                          className="bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                      </div>
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          'Guardar cambios'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">
                        Usuario verificado
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Estadísticas de viaje</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalTrips}</div>
                  <div className="text-sm text-gray-600">Viajes totales</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{statistics.totalTime}</div>
                  <div className="text-sm text-gray-600">Tiempo total</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{statistics.co2Saved}</div>
                  <div className="text-sm text-gray-600">CO₂ ahorrado</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{statistics.moneySaved}</div>
                  <div className="text-sm text-gray-600">Dinero ahorrado</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{statistics.favoriteMode}</div>
                  <div className="text-sm text-gray-600">Transporte favorito</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{statistics.averageRating}</div>
                  <div className="text-sm text-gray-600">Calificación promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Locations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Ubicaciones favoritas</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Cargando ubicaciones...</p>
                </div>
              ) : favoriteLocations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No tienes ubicaciones favoritas aún</p>
                  <Button variant="link" onClick={handleAddLocation} className="mt-2">
                    Agregar tu primera ubicación
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-600">{location.address || 'Sin dirección'}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => location.id && handleDeleteLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Métodos de pago</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddPaymentMethod}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {method.type} {method.last4 && `****${method.last4}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.brand || method.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800">Por defecto</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Preferencias</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="notifications">Notificaciones push</Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <Label htmlFor="location">Seguimiento de ubicación</Label>
                  </div>
                  <Switch
                    id="location"
                    checked={preferences.locationTracking}
                    onCheckedChange={(checked) => handlePreferenceChange('locationTracking', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Accessibility className="h-4 w-4" />
                    <Label htmlFor="accessibility">Modo accesibilidad</Label>
                  </div>
                  <Switch
                    id="accessibility"
                    checked={preferences.accessibilityMode}
                    onCheckedChange={(checked) => handlePreferenceChange('accessibilityMode', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>🌱</span>
                    <Label htmlFor="eco">Preferir opciones eco-friendly</Label>
                  </div>
                  <Switch
                    id="eco"
                    checked={preferences.ecoFriendly}
                    onCheckedChange={(checked) => handlePreferenceChange('ecoFriendly', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <Label htmlFor="autosave">Guardar viajes automáticamente</Label>
                  </div>
                  <Switch
                    id="autosave"
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                    disabled={loading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="data">Compartir datos para mejoras</Label>
                  </div>
                  <Switch
                    id="data"
                    checked={preferences.dataCollection}
                    onCheckedChange={(checked) => handlePreferenceChange('dataCollection', checked)}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zona de peligro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Descargar mis datos
              </Button>
              <Button variant="outline" className="w-full">
                Eliminar historial de viajes
              </Button>
              <Button variant="destructive" className="w-full">
                Eliminar cuenta permanentemente
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}