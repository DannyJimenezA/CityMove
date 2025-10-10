import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { TripPlanner } from './components/TripPlanner';
import { ActiveTrip } from './components/ActiveTrip';
import { UserProfile } from './components/UserProfile';
import { TripHistory } from './components/TripHistory';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<AuthScreen />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/trip-planner"
              element={
                <PrivateRoute>
                  <TripPlanner />
                </PrivateRoute>
              }
            />

            <Route
              path="/active-trip"
              element={
                <PrivateRoute>
                  <ActiveTrip />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <TripHistory />
                </PrivateRoute>
              }
            />

            {/* Ruta por defecto - redirige a login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
