import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { TripPlanner } from './components/TripPlanner';
import { ActiveTrip } from './components/ActiveTrip';
import { UserProfile } from './components/UserProfile';
import { TripHistory } from './components/TripHistory';

interface User {
  name: string;
  email: string;
  id: string;
}

interface AppState {
  user: User | null;
  currentScreen: string;
  currentTrip: any | null;
  screenData: any;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    currentScreen: 'auth',
    currentTrip: null,
    screenData: null
  });

  const handleLogin = (user: User) => {
    setAppState({
      ...appState,
      user,
      currentScreen: 'dashboard'
    });
  };

  const handleLogout = () => {
    setAppState({
      user: null,
      currentScreen: 'auth',
      currentTrip: null,
      screenData: null
    });
  };

  const handleNavigate = (screen: string, data?: any) => {
    setAppState({
      ...appState,
      currentScreen: screen,
      screenData: data
    });
  };

  const handleStartTrip = (tripData: any) => {
    setAppState({
      ...appState,
      currentTrip: tripData,
      currentScreen: 'active-trip'
    });
  };

  const handleCompleteTrip = () => {
    // Here you would typically save the trip to history
    setAppState({
      ...appState,
      currentTrip: null,
      currentScreen: 'dashboard'
    });
  };

  const handleRepeatTrip = (trip: any) => {
    // Navigate to trip planner with pre-filled data
    handleNavigate('trip-planner', { 
      origin: trip.from, 
      destination: trip.to 
    });
  };

  const handleBackToDashboard = () => {
    setAppState({
      ...appState,
      currentScreen: 'dashboard',
      screenData: null
    });
  };

  // Render current screen
  const renderScreen = () => {
    switch (appState.currentScreen) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      
      case 'dashboard':
        if (!appState.user) return <AuthScreen onLogin={handleLogin} />;
        return (
          <Dashboard
            user={appState.user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      
      case 'trip-planner':
        return (
          <TripPlanner
            onBack={handleBackToDashboard}
            onStartTrip={handleStartTrip}
          />
        );
      
      case 'active-trip':
        if (!appState.currentTrip) {
          handleBackToDashboard();
          return null;
        }
        return (
          <ActiveTrip
            tripData={appState.currentTrip}
            onBack={handleBackToDashboard}
            onComplete={handleCompleteTrip}
          />
        );
      
      case 'profile':
        if (!appState.user) return <AuthScreen onLogin={handleLogin} />;
        return (
          <UserProfile
            user={appState.user}
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        );
      
      case 'history':
        return (
          <TripHistory
            onBack={handleBackToDashboard}
            onRepeatTrip={handleRepeatTrip}
          />
        );
      
      default:
        return <AuthScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
}