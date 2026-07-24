import { isSupabaseConfigured, supabaseConfig } from '../config.js';

function buildBaseUrl(path) {
  return new URL(path, supabaseConfig.url.endsWith('/') ? supabaseConfig.url : `${supabaseConfig.url}/`).toString();
}

export function hasSupabaseConfig() {
  return isSupabaseConfigured;
}

export async function supabaseRequest(path, { method = 'GET', params = {}, body } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const url = new URL(buildBaseUrl(path));

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const headers = {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${supabaseConfig.anonKey}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Supabase request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}