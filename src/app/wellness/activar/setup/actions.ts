'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

async function findUserByEmail(email: string): Promise<string | null> {
  // Busca usuario por email via REST API — evita listUsers() que trae TODOS los usuarios
  // y puede causar timeout en Vercel si hay muchos registros
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/admin/users?email=' + encodeURIComponent(email) + '&page=1&per_page=1'
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.users?.[0]?.id ?? null
  } catch {
    return null
  }
}

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

  // Verificar que el codigo es valido y no ha sido activado
  const { data: access } = await adminDb
    .from('wellness_access')
    .select('id, activated_at, status')
    .eq('code', code)
    .single()

  if (!access || access.status === 'pending') {
    redirect('/wellness/activar?error=Codigo no valido o no aprobado')
  }

  // Si ya fue activado, ir directo al login (idempotente — evita doble procesamiento)
  if (access.activated_at) {
    redirect('/wellness/login?email=' + encodeURIComponent(email))
  }

  // Crear usuario en Supabase Auth con email+contrasena
  let userId: string
  const { data: newUser, error: createError } = await adminDb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    // Usuario ya existe — buscarlo por email via REST (rapido, sin traer todos los usuarios)
    const existingId = await findUserByEmail(email)
    if (existingId) {
      await adminDb.auth.admin.updateUserById(existingId, { password })
      userId = existingId
    } else {
      console.error('[setup] Error creando usuario:', createError)
      redirect(backUrl + '&error=Error al crear cuenta. Intenta de nuevo.')
    }
  } else {
    userId = newUser.user.id
  }

  // Marcar el codigo como activado (una sola vez — el check anterior evita duplicados)
  await adminDb
    .from('wellness_access')
    .update({
      activated_at: new Date().toISOString(),
      user_id: userId,
      password_set: true,
      marketing_consent: marketingConsent,
    })
    .eq('code', code)
    .is('activated_at', null)  // guard extra: solo actualiza si aun no esta activado

  redirect('/wellness/login?email=' + encodeURIComponent(email) + '&welcome=1')
}
