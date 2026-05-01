'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { generateCode } from '@/lib/utils/generateCode'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sendWellnessCode } from '@/lib/email'

// Aprobar solicitud fisica
export async function approvePhysicalRequest(id: string) {
  await requireAdmin()

  const db = createAdminClient()

  const { data: request } = await db
    .from('wellness_access')
    .select('user_email, requester_name, code, status')
    .eq('id', id)
    .single()

  if (!request) return

  // Evitar doble aprobacion
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

// Crear invitacion manual
export async function createInvitation(formData: FormData) {
  await requireAdmin()

  const db = createAdminClient()

  const name = (formData.get('inv_name') as string).trim()
  const email = (formData.get('inv_email') as string).toLowerCase().trim()
  const notes = ((formData.get('inv_notes') as string) ?? '').trim()

  if (!name || !email) return

  // Verificar que el correo no tenga ya un acceso
  const { data: existing } = await db
    .from('wellness_access')
    .select('id')
    .eq('user_email', email)
    .limit(1)
    .maybeSingle()

  if (existing) {
    redirect('/admin/wellness?inv_error=' + encodeURIComponent('El correo ' + email + ' ya tiene un acceso Wellness registrado.'))
  }

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
