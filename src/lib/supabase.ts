/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Defaults point at the shared Innovation Hub Supabase project so a fresh
// deployment syncs out of the box. The publishable (anon) key is safe to ship
// client-side; access is governed by the table Row Level Security policies.
// Set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY to point at another project.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://iffuewpvadmxhjdiuqhc.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OmEkl2KgTxzeKaTn-8XN3g_aCOEvqeI';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
