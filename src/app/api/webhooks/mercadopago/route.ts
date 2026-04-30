import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { sendOrderConfirmation, sendWellnessCode } from '@/lib/email'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true })
    }

    if (body.live_mode === false) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data.id)
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })
    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: paymentId })

    const orderId = payment.external_reference
    const status = payment.status

    if (!orderId) return NextResponse.json({ ok: true })

    // Usar admin client — el webhook corre sin sesion de usuario
    const db = createAdminClient()

    if (status === 'approved') {
      await db
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'processing',
          notes: 'mp_payment:' + paymentId,
        })
        .eq('id', orderId)

      const { data: order } = await db
        .from('orders')
        .select('customer_email, order_number, shipping_address, subtotal')
        .eq('id', orderId)
        .single()

      if (order) {
        const addr = order.shipping_address as any
        const addressStr = addr
          ? addr.nombre_completo + ' - ' + addr.direccion + ', ' + addr.ciudad
          : ''
        const customerName = addr?.nombre_completo?.split(' ')[0] ?? 'Cliente'

        const { data: orderItems } = await db
          .from('order_items')
          .select('product_name, quantity, price')
          .eq('order_id', orderId)

        const items = (orderItems ?? []).map((i: any) => ({
          name: i.product_name,
          quantity: i.quantity,
          price: i.price,
        }))

        // Verificar si el email ya tiene acceso Wellness (compra repetida)
        const { data: existingAccess } = await db
          .from('wellness_access')
          .select('id')
          .eq('user_email', order.customer_email)
          .limit(1)
          .maybeSingle()

        const isFirstPurchase = !existingAccess

        if (isFirstPurchase) {
          const code = 'NAT-' + Math.random().toString(36).substring(2, 8).toUpperCase()

          await db.from('wellness_access').insert({
            order_id: orderId,
            code,
            user_email: order.customer_email,
            source: 'purchase',
            status: 'active',
          })

          await db
            .from('orders')
            .update({ early_access_sent: true })
            .eq('id', orderId)

          // Primera compra: confirmacion + codigo wellness
          await Promise.allSettled([
            sendOrderConfirmation({
              to: order.customer_email,
              orderNumber: order.order_number,
              customerName,
              items,
              total: order.subtotal,
              address: addressStr,
            }),
            sendWellnessCode({
              to: order.customer_email,
              customerName,
              code,
            }),
          ])
        } else {
          // Compra repetida: solo confirmacion de orden
          await sendOrderConfirmation({
            to: order.customer_email,
            orderNumber: order.order_number,
            customerName,
            items,
            total: order.subtotal,
            address: addressStr,
          })
        }
      }
    } else if (status === 'rejected') {
      await db
        .from('orders')
        .update({ payment_status: 'failed', order_status: 'cancelled' })
        .eq('id', orderId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('MP webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
