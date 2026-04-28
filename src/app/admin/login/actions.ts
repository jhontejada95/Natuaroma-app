'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  // Envía el magic link
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, 
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`, 
    },
  })

  if (error) {
    return redirect('/admin/login?error=No se pudo enviar el enlace. Verifica el correo.')
  }

  return redirect('/admin/login?message=Revisa tu bandeja de entrada para iniciar sesión.')
}
