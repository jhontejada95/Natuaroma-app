'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ALLOWED_ADMIN_EMAILS = ['jhontejada95@gmail.com']

export async function signInWithPassword(formData: FormData) {
  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string

  if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
    return redirect('/admin/login?error=No tienes permiso para acceder al panel de administración.')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect('/admin/login?error=Correo o contraseña incorrectos.')
  }

  return redirect('/admin/products')
}
