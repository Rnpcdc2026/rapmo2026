import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Client admin avec service_role.
 * À utiliser UNIQUEMENT côté serveur (Route Handlers, Server Actions).
 * Bypasse Row Level Security — ne jamais exposer au client.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
