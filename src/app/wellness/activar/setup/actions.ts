'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function setupWellnessAccount(formData: FormData) {
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string
  const marketingConsent = formData.get('marketing_consent') === 'true'

  if (!password || password.length < 8) {
    redirect('/wellness/activar/setup?error=La contrasena debe tener al menos 8 caracteres')
  }

  if (password !== passwordConfirm) {
    redirect('/wellness/activar/setup?error=Las contrasenas no coinciden')
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    redirect('/wellness/login')
  }

  // Set password on the Supabase auth user
  const { error: updateError } = await supabase.auth.updateUser({ password })
  if (updateError) {
    console.error('Password update error:', updateError)
    redirect('/wellness/activar/setup?error=No se pudo guardar la contrasena. Intenta de nuevo.')
  }

  const db = supabase as any

  // Mark password_set + marketing_consent on wellness_access
  await db
    .from('wellness_access')
    .update({ password_set: true, marketing_consent: marketingConsent })
    .eq('user_id', user.id)

  // Update profile
  await supabase
    .from('profiles' as any)
    .update({ marketing_consent: marketingConsent } as any)
    .eq('id', user.id)

  redirect('/wellness?setup=done')
}
