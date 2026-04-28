import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Cerrar la sesión en Supabase
  await supabase.auth.signOut()

  // Redirigir al portal principal (o al login)
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
