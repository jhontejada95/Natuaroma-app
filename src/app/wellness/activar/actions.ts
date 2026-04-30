'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function activateWellnessCode(formData: FormData) {
  const code = (formData.get('code') as string).trim().toUpperCase()
  const email = (formData.get('email') as string).trim().toLowerCase()

  if (!code || !email) {
    redirect('/wellness/activar?error=Completa todos los campos')
  }

  const supabase = await createClient()
  const db = supabase as any

  // Buscar el código
  const { data: access, error } = await db
    .from('wellness_access')
    .select('id, activated_at, expires_at, user_email, user_id, status')
    .eq('code', code)
    .single()

  if (error || !access) {
    redirect('/wellness/activar?error=Código no válido o no existe')
  }

  // Si el registro físico aún está pendiente de aprobación
  if (access.status === 'pending') {
    redirect('/wellness/activar?error=Tu solicitud aún está pendiente de aprobación. Recibirás un correo cuando sea aprobada.')
  }

  if (access.activated_at) {
    redirect('/wellness/activar?error=Este código ya fue utilizado')
  }

  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    redirect('/wellness/activar?error=Este código ha expirado')
  }

  // El email debe coincidir con el registrado (si existe)
  if (access.user_email && access.user_email.toLowerCase() !== email) {
    redirect('/wellness/activar?error=El correo no coincide con el registrado para este código')
  }

  // Enviar magic link para autenticar y activar
  const { error: authError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/wellness/activar/callback?code=' + code,
      shouldCreateUser: true,
    },
  })

  if (authError) {
    console.error('Auth error:', authError)
    redirect('/wellness/activar?error=No se pudo enviar el correo de activación')
  }

  // Guardar email si no tenía (código sin email previo)
  if (!access.user_email) {
    await db
      .from('wellness_access')
      .update({ user_email: email })
      .eq('id', access.id)
  }

  redirect('/wellness/activar?success=1')
}
