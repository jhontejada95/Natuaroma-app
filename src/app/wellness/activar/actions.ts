'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { isRateLimited } from '@/lib/ratelimit'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function activateWellnessCode(formData: FormData) {
  // A-01: Rate limiting — evita fuerza bruta de códigos
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
  if (await isRateLimited('activar', ip)) {
    redirect('/wellness/activar?error=Demasiados intentos. Espera un momento.')
  }

  const code = (formData.get('code') as string).trim().toUpperCase()
  const email = (formData.get('email') as string).trim().toLowerCase()

  if (!code || !email) {
    redirect('/wellness/activar?error=Completa todos los campos')
  }

  const adminDb = createAdminClient()
  const { data: access, error } = await adminDb
    .from('wellness_access')
    .select('id, activated_at, expires_at, user_email, status')
    .eq('code', code)
    .single()

  if (error || !access) {
    redirect('/wellness/activar?error=Codigo no valido o no existe')
  }

  if (access.status === 'pending') {
    redirect('/wellness/activar?error=Tu solicitud esta pendiente de aprobacion. Recibiras un correo cuando sea aprobada.')
  }

  if (access.activated_at) {
    redirect('/wellness/activar?error=Este codigo ya fue utilizado. Ingresa con tu cuenta.')
  }

  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    redirect('/wellness/activar?error=Este codigo ha expirado')
  }

  if (access.user_email && access.user_email.toLowerCase() !== email) {
    redirect('/wellness/activar?error=El correo no coincide con el registrado para este codigo')
  }

  redirect('/wellness/activar/setup?code=' + encodeURIComponent(code) + '&email=' + encodeURIComponent(email))
}
