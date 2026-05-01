import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/admin/products'

  const supabase = await createClient()

  // Flujo PKCE (código de autorización) — Supabase v2 por defecto
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Flujo implícito (token_hash) — fallback
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Falló — redirigir al login correspondiente con error
  const isWellness = next.startsWith('/wellness')
  const loginPath = isWellness ? '/wellness/login' : '/admin/login'
  const loginUrl = new URL(loginPath, request.url)
  loginUrl.searchParams.set('error', 'Enlace inválido o expirado. Solicita uno nuevo.')
  return NextResponse.redirect(loginUrl)
}
