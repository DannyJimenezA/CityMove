import { supabase } from '../lib/supabase';

export interface Trip {
  id?: string;
  user_id?: string;
  origin: string;
  destination: string;
  origin_lat?: number;
  origin_lng?: number;
  destination_lat?: number;
  destination_lng?: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  distance_km?: number;
  cost?: number;
  co2_saved?: number;
  rating?: number;
  route_data?: any;
  created_at?: string;
  updated_at?: string;
}

export const tripService = {
  // Obtener todos los viajes del usuario
  async getUserTrips(userId: string): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener viajes recientes (últimos 10)
  async getRecentTrips(userId: string, limit = 10): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Obtener viaje activo
  async getActiveTrip(userId: string): Promise<Trip | null> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Crear un nuevo viaje
  async createTrip(trip: Trip): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .insert([trip])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar un viaje
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar un viaje
  async deleteTrip(tripId: string): Promise<void> {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) throw error;
  },

  // Marcar viaje como completado
  async completeTrip(tripId: string, rating?: number): Promise<Trip> {
    const updates: Partial<Trip> = {
      status: 'completed',
      end_time: new Date().toISOString(),
      ...(rating && { rating }),
    };

    return this.updateTrip(tripId, updates);
  },

  // Iniciar un viaje
  async startTrip(tripId: string): Promise<Trip> {
    return this.updateTrip(tripId, {
      status: 'active',
      start_time: new Date().toISOString(),
    });
  },

  // Obtener estadísticas del usuario
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (error) throw error;

    const trips = data || [];
    const totalTrips = trips.length;
    const totalTime = trips.reduce((sum, trip) => sum + (trip.duration_minutes || 0), 0);
    const totalCO2 = trips.reduce((sum, trip) => sum + (trip.co2_saved || 0), 0);
    const totalMoney = trips.reduce((sum, trip) => sum + (trip.cost || 0), 0);

    return {
      totalTrips,
      totalTimeMinutes: totalTime,
      totalTimeFormatted: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`,
      totalCO2Saved: totalCO2.toFixed(1),
      totalMoney: totalMoney.toFixed(2),
    };
  },
};
