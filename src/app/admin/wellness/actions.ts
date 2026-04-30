'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendWellnessCode } from '@/lib/email'

function generateCode() {
  return 'NAT-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Generar código suelto (legacy)
export async function generateWellnessCode() {
  const supabase = await createClient()
  const db = supabase as any
  await db.from('wellness_access').insert({
    code: generateCode(),
    user_email: null,
    order_id: null,
    source: 'invitation',
    status: 'active',
  })
  revalidatePath('/admin/wellness')
}

// Aprobar solicitud física → activar + enviar email
export async function approvePhysicalRequest(id: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: request } = await db
    .from('wellness_access')
    .select('user_email, requester_name, code')
    .eq('id', id)
    .single()

  if (!request) return

  await db.from('wellness_access').update({ status: 'active' }).eq('id', id)

  await sendWellnessCode({
    to: request.user_email,
    customerName: request.requester_name ?? request.user_email,
    code: request.code,
  })

  revalidatePath('/admin/wellness')
}

// Crear invitación manual desde admin
export async function createInvitation(formData: FormData) {
  const supabase = await createClient()
  const db = supabase as any

  const name = (formData.get('inv_name') as string).trim()
  const email = (formData.get('inv_email') as string).toLowerCase().trim()
  const notes = (formData.get('inv_notes') as string ?? '').trim()

  if (!name || !email) return

  const code = generateCode()

  await db.from('wellness_access').insert({
    code,
    user_email: email,
    requester_name: name,
    source: 'invitation',
    status: 'active',
    notes: notes || null,
    order_id: null,
  })

  await sendWellnessCode({ to: email, customerName: name, code })

  revalidatePath('/admin/wellness')
}
