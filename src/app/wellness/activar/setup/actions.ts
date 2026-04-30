'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function setupWellnessAccount(formData: FormData) {
  const code = (formData.get('code') as string).trim().toUpperCase()
  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string
  const marketingConsent = formData.get('marketing_consent') === 'true'

  const backUrl = '/wellness/activar/setup?code=' + encodeURIComponent(code) + '&email=' + encodeURIComponent(email)

  if (!password || password.length < 8) {
    redirect(backUrl + '&error=La contrasena debe tener al menos 8 caracteres')
  }

  if (password !== passwordConfirm) {
    redirect(backUrl + '&error=Las contrasenas no coinciden')
  }

  const adminDb = createAdminClient()

  // Verificar que el codigo sigue valido
  const { data: access } = await adminDb
    .from('wellness_access')
    .select('id, activated_at, status')
    .eq('code', code)
    .single()

  if (!access || access.status === 'pending') {
    redirect('/wellness/activar?error=Codigo no valido o no aprobado')
  }

  if (access.activated_at) {
    redirect('/wellness/login')
  }

  // Crear usuario en Supabase con email+contrasena
  // email_confirm: true = sin email de verificacion de Supabase
  let userId: string
  const { data: newUser, error: createError } = await adminDb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    // El usuario ya existe — actualizar contrasena
    const { data: userList } = await adminDb.auth.admin.listUsers()
    const existing = userList?.users?.find((u: any) => u.email === email)
    if (existing) {
      await adminDb.auth.admin.updateUserById(existing.id, { password })
      userId = existing.id
    } else {
      console.error('[setup] Error creando usuario:', createError)
      redirect(backUrl + '&error=Error al crear cuenta. Intenta de nuevo.')
    }
  } else {
    userId = newUser.user.id
  }

  // Marcar el codigo como activado
  await adminDb
    .from('wellness_access')
    .update({
      activated_at: new Date().toISOString(),
      user_id: userId,
      password_set: true,
      marketing_consent: marketingConsent,
    })
    .eq('code', code)

  // Iniciar sesion automaticamente (sin que el usuario vuelva a hacer login)
  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    console.error('[setup] Sign in error:', signInError)
    redirect('/wellness/login')
  }

  // setup=done activa el popup de instalacion de PWA
  redirect('/wellness?setup=done')
}
