import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/admin/products'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Redirigir al panel de administración después de login exitoso
      const url = request.nextUrl.clone()
      url.pathname = next
      url.searchParams.delete('token_hash')
      url.searchParams.delete('type')
      return NextResponse.redirect(url)
    }
  }

  // Redirigir al login si falla
  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('error', 'Enlace inválido o expirado')
  return NextResponse.redirect(url)
}
