import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { sendOrderConfirmation, sendWellnessCode } from '@/lib/email'
import { createHmac } from 'crypto'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? ''
const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? ''

/**
 * Verifica la firma HMAC del webhook de MercadoPago.
 * Solo bloquea si MERCADOPAGO_WEBHOOK_SECRET esta configurado en las env vars.
 * Docs: https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks
 */
function verifyMercadoPagoSignature(req: NextRequest, dataId: string): boolean {
  if (!MP_WEBHOOK_SECRET) return true

  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''

  const parts = Object.fromEntries(xSignature.split(',').map((p) => p.split('=')))
  const ts = parts['ts'] ?? ''
  const v1 = parts['v1'] ?? ''
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac('sha256', MP_WEBHOOK_SECRET).update(manifest).digest('hex')

  return expected === v1
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    let body: any
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true })
    }

    if (body.live_mode === false) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data.id)

    // Verificar firma HMAC antes de procesar
    if (!verifyMercadoPagoSignature(req, paymentId)) {
      console.error('[webhook] Firma invalida — request no autorizado')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })
    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: paymentId })

    const orderId = payment.external_reference
    const status = payment.status

    if (!orderId) return NextResponse.json({ ok: true })

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
