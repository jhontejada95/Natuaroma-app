'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { generateCode } from '@/lib/utils/generateCode'
import { isRateLimited } from '@/lib/ratelimit'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { sendOrderConfirmation, sendWellnessCode } from '@/lib/email'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? ''

export async function createOrder(formData: FormData) {
  // ── A-01: Rate limiting — máx. 5 intentos/min por IP ────────────────
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
  if (await isRateLimited('checkout', ip)) {
    redirect('/checkout?error=Demasiados intentos. Espera un momento e intenta de nuevo.')
  }

  const db = createAdminClient()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const nombre_completo = (formData.get('nombre_completo') as string).trim()
  const cedula = (formData.get('cedula') as string).trim()
  const telefono = (formData.get('telefono') as string).trim()
  const direccion = (formData.get('direccion') as string).trim()
  const ciudad = (formData.get('ciudad') as string).trim()
  const departamento = (formData.get('departamento') as string).trim()
  const shipping_cost = parseInt(formData.get('shipping_cost') as string ?? '0', 10)

  // ── C-03: Parsear y validar cartItems con try-catch ──────────────────
  const cartItemsRaw = formData.get('cartItems') as string
  let cartItems: { id: string; name: string; quantity: number }[]
  try {
    const parsed = JSON.parse(cartItemsRaw)
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty cart')
    cartItems = parsed
  } catch {
    redirect('/checkout?error=El carrito es inválido, recarga la página')
  }

  // ── C-03: Validar que quantity sea un entero positivo ────────────────
  for (const item of cartItems) {
    const qty = parseInt(String(item.quantity), 10)
    if (!qty || qty < 1 || qty > 99) {
      redirect('/checkout?error=Cantidad inválida en uno de los productos')
    }
    item.quantity = qty // sanitizado
  }

  const productIds = cartItems.map((i) => i.id)
  const { data: dbProducts, error: fetchError } = await db
    .from('products')
    .select('id, name, price, stock, status')
    .in('id', productIds)

  if (fetchError || !dbProducts) {
    redirect('/checkout?error=No se pudieron verificar los productos')
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]))

  for (const item of cartItems) {
    const p = productMap.get(item.id)
    if (!p || p.status !== 'active') {
      redirect('/checkout?error=Uno o más productos no están disponibles')
    }
    if (p.stock < item.quantity) {
      redirect('/checkout?error=Stock insuficiente para ' + p.name)
    }
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const p = productMap.get(item.id)!
    return acc + p.price * item.quantity
  }, 0)

  // ── C-03: Validar que el total sea positivo ──────────────────────────
  if (subtotal <= 0) {
    redirect('/checkout?error=Total inválido')
  }

  const total = subtotal + shipping_cost
  const order_number = 'NAT-' + Math.floor(10000 + Math.random() * 90000)

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      order_number,
      customer_email: email,
      shipping_address: { nombre_completo, cedula, telefono, direccion, ciudad, departamento },
      subtotal,
      shipping_cost,
      total,
      payment_status: 'pending',
      order_status: 'pending',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('[checkout] Error al crear la orden:', orderError)
    redirect('/checkout?error=No se pudo generar la orden')
  }

  const orderItemsData = cartItems.map((item) => {
    const p = productMap.get(item.id)!
    return {
      order_id: order.id,
      product_id: item.id,
      product_name: p.name,
      price: p.price,
      quantity: item.quantity,
    }
  })

  const { error: itemsError } = await db.from('order_items').insert(orderItemsData)
  if (itemsError) {
    console.error('[checkout] Error insertando order_items:', itemsError)
    await db.from('orders').update({ notes: 'ERROR:order_items_failed' }).eq('id', order.id)
    redirect('/checkout?error=Error al registrar los productos. Contáctanos con tu número de orden: ' + order_number)
  }

  // ── Flujo sin MercadoPago (desarrollo / MP_ACCESS_TOKEN vacío) ───────
  if (!MP_ACCESS_TOKEN) {
    const wellnessCode = generateCode()

    const { data: existingAccess } = await db
      .from('wellness_access')
      .select('id')
      .eq('user_email', email)
      .limit(1)
      .maybeSingle()

    if (!existingAccess) {
      try {
        await db.from('wellness_access').insert({
          order_id: order.id,
          code: wellnessCode,
          user_email: email,
          source: 'purchase',
          status: 'active',
        })
      } catch (_) { /* no bloquear si falla */ }
    }

    const customerName = nombre_completo.split(' ')[0]
    const items = cartItems.map((item) => {
      const p = productMap.get(item.id)!
      return { name: p.name, quantity: item.quantity, price: p.price }
    })

    const emailPromises: Promise<unknown>[] = [
      sendOrderConfirmation({
        to: email,
        orderNumber: order_number,
        customerName,
        items,
        total,
        address: nombre_completo + ' - ' + direccion + ', ' + ciudad + ', ' + departamento,
      }),
    ]
    if (!existingAccess) {
      emailPromises.push(sendWellnessCode({ to: email, customerName, code: wellnessCode }))
    }
    await Promise.allSettled(emailPromises)

    redirect('/checkout/success?order=' + order_number + '&status=approved')
  }

  // ── Flujo con MercadoPago ────────────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.natuaroma.shop'
  const mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })
  const preferenceClient = new Preference(mpClient)

  const mpItems = cartItems.map((item) => {
    const p = productMap.get(item.id)!
    return {
      id: item.id,
      title: p.name,
      quantity: item.quantity,
      unit_price: p.price,
      currency_id: 'COP',
    }
  })

  if (shipping_cost > 0) {
    mpItems.push({
      id: 'envio',
      title: 'Envío a ' + departamento,
      quantity: 1,
      unit_price: shipping_cost,
      currency_id: 'COP',
    })
  }

  const { id: preferenceId } = await preferenceClient.create({
    body: {
      items: mpItems,
      payer: { email },
      external_reference: order.id,
      back_urls: {
        success: baseUrl + '/checkout/success?order=' + order_number,
        failure: baseUrl + '/checkout/failure?order=' + order_number,
        pending: baseUrl + '/checkout/pending?order=' + order_number,
      },
      auto_return: 'approved',
      notification_url: baseUrl + '/api/webhooks/mercadopago',
      metadata: { order_id: order.id, order_number },
    },
  })

  await db
    .from('orders')
    .update({ notes: 'mp_preference:' + preferenceId })
    .eq('id', order.id)

  redirect('https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=' + preferenceId)
}
