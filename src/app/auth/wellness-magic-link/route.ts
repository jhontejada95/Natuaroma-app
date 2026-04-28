import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const next = (formData.get('next') as string) || '/wellness'

  if (!email) {
    const url = request.nextUrl.clone()
    url.pathname = '/wellness/login'
    url.searchParams.set('error', 'Debes ingresar tu correo electronico')
    return NextResponse.redirect(url, { status: 303 })
  }

  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    const url = request.nextUrl.clone()
    url.pathname = '/wellness/login'
    url.searchParams.set('error', 'No pudimos enviar el correo. Intentalo de nuevo.')
    return NextResponse.redirect(url, { status: 303 })
  }

  const url = request.nextUrl.clone()
  url.pathname = '/wellness/login/enviado'
  url.search = ''
  url.searchParams.set('email', email)
  return NextResponse.redirect(url, { status: 303 })
}
