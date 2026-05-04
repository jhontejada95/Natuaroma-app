'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { generateCode } from '@/lib/utils/generateCode'
import { isRateLimited } from '@/lib/ratelimit'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// M-03: fetch con timeout — evita que un Telegram caído cuelgue la respuesta al usuario
async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      signal: AbortSignal.timeout(5000), // 5 segundos máximo
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    })
  } catch (err) {
    // No bloquear el flujo si Telegram falla o hace timeout
    console.error('[telegram] Error o timeout:', err)
  }
}

export async function submitPhysicalRegistration(formData: FormData) {
  // A-01: Rate limiting — máx. 3 registros cada 5 minutos por IP
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
  if (await isRateLimited('registro', ip)) {
    redirect('/registro?error=Demasiados intentos. Espera unos minutos.')
  }

  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).toLowerCase().trim()
  const productsRaw = formData.getAll('products') as string[]
  const location = (formData.get('location') as string | null)?.trim() ?? ''
  const consent = formData.get('consent')

  if (!consent) {
    redirect('/registro?error=Debes aceptar la política de tratamiento de datos para continuar.')
  }

  if (!name || !email || productsRaw.length === 0) {
    redirect('/registro?error=Completa todos los campos y selecciona al menos un producto.')
  }

  const db = createAdminClient()

  // Validar que el correo no tenga ya un acceso Wellness
  const { data: existing } = await db
    .from('wellness_access')
    .select('id')
    .eq('user_email', email)
    .limit(1)
    .maybeSingle()

  if (existing) {
    redirect('/registro?error=Este correo ya tiene un acceso Wellness registrado. Revisa tu bandeja de entrada o ingresa en la app.')
  }

  const code = generateCode() // A-02: crypto.randomBytes en lugar de Math.random

  const { error } = await db.from('wellness_access').insert({
    code,
    user_email: email,
    requester_name: name,
    products_claimed: productsRaw,
    source: 'physical',
    location: location || null,
    status: 'pending',
    order_id: null,
  })

  if (error) {
    console.error('[registro] Error:', error)
    redirect('/registro?error=Ocurrió un error. Intenta de nuevo.')
  }

  const locationLabels: Record<string, string> = {
    salento:    'Tienda Salento',
    armenia_cc: 'Armenia (C.C.)',
    equipo:     'Invitación del equipo',
  }
  const locationText = location ? (locationLabels[location] ?? location) : 'Sin especificar'

  const msg =
    '<b>Nueva solicitud física</b>\n\n' +
    '<b>Nombre:</b> ' + name + '\n' +
    '<b>Correo:</b> ' + email + '\n' +
    '<b>Punto de origen:</b> ' + locationText + '\n' +
    '<b>Productos:</b> ' + productsRaw.join(', ') + '\n\n' +
    'Aprueba en: https://www.natuaroma.shop/admin/wellness'

  await sendTelegramNotification(msg)

  redirect('/registro?success=true')
}
