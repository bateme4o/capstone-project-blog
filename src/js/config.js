export const appName = 'Capstone Blog';

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL?.trim() || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);