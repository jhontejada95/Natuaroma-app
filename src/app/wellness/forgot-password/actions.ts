'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function sendWellnessPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase()

  if (!email) {
    redirect('/wellness/forgot-password?error=Ingresa tu correo electrónico')
  }

  // Verificar que el email tiene un acceso Wellness activo y activado
  const db = createAdminClient()
  const { data: access } = await db
    .from('wellness_access')
    .select('id')
    .eq('user_email', email)
    .not('activated_at', 'is', null)
    .limit(1)
    .maybeSingle()

  // Mensaje genérico siempre — no revelar si el email existe o no
  if (!access) {
    redirect('/wellness/forgot-password?sent=1')
  }

  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.natuaroma.shop'

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/confirm?next=/wellness/reset-password`,
  })

  redirect('/wellness/forgot-password?sent=1')
}
