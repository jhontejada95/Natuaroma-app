'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { sendWellnessCode } from '@/lib/email'

function generateCode() {
  return 'NAT-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Aprobar solicitud física → activar + enviar email
export async function approvePhysicalRequest(id: string) {
  const db = createAdminClient()

  // Leer el registro (admin client bypasa RLS)
  const { data: request } = await db
    .from('wellness_access')
    .select('user_email, requester_name, code, status')
    .eq('id', id)
    .single()

  if (!request) {
    console.error('[wellness] approvePhysicalRequest: registro no encontrado', id)
    return
  }

  // Evitar doble aprobación
  if (request.status === 'active') {
    revalidatePath('/admin/wellness')
    return
  }

  await db
    .from('wellness_access')
    .update({ status: 'active' })
    .eq('id', id)

  await sendWellnessCode({
    to: request.user_email,
    customerName: request.requester_name ?? request.user_email,
    code: request.code,
  })

  revalidatePath('/admin/wellness')
}

// Crear invitación manual desde admin
export async function createInvitation(formData: FormData) {
  const db = createAdminClient()

  const name = (formData.get('inv_name') as string).trim()
  const email = (formData.get('inv_email') as string).toLowerCase().trim()
  const notes = ((formData.get('inv_notes') as string) ?? '').trim()

  if (!name || !email) return

  const code = generateCode()

  const { error } = await db.from('wellness_access').insert({
    code,
    user_email: email,
    requester_name: name,
    source: 'invitation',
    status: 'active',
    notes: notes || null,
    order_id: null,
  })

  if (error) {
    console.error('[wellness] createInvitation error:', error)
    return
  }

  await sendWellnessCode({ to: email, customerName: name, code })

  revalidatePath('/admin/wellness')
}
