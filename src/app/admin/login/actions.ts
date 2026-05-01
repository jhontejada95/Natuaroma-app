'use server'

import { createClient } from '@/lib/supabase/server'
import { isRateLimited } from '@/lib/ratelimit'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// B-01: Email del admin desde variable de entorno (no hardcodeado en el código)
// Configurar en Vercel: ADMIN_EMAILS=jhontejada95@gmail.com,otro@admin.com
const ALLOWED_ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'jhontejada95@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export async function signInWithPassword(formData: FormData) {
  // A-01: Rate limiting — máx. 10 intentos/min por IP (protección brute force)
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
  if (await isRateLimited('login', ip)) {
    return redirect('/admin/login?error=Demasiados intentos. Espera un momento.')
  }

  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string

  if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
    return redirect('/admin/login?error=No tienes permiso para acceder al panel de administración.')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect('/admin/login?error=Correo o contraseña incorrectos.')
  }

  return redirect('/admin/products')
}
