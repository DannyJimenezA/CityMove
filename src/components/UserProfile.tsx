import { useState } from 'react';
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
  LogOut
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  id: string;
}

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

export function UserProfile({ user, onBack, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [preferences, setPreferences] = useState({
    notifications: true,
    locationTracking: true,
    accessibilityMode: false,
    ecoFriendly: true,
    autoSave: true,
    dataCollection: false
  });

  // Mock data
  const paymentMethods = [
    { id: '1', type: 'Tarjeta', last4: '4242', brand: 'Visa', isDefault: true },
    { id: '2', type: 'PayPal', email: 'user@email.com', isDefault: false }
  ];

  const favoriteLocations = [
    { id: '1', name: 'Casa', address: 'Calle Principal 123', type: 'home' },
    { id: '2', name: 'Oficina', address: 'Av. Empresarial 456', type: 'work' },
    { id: '3', name: 'Gimnasio', address: 'Centro Deportivo Norte', type: 'other' }
  ];

  const statistics = {
    totalTrips: 127,
    totalTime: '45h 30m',
    co2Saved: '127 kg',
    moneySaved: '$234',
    favoriteMode: 'Metro',
    averageRating: 4.7
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Saving profile:', editedUser);
  };

  const handleAddPaymentMethod = () => {
    // Mock add payment method
    alert('Funcionalidad de agregar método de pago (requiere integración con procesador de pagos)');
  };

  const handleAddLocation = () => {
    // Mock add location
    alert('Agregar nueva ubicación favorita');
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
              <h1 className="text-xl font-semibold text-gray-900">Mi perfil</h1>
            </div>
            <Button variant="outline" onClick={onLogout}>
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
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveProfile}>
                        Guardar cambios
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
              <div className="space-y-3">
                {favoriteLocations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-600">{location.address}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
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
                    onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
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
                    onCheckedChange={(checked) => setPreferences({...preferences, locationTracking: checked})}
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
                    onCheckedChange={(checked) => setPreferences({...preferences, accessibilityMode: checked})}
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
                    onCheckedChange={(checked) => setPreferences({...preferences, ecoFriendly: checked})}
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
                    onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
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
                    onCheckedChange={(checked) => setPreferences({...preferences, dataCollection: checked})}
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