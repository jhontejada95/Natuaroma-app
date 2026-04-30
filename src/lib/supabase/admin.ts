import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase con Service Role — SOLO usar en Server Actions/API Routes.
 * Bypasa RLS. Nunca exponerlo al cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
