-- ============================================
-- ESQUEMA DE BASE DE DATOS PARA CITYMOVE
-- ============================================
-- Ejecuta este script en tu proyecto de Supabase
-- (SQL Editor -> New Query -> Pega este código -> Run)

-- ============================================
-- 1. TABLA DE PERFILES DE USUARIO
-- ============================================
-- Extiende la autenticación de Supabase con información adicional del usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 2. TABLA DE PREFERENCIAS DE USUARIO
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notifications BOOLEAN DEFAULT true,
  location_tracking BOOLEAN DEFAULT true,
  accessibility_mode BOOLEAN DEFAULT false,
  eco_friendly BOOLEAN DEFAULT true,
  auto_save BOOLEAN DEFAULT true,
  data_collection BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus preferencias"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus preferencias"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus preferencias"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. TABLA DE UBICACIONES FAVORITAS
-- ============================================
CREATE TABLE IF NOT EXISTS favorite_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  type TEXT CHECK (type IN ('home', 'work', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE favorite_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus ubicaciones favoritas"
  ON favorite_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear ubicaciones favoritas"
  ON favorite_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus ubicaciones favoritas"
  ON favorite_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus ubicaciones favoritas"
  ON favorite_locations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. TABLA DE VIAJES
-- ============================================
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  status TEXT CHECK (status IN ('planned', 'active', 'completed', 'cancelled')) DEFAULT 'planned',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  distance_km DECIMAL(10, 2),
  cost DECIMAL(10, 2),
  co2_saved DECIMAL(10, 2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  route_data JSONB, -- Almacena los detalles de la ruta (modos de transporte, instrucciones, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus propios viajes"
  ON trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear viajes"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus viajes"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus viajes"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. TABLA DE RUTAS FAVORITAS
-- ============================================
CREATE TABLE IF NOT EXISTS favorite_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  estimated_time_minutes INTEGER,
  next_departure_info TEXT,
  route_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE favorite_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus rutas favoritas"
  ON favorite_routes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear rutas favoritas"
  ON favorite_routes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus rutas favoritas"
  ON favorite_routes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus rutas favoritas"
  ON favorite_routes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================
-- Esta función se ejecuta automáticamente cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. TRIGGER PARA NUEVOS USUARIOS
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 8. FUNCIÓN PARA ACTUALIZAR 'updated_at'
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorite_locations_updated_at
  BEFORE UPDATE ON favorite_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorite_routes_updated_at
  BEFORE UPDATE ON favorite_routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorite_locations_user_id ON favorite_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_routes_user_id ON favorite_routes(user_id);

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================
-- Para probar, puedes insertar datos de ejemplo (opcional):
--
-- INSERT INTO trips (user_id, origin, destination, status, duration_minutes, cost)
-- VALUES (auth.uid(), 'Casa', 'Oficina', 'completed', 25, 2.50);
