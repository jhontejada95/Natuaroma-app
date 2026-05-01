'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateAdminPassword(formData: FormData) {
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string

  if (!password || password.length < 8) {
    redirect('/admin/reset-password?error=La contraseña debe tener al menos 8 caracteres')
  }

  if (password !== passwordConfirm) {
    redirect('/admin/reset-password?error=Las contraseñas no coinciden')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/admin/reset-password?error=El enlace expiró o es inválido. Solicita uno nuevo.')
  }

  // Cerrar sesión para que el usuario entre con la nueva contraseña
  await supabase.auth.signOut()
  redirect('/admin/login?message=Contraseña actualizada. Ingresa con tu nueva contraseña.')
}
