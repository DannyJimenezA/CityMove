import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id: string;
  notifications: boolean;
  location_tracking: boolean;
  accessibility_mode: boolean;
  eco_friendly: boolean;
  auto_save: boolean;
  data_collection: boolean;
  created_at?: string;
  updated_at?: string;
}

export const profileService = {
  // ===== PERFIL DE USUARIO =====

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== PREFERENCIAS DE USUARIO =====

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
