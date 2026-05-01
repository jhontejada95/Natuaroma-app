'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateWellnessPassword(formData: FormData) {
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string

  if (!password || password.length < 8) {
    redirect('/wellness/reset-password?error=La contraseña debe tener al menos 8 caracteres')
  }

  if (password !== passwordConfirm) {
    redirect('/wellness/reset-password?error=Las contraseñas no coinciden')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/wellness/reset-password?error=El enlace expiró o es inválido. Solicita uno nuevo.')
  }

  // Cerrar sesión y redirigir al login con mensaje de éxito
  await supabase.auth.signOut()
  redirect('/wellness/login?message=Contraseña actualizada. Ingresa con tu nueva contraseña.')
}
