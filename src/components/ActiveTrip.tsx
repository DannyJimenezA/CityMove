import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tripService } from '../services/tripService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { TripRoute, RouteStep } from '../services/mapsService';
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
  Bike,
  SkipForward,
  FastForward,
  DollarSign,
  Leaf
} from 'lucide-react';

interface TripData {
  id: string;
  origin: string;
  destination: string;
  route: TripRoute;
  startTime: string;
  status: string;
}

export function ActiveTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const tripData = location.state?.tripData as TripData;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!tripData) {
      navigate('/trip-planner');
      return;
    }

    // Inicializar tiempo restante en segundos
    setTimeRemaining(tripData.route.durationMinutes * 60);
  }, [tripData, navigate]);

  // Temporizador de tiempo real
  useEffect(() => {
    if (!isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, timeRemaining]);

  // Auto-avanzar pasos basado en el tiempo
  useEffect(() => {
    if (!isPaused && timeRemaining > 0 && tripData) {
      const totalSteps = tripData.route.steps.length;
      const totalDuration = tripData.route.durationMinutes * 60;

      // Calcular el paso actual basado en tiempo acumulado
      let accumulatedTime = 0;
      let expectedStep = 0;

      for (let i = 0; i < totalSteps; i++) {
        accumulatedTime += tripData.route.steps[i].durationMinutes * 60;
        if (elapsedTime < accumulatedTime) {
          expectedStep = i;
          break;
        }
      }

      if (expectedStep !== currentStep && expectedStep < totalSteps) {
        setCurrentStep(expectedStep);
      }
    }
  }, [elapsedTime, isPaused, currentStep, tripData]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getModeIcon = (type: RouteStep['type']) => {
    switch (type) {
      case 'bus': return <Bus className="h-5 w-5 text-blue-600" />;
      case 'metro': case 'train': case 'transit': return <Train className="h-5 w-5 text-green-600" />;
      case 'walk': return <MapPin className="h-5 w-5 text-gray-600" />;
      case 'bike': return <Bike className="h-5 w-5 text-orange-600" />;
      default: return <Navigation className="h-5 w-5" />;
    }
  };

  const getModeName = (type: RouteStep['type']): string => {
    switch (type) {
      case 'bus': return 'Bus';
      case 'metro': return 'Metro';
      case 'train': return 'Tren';
      case 'walk': return 'Caminata';
      case 'bike': return 'Bicicleta';
      case 'transit': return 'Tránsito';
      default: return 'Transporte';
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const handleNextStep = () => {
    if (!tripData) return;

    if (currentStep < tripData.route.steps.length - 1) {
      setCurrentStep(prev => prev + 1);

      // Ajustar el tiempo para que coincida con el nuevo paso
      const step = tripData.route.steps[currentStep + 1];
      const stepDuration = step.durationMinutes * 60;
      setTimeRemaining(prev => Math.max(0, prev - stepDuration));
      setElapsedTime(prev => prev + stepDuration);
    }
  };

  const handleSkipToEnd = () => {
    if (!tripData) return;

    setCurrentStep(tripData.route.steps.length - 1);
    setTimeRemaining(0);
    setElapsedTime(tripData.route.durationMinutes * 60);

    setTimeout(() => {
      handleCompleteTrip();
    }, 1000);
  };

  const handleCompleteTrip = async () => {
    if (!user) {
      alert('Error: Usuario no autenticado');
      return;
    }

    try {
      // Extraer valores numéricos del costo y CO2
      const costValue = parseFloat(tripData.route.cost.replace('$', '').replace(',', ''));
      const co2Value = parseFloat(tripData.route.co2.replace(' kg', '').replace(',', ''));

      // Guardar el viaje en Supabase
      await tripService.createTrip({
        user_id: user.id,
        origin: tripData.origin,
        destination: tripData.destination,
        status: 'completed',
        duration_minutes: tripData.route.durationMinutes,
        cost: costValue,
        co2_saved: co2Value,
        distance_km: parseFloat(tripData.route.distance.replace(' km', '').replace(',', '.')),
        start_time: tripData.startTime,
        route_data: {
          steps: tripData.route.steps,
          modes: tripData.route.steps.map(step => step.type),
          polyline: tripData.route.polyline
        },
        rating: 5 // Rating por defecto
      });

      alert('¡Viaje completado y guardado! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Viaje completado pero hubo un error al guardar en el historial');
      navigate('/dashboard');
    }
  };

  const handleCancelTrip = () => {
    if (confirm('¿Estás seguro de que quieres cancelar este viaje?')) {
      navigate('/dashboard');
    }
  };

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No hay viaje activo</h2>
            <p className="text-gray-600 mb-4">Por favor planifica un viaje primero</p>
            <Button onClick={() => navigate('/trip-planner')}>
              Planificar viaje
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = Math.min(100, ((elapsedTime / (tripData.route.durationMinutes * 60)) * 100));
  const currentStepData = tripData.route.steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleCancelTrip}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Viaje en curso</h1>
                <p className="text-xs text-gray-600">
                  {tripData.origin} → {tripData.destination}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Route Map Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Mapa de ruta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg p-6 min-h-[300px]">
                {/* Visual route representation */}
                <div className="flex flex-col space-y-4">
                  {/* Origin */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Origen</p>
                      <p className="text-xs text-gray-600">{tripData.origin}</p>
                    </div>
                  </div>

                  {/* Route steps visualization */}
                  <div className="pl-4 border-l-4 border-blue-500 ml-4 space-y-4">
                    {tripData.route.steps.map((step, index) => {
                      const stepStatus = getStepStatus(index);
                      return (
                        <div key={index} className="flex items-start space-x-4 pb-4">
                          <div className="flex-shrink-0 -ml-6">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              stepStatus === 'completed'
                                ? 'bg-green-500'
                                : stepStatus === 'active'
                                ? 'bg-blue-500 animate-pulse'
                                : 'bg-gray-300'
                            }`}>
                              {stepStatus === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              ) : (
                                getModeIcon(step.type)
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {getModeIcon(step.type)}
                              <span className={`text-sm font-medium ${
                                stepStatus === 'active' ? 'text-blue-600' : 'text-gray-700'
                              }`}>
                                {getModeName(step.type)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}
                              </Badge>
                            </div>
                            <p className={`text-xs mt-1 ${
                              stepStatus === 'active' ? 'text-blue-700 font-medium' : 'text-gray-600'
                            }`}>
                              {step.instruction}
                            </p>
                            {step.transitDetails && (
                              <p className="text-xs text-gray-500 mt-1">
                                Línea {step.transitDetails.line} • {step.transitDetails.numStops} paradas
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Destination */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        currentStep >= tripData.route.steps.length - 1
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}>
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Destino</p>
                      <p className="text-xs text-gray-600">{tripData.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Completado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-gray-600">Actual</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                    <span className="text-gray-600">Pendiente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo restante</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Paso {currentStep + 1} de {tripData.route.steps.length}</p>
                    <p className="text-lg font-semibold">
                      {tripData.route.distance}
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Inicio</span>
                  <span>{Math.round(progress)}% completado</span>
                  <span>Destino</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Controls */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <FastForward className="h-4 w-4 mr-2" />
                Controles de Simulación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-700">
                Usa estos botones para simular el progreso del viaje sin moverte físicamente
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleNextStep}
                  disabled={currentStep >= tripData.route.steps.length - 1}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Siguiente paso
                </Button>
                <Button
                  onClick={handleSkipToEnd}
                  disabled={currentStep >= tripData.route.steps.length - 1}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FastForward className="h-4 w-4 mr-2" />
                  Finalizar viaje
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Step */}
          <Card className="border-blue-500 border-2">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  {getModeIcon(currentStepData.type)}
                  <span className="ml-2">Paso actual</span>
                </span>
                <Badge className="bg-blue-600">
                  {currentStepData.duration}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-semibold mb-2">
                    {currentStepData.instruction}
                  </p>
                  <p className="text-gray-600">
                    Distancia: {currentStepData.distance}
                  </p>
                </div>

                {currentStepData.transitDetails && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">
                        Línea {currentStepData.transitDetails.line}
                      </span>
                      <Badge variant="outline">{currentStepData.transitDetails.vehicle}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Salida</p>
                        <p className="font-medium">{currentStepData.transitDetails.departure}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Llegada</p>
                        <p className="font-medium">{currentStepData.transitDetails.arrival}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {currentStepData.transitDetails.numStops} paradas
                    </p>
                  </div>
                )}

                {getStepStatus(currentStep) === 'completed' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Completado</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* All Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Todos los pasos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tripData.route.steps.map((step, index) => {
                  const status = getStepStatus(index);
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                        status === 'active'
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : status === 'completed'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {status === 'completed' ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : status === 'active' ? (
                          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getModeIcon(step.type)}
                          <span className="text-sm font-medium">
                            {getModeName(step.type)}
                          </span>
                          {step.transitDetails && (
                            <Badge variant="outline" className="text-xs">
                              Línea {step.transitDetails.line}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 truncate">
                          {step.instruction}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-500">{step.distance}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{step.duration}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="text-lg font-semibold">{tripData.route.duration}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Navigation className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Distancia</p>
                  <p className="text-lg font-semibold">{tripData.route.distance}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Costo</p>
                  <p className="text-lg font-semibold">{tripData.route.cost}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Leaf className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">CO₂ ahorrado</p>
                  <p className="text-lg font-semibold">{tripData.route.co2}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancelTrip}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar viaje
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleCompleteTrip}
              disabled={currentStep < tripData.route.steps.length - 1}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completar viaje
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
