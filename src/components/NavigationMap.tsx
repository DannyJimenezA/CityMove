import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  X, 
  MapPin, 
  Navigation, 
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  Locate,
  Route,
  Car,
  Bus,
  Train,
  Clock
} from 'lucide-react';

interface NavigationMapProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  tripData: any;
  currentLocation: string;
}

export function NavigationMap({ isOpen, onClose, currentStep, tripData, currentLocation }: NavigationMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'satellite'>('map');

  if (!isOpen) return null;

  const currentMode = tripData.route.modes[currentStep];
  
  // Mock navigation data
  const navigationData = {
    nextDirection: "Gira a la derecha en 200m",
    distanceToDestination: "1.2 km",
    nextLandmark: "Banco Nacional",
    streetName: "Av. Principal",
    compass: "NE"
  };

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-4 w-4 text-blue-600" />;
      case 'metro': case 'train': return <Train className="h-4 w-4 text-green-600" />;
      case 'car': return <Car className="h-4 w-4 text-red-600" />;
      default: return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <Card className={`w-full max-w-4xl ${isFullscreen ? 'h-full max-w-none rounded-none' : 'max-h-[90vh]'} overflow-hidden`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-white border-b">
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span>Navegación</span>
            {currentMode && (
              <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
                {getModeIcon(currentMode.type)}
                <span className="capitalize">{currentMode.type}</span>
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1">
          {/* Map Container */}
          <div className={`relative bg-gradient-to-br from-green-100 to-blue-100 ${isFullscreen ? 'h-screen' : 'h-96'}`}>
            {/* Mock Map Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                {/* Current Location Indicator */}
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse mx-auto"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-sm font-medium whitespace-nowrap">
                    Tu ubicación
                  </div>
                </div>
                
                {/* Route Path */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-16 h-1 bg-blue-400"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="w-16 h-1 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                
                {/* Mock Street Names */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="bg-white px-2 py-1 rounded shadow">Calle Principal</div>
                  <div className="bg-white px-2 py-1 rounded shadow">Av. Libertador</div>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="outline" size="sm" className="bg-white">
                <Locate className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Compass className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Type Toggle */}
            <div className="absolute top-4 left-4">
              <div className="bg-white rounded-lg p-1 shadow-lg flex">
                <Button
                  variant={mapView === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapView('map')}
                  className="text-xs"
                >
                  Mapa
                </Button>
                <Button
                  variant={mapView === 'satellite' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapView('satellite')}
                  className="text-xs"
                >
                  Satélite
                </Button>
              </div>
            </div>

            {/* Compass */}
            <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
              <div className="relative w-12 h-12">
                <Compass className="h-12 w-12 text-gray-400" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-red-600">
                  {navigationData.compass}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Instructions */}
          <div className="p-4 bg-white border-t space-y-4">
            {/* Next Direction */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-lg">{navigationData.nextDirection}</div>
                <div className="text-sm text-gray-600">hacia {navigationData.nextLandmark}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{navigationData.distanceToDestination}</div>
                <div className="text-sm text-gray-600">al destino</div>
              </div>
            </div>

            {/* Current Location Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Ubicación actual</span>
              </div>
              <div className="text-sm text-gray-700">{currentLocation}</div>
              <div className="text-xs text-gray-500 mt-1">{navigationData.streetName}</div>
            </div>

            {/* Current Step Details */}
            {currentMode && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getModeIcon(currentMode.type)}
                  <span className="text-sm font-medium">Paso actual</span>
                  <Badge className="bg-blue-100 text-blue-800">{currentMode.duration}</Badge>
                </div>
                <div className="text-sm text-blue-700">{currentMode.instruction}</div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Route className="h-4 w-4" />
                <span>Recalcular</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Horarios</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Puntos</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}