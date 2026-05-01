'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Emails con permiso de admin (misma fuente que login)
const ALLOWED_ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'jhontejada95@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export async function sendAdminPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase()

  if (!email) {
    redirect('/admin/forgot-password?error=Ingresa tu correo electrónico')
  }

  // Solo enviamos reset a correos que son admins — evita enumerar usuarios
  if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
    // Mensaje genérico — no revelar si el email existe o no
    redirect('/admin/forgot-password?sent=1')
  }

  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.natuaroma.shop'

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/confirm?next=/admin/reset-password`,
  })

  // Siempre mostrar mensaje de éxito (no revelar si el email existe)
  redirect('/admin/forgot-password?sent=1')
}
