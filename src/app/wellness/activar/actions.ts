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

  // Buscar el codigo
  const { data: access, error } = await db
    .from('wellness_access')
    .select('id, activated_at, expires_at, user_email, user_id')
    .eq('code', code)
    .single()

  if (error || !access) {
    redirect('/wellness/activar?error=Codigo no valido o no existe')
  }

  if (access.activated_at) {
    redirect('/wellness/activar?error=Este codigo ya fue utilizado')
  }

  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    redirect('/wellness/activar?error=Este codigo ha expirado')
  }

  // El email debe coincidir con el de la compra
  if (access.user_email.toLowerCase() !== email) {
    redirect('/wellness/activar?error=El correo no coincide con el de la compra original')
  }

  // Crear usuario en Supabase Auth si no existe, o buscar el existente
  // Enviamos magic link para que se autentique y a la vez activamos el codigo
  const { error: authError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/wellness/activar/callback?code=' + code,
      shouldCreateUser: true,
    },
  })

  if (authError) {
    console.error('Auth error:', authError)
    redirect('/wellness/activar?error=No se pudo enviar el correo de activacion')
  }

  // Marcar el access como pendiente de activacion (se completa en el callback)
  await db
    .from('wellness_access')
    .update({ user_email: email })
    .eq('id', access.id)

  redirect('/wellness/activar?success=1')
}
