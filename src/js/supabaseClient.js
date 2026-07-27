import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

export const hasSupabaseConfig = !!(supabaseUrl && supabaseKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Debug info
if (hasSupabaseConfig) {
  console.log('✅ Supabase configured and ready');
} else {
  console.warn('⚠️ Supabase not configured. Using mock data. Add VITE_SUPABASE_URL and VITE_SUPABASE_KEY to .env');
}
