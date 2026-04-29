'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function generateWellnessCode() {
  const supabase = await createClient()
  const db = supabase as any

  const code = 'WELLNESS-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  await db.from('wellness_access').insert({
    code,
    user_email: null,
    order_id: null,
  })

  revalidatePath('/admin/wellness')
}
