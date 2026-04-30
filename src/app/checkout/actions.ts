'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { sendOrderConfirmation, sendWellnessCode } from '@/lib/email'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? ''

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const db = supabase as any

  const email = formData.get('email') as string
  const nombre_completo = formData.get('nombre_completo') as string
  const cedula = formData.get('cedula') as string
  const telefono = formData.get('telefono') as string
  const direccion = formData.get('direccion') as string
  const ciudad = formData.get('ciudad') as string
  const departamento = formData.get('departamento') as string
  const shipping_cost = parseInt(formData.get('shipping_cost') as string ?? '0', 10)

  const cartItemsRaw = formData.get('cartItems') as string
  const cartItems: { id: string; name: string; quantity: number }[] = JSON.parse(cartItemsRaw)

  if (!cartItems || cartItems.length === 0) {
    redirect('/checkout?error=El carrito esta vacio')
  }

  const productIds = cartItems.map((i) => i.id)
  const { data: dbProducts, error: fetchError } = await supabase
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
      redirect('/checkout?error=Uno o mas productos no estan disponibles')
    }
    if (p.stock < item.quantity) {
      redirect('/checkout?error=Stock insuficiente para ' + p.name)
    }
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const p = productMap.get(item.id)!
    return acc + p.price * item.quantity
  }, 0)

  const total = subtotal + shipping_cost
  const order_number = 'NAT-' + Math.floor(10000 + Math.random() * 90000)

  const { data: order, error: orderError } = await supabase
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
    console.error('Error al crear la orden:', orderError)
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

  await supabase.from('order_items').insert(orderItemsData)

  if (!MP_ACCESS_TOKEN) {
    const wellnessCode = 'WELLNESS-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    await db.from('wellness_access').insert({
      order_id: order.id,
      code: wellnessCode,
      user_email: email,
    }).catch(() => {})

    const customerName = nombre_completo.split(' ')[0]
    const items = cartItems.map((item) => {
      const p = productMap.get(item.id)!
      return { name: p.name, quantity: item.quantity, price: p.price }
    })

    await Promise.allSettled([
      sendOrderConfirmation({
        to: email,
        orderNumber: order_number,
        customerName,
        items,
        total,
        address: nombre_completo + ' - ' + direccion + ', ' + ciudad + ', ' + departamento,
      }),
      sendWellnessCode({ to: email, customerName, code: wellnessCode }),
    ])

    redirect('/checkout/success?order=' + order_number + '&status=approved')
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.natuaroma.shop'
  const mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })
  const preferenceClient = new Preference(mpClient)

  // Items de productos
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

  // Agregar envío como item separado en Mercado Pago
  if (shipping_cost > 0) {
    mpItems.push({
      id: 'envio',
      title: `Envío a ${departamento}`,
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
