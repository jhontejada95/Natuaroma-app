import { NextResponse } from 'next/server'

// Flujo antiguo de login via route handler eliminado — ahora el login es client-side
// via WellnessPasswordLogin.tsx que usa supabase.auth.signInWithPassword() directamente.
export async function POST() {
  return NextResponse.json(
    { error: 'Endpoint obsoleto.' },
    { status: 410 }
  )
}
