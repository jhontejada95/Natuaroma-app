import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/wellness'
  const baseUrl = req.nextUrl.origin

  if (!email || !password) {
    return NextResponse.redirect(
      new URL('/wellness/login?error=Completa todos los campos', baseUrl),
      { status: 302 }
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.redirect(
      new URL('/wellness/login?error=Correo o contrasena incorrectos&tab=password', baseUrl),
      { status: 302 }
    )
  }

  return NextResponse.redirect(new URL(next, baseUrl), { status: 302 })
}
