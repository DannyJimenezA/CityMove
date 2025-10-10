import { supabase } from '../lib/supabase';

export interface FavoriteLocation {
  id?: string;
  user_id?: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  type: 'home' | 'work' | 'other';
  created_at?: string;
  updated_at?: string;
}

export interface FavoriteRoute {
  id?: string;
  user_id?: string;
  name: string;
  origin: string;
  destination: string;
  estimated_time_minutes?: number;
  next_departure_info?: string;
  route_data?: any;
  created_at?: string;
  updated_at?: string;
}

export const favoriteService = {
  // ===== UBICACIONES FAVORITAS =====

  async getFavoriteLocations(userId: string): Promise<FavoriteLocation[]> {
    const { data, error } = await supabase
      .from('favorite_locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createFavoriteLocation(location: FavoriteLocation): Promise<FavoriteLocation> {
    const { data, error } = await supabase
      .from('favorite_locations')
      .insert([location])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFavoriteLocation(locationId: string, updates: Partial<FavoriteLocation>): Promise<FavoriteLocation> {
    const { data, error } = await supabase
      .from('favorite_locations')
      .update(updates)
      .eq('id', locationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFavoriteLocation(locationId: string): Promise<void> {
    const { error } = await supabase
      .from('favorite_locations')
      .delete()
      .eq('id', locationId);

    if (error) throw error;
  },

  // ===== RUTAS FAVORITAS =====

  async getFavoriteRoutes(userId: string): Promise<FavoriteRoute[]> {
    const { data, error } = await supabase
      .from('favorite_routes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createFavoriteRoute(route: FavoriteRoute): Promise<FavoriteRoute> {
    const { data, error } = await supabase
      .from('favorite_routes')
      .insert([route])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFavoriteRoute(routeId: string, updates: Partial<FavoriteRoute>): Promise<FavoriteRoute> {
    const { data, error } = await supabase
      .from('favorite_routes')
      .update(updates)
      .eq('id', routeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFavoriteRoute(routeId: string): Promise<void> {
    const { error } = await supabase
      .from('favorite_routes')
      .delete()
      .eq('id', routeId);

    if (error) throw error;
  },
};
