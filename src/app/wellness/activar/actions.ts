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

  const adminDb = createAdminClient()

  const { data: access, error } = await adminDb
    .from('wellness_access')
    .select('id, activated_at, expires_at, user_email, user_id, status')
    .eq('code', code)
    .single()

  if (error || !access) {
    redirect('/wellness/activar?error=Codigo no valido o no existe')
  }

  if (access.status === 'pending') {
    redirect('/wellness/activar?error=Tu solicitud esta pendiente de aprobacion.')
  }

  if (access.activated_at) {
    redirect('/wellness/activar?error=Este codigo ya fue utilizado')
  }

  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    redirect('/wellness/activar?error=Este codigo ha expirado')
  }

  if (access.user_email && access.user_email.toLowerCase() !== email) {
    redirect('/wellness/activar?error=El correo no coincide con el registrado')
  }

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
    redirect('/wellness/activar?error=No se pudo enviar el correo de activacion')
  }

  if (!access.user_email) {
    await adminDb
      .from('wellness_access')
      .update({ user_email: email })
      .eq('id', access.id)
  }

  redirect('/wellness/activar?success=1')
}
