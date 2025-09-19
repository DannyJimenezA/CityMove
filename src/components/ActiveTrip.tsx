import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { NavigationMap } from './NavigationMap';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Pause,
  Play,
  X,
  AlertCircle,
  CheckCircle2,
  Bus, 
  Train, 
  Car, 
  Bike,
  Phone,
  MessageCircle,
  RefreshCw,
  Map
} from 'lucide-react';

interface ActiveTripProps {
  tripData: any;
  onBack: () => void;
  onComplete: () => void;
}

export function ActiveTrip({ tripData, onBack, onComplete }: ActiveTripProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(28 * 60); // 28 minutes in seconds
  const [currentLocation, setCurrentLocation] = useState("Calle Principal 123");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  // Mock real-time updates
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused]);

  // Simulate step progression
  useEffect(() => {
    if (!isPaused && timeRemaining > 0) {
      const totalSteps = tripData.route.modes.length;
      const timePerStep = (28 * 60) / totalSteps;
      const expectedStep = Math.floor((28 * 60 - timeRemaining) / timePerStep);
      
      if (expectedStep !== currentStep && expectedStep < totalSteps) {
        setCurrentStep(expectedStep);
      }
    }
  }, [timeRemaining, isPaused, currentStep, tripData.route.modes.length]);

  // Mock alerts
  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setAlerts([
        {
          id: '1',
          type: 'info',
          message: 'El Bus Línea 42 llegará en 3 minutos',
          timestamp: new Date()
        }
      ]);
    }, 5000);

    return () => clearTimeout(alertTimer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-5 w-5 text-blue-600" />;
      case 'metro': case 'train': return <Train className="h-5 w-5 text-green-600" />;
      case 'walk': return <MapPin className="h-5 w-5 text-gray-600" />;
      case 'bike': return <Bike className="h-5 w-5 text-orange-600" />;
      case 'car': return <Car className="h-5 w-5 text-red-600" />;
      default: return <Navigation className="h-5 w-5" />;
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleEndTrip = () => {
    if (confirm('¿Estás seguro de que quieres finalizar el viaje?')) {
      onComplete();
    }
  };

  const progressPercentage = ((tripData.route.modes.length - (tripData.route.modes.length - currentStep)) / tripData.route.modes.length) * 100;

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
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Viaje activo</h1>
                <p className="text-sm text-gray-600">{tripData.origin} → {tripData.destination}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap(true)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Map className="h-4 w-4 mr-1" />
                Mapa
              </Button>
              <Button
                variant={isPaused ? "default" : "outline"}
                size="sm"
                onClick={handlePauseResume}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleEndTrip}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Trip Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Tiempo restante estimado</div>
                  <div className="text-lg font-semibold">
                    Paso {currentStep + 1} de {tripData.route.modes.length}
                  </div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-4" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {isPaused ? 'Viaje pausado' : 'Viaje en progreso'}
                </p>
                <Button
                  onClick={() => setShowMap(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Abrir navegación
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Step */}
          {tripData.route.modes[currentStep] && (
            <Card className="ring-2 ring-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getModeIcon(tripData.route.modes[currentStep].type)}
                  <span>Paso actual</span>
                  <Badge className="bg-blue-100 text-blue-800">Activo</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-lg font-medium">
                    {tripData.route.modes[currentStep].instruction}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tripData.route.modes[currentStep].duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{currentLocation}</span>
                    </span>
                  </div>
                  
                  {/* Navigation Instructions */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900">Instrucciones</div>
                          <div className="text-blue-700 text-sm mt-1">
                            {currentStep === 0 && "Dirígete hacia la parada de bus más cercana. Son aproximadamente 5 minutos caminando."}
                            {currentStep === 1 && "Espera el Bus Línea 42. Próxima llegada estimada en 3 minutos."}
                            {currentStep === 2 && "Bájate en la parada 'Metro Centro' y camina hacia la entrada del metro."}
                            {currentStep === 3 && "Toma la Línea Azul del Metro dirección Norte."}
                            {currentStep === 4 && "Camina desde la estación hasta tu destino final."}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMap(true)}
                        className="ml-3 bg-white hover:bg-gray-50"
                      >
                        <Map className="h-4 w-4 mr-1" />
                        Ver mapa
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Alertas en tiempo real</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-orange-900">{alert.message}</div>
                        <div className="text-orange-700 text-sm">
                          {alert.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Steps Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripData.route.modes.map((mode: any, index: number) => {
                  const status = getStepStatus(index);
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        status === 'completed' ? 'bg-green-50' :
                        status === 'active' ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-100' :
                        status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          getModeIcon(mode.type)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          status === 'completed' ? 'text-green-900' :
                          status === 'active' ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {mode.instruction}
                        </div>
                        <div className={`text-sm ${
                          status === 'completed' ? 'text-green-700' :
                          status === 'active' ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {mode.duration}
                        </div>
                      </div>
                      {status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800">Completado</Badge>
                      )}
                      {status === 'active' && (
                        <Badge className="bg-blue-100 text-blue-800">En progreso</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones de emergencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <RefreshCw className="h-5 w-5" />
                    <span>Replanificar ruta</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Contactar soporte</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Phone className="h-5 w-5" />
                    <span>Llamar taxi</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Navigation Map Modal */}
      <NavigationMap
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        currentStep={currentStep}
        tripData={tripData}
        currentLocation={currentLocation}
      />
    </div>
  );
}