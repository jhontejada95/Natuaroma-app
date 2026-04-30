'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function activateWellnessCode(formData: FormData) {
  const code = (formData.get('code') as string).trim().toUpperCase()
  const email = (formData.get('email') as string).trim().toLowerCase()

  if (!code || !email) {
    redirect('/wellness/activar?error=Completa todos los campos')
  }

  // Admin client para buscar el código sin restricciones de RLS
  // (el usuario aún no está autenticado en este punto)
  const adminDb = createAdminClient()

  const { data: access, error } = await adminDb
    .from('wellness_access')
    .select('id, activated_at, expires_at, user_email, user_id, status')
    .eq('code', code)
    .single()

  if (error || !access) {
    redirect('/wellness/activar?error=Código no válido o no existe')
  }

  // Solicitud física aún pendiente de aprobación
  if (access.status === 'pending') {
    redirect('/wellness/activar?error=Tu solicitud aún está pendiente de aprobación. Recibirás un correo cuando sea aprobada.')
  }

  if (access.activated_at) {
    redirect('/wellness/activar?error=Este código ya fue utilizado')
  }

  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    redirect('/wellness/activar?error=Este código ha expirado')
  }

  // El email debe coincidir si el registro ya tiene uno
  if (access.user_email && access.user_email.toLowerCase() !== email) {
    redirect('/wellness/activar?error=El correo no coincide con el registrado para este código')
  }

  // Enviar magic link para autenticar al usuario y completar activación
  const supabase = await createClient()
  const { error: authError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/wellness/activar/callback?code=' + code,
      shouldCreateUser: true,
    },
  })

  if (authError) {
    console.error('[activar] Auth error:', authError)
    redirect('/wellness/activar?error=No se pudo enviar el correo de activación')
  }

  // Si el código no tenía email asignado, guardarlo ahora
  if (!access.user_email) {
    await adminDb
      .from('wellness_access')
      .update({ user_email: email })
      .eq('id', access.id)
  }

  redirect('/wellness/activar?success=1')
}
