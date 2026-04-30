'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    })
  } catch (err) {
    console.error('[telegram] Error enviando notificacion:', err)
  }
}

export async function submitPhysicalRegistration(formData: FormData) {
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).toLowerCase().trim()
  const productsRaw = formData.getAll('products') as string[]

  if (!name || !email || productsRaw.length === 0) {
    redirect('/registro?error=Completa todos los campos y selecciona al menos un producto.')
  }

  const code = 'NAT-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const db = createAdminClient()

  const { error } = await db.from('wellness_access').insert({
    code,
    user_email: email,
    requester_name: name,
    products_claimed: productsRaw,
    source: 'physical',
    status: 'pending',
    order_id: null,
  })

  if (error) {
    console.error('[registro] Error creando solicitud:', error)
    redirect('/registro?error=Ocurrio un error al guardar. Intenta de nuevo.')
  }

  const msg =
    '<b>Nueva solicitud fisica</b>\n\n' +
    '<b>Nombre:</b> ' + name + '\n' +
    '<b>Correo:</b> ' + email + '\n' +
    '<b>Productos:</b> ' + productsRaw.join(', ') + '\n\n' +
    'Aprueba en: https://www.natuaroma.shop/admin/wellness'

  await sendTelegramNotification(msg)

  redirect('/registro?success=true')
}
