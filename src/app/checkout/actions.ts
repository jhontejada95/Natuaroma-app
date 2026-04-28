'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const nombre_completo = formData.get('nombre_completo') as string
  const cedula = formData.get('cedula') as string
  const telefono = formData.get('telefono') as string
  const direccion = formData.get('direccion') as string
  const ciudad = formData.get('ciudad') as string

  const cartItemsRaw = formData.get('cartItems') as string
  const cartItems: { id: string; name: string; quantity: number }[] = JSON.parse(cartItemsRaw)

  if (!cartItems || cartItems.length === 0) {
    redirect('/checkout?error=El carrito esta vacio')
  }

  // Verificar precios desde la BD - nunca confiar en el cliente
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
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const p = productMap.get(item.id)!
    return acc + p.price * item.quantity
  }, 0)
  const shipping_cost = 0
  const total = subtotal + shipping_cost

  const order_number = `NAT-${Math.floor(10000 + Math.random() * 90000)}`

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number,
      customer_email: email,
      shipping_address: { nombre_completo, cedula, telefono, direccion, ciudad },
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

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)
  if (itemsError) {
    console.error('Error al guardar items:', itemsError)
  }

  redirect(`/checkout/success?order=${order_number}`)
}
