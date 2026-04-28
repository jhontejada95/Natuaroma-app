'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  // 1. Extraer datos del formulario
  const email = formData.get('email') as string
  const nombre_completo = formData.get('nombre_completo') as string
  const cedula = formData.get('cedula') as string
  const telefono = formData.get('telefono') as string
  const direccion = formData.get('direccion') as string
  const ciudad = formData.get('ciudad') as string
  
  // Extraer items del carrito (vienen serializados desde el cliente)
  const cartItemsRaw = formData.get('cartItems') as string
  const cartItems = JSON.parse(cartItemsRaw)
  
  if (!cartItems || cartItems.length === 0) {
    redirect('/checkout?error=El carrito esta vacio')
  }

  // 2. Calcular totales (siempre re-calculamos en el servidor por seguridad)
  const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
  const shipping_cost = 0 // Flete fijo o calculado (por ahora 0)
  const total = subtotal + shipping_cost

  // Generar número de orden aleatorio simple
  const order_number = `NAT-${Math.floor(10000 + Math.random() * 90000)}`

  // 3. Insertar la Orden en Supabase
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    order_number,
    customer_email: email,
    shipping_address: {
      nombre_completo,
      cedula,
      telefono,
      direccion,
      ciudad
    },
    subtotal,
    shipping_cost,
    total,
    payment_status: 'pending',
    order_status: 'pending'
  }).select('id').single()

  if (orderError || !order) {
    console.error('Error al crear la orden:', orderError)
    redirect('/checkout?error=No se pudo generar la orden')
  }

  // 4. Insertar los items de la orden
  const orderItemsData = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)

  if (itemsError) {
    console.error('Error al guardar items:', itemsError)
    // Deberíamos hacer rollback o manejar esto, por ahora para MVP lo reportamos
  }

  // 5. Redireccionar (Próximamente aquí irá Mercado Pago)
  // Por ahora redireccionamos a una página de éxito temporal
  redirect(`/checkout/success?order=${order_number}`)
}
