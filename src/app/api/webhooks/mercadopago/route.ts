import { createAdminClient } from '@/lib/supabase/admin'
import { generateCode } from '@/lib/utils/generateCode'
import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { sendOrderConfirmation, sendWellnessCode } from '@/lib/email'
import { createHmac, timingSafeEqual } from 'crypto'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? ''
const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? ''

function verifyMercadoPagoSignature(req: NextRequest, dataId: string): boolean {
  if (!MP_WEBHOOK_SECRET) {
    console.error('[webhook] MERCADOPAGO_WEBHOOK_SECRET no configurado; rechazando request')
    return false
  }

  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''

  const parts = Object.fromEntries(
    xSignature.split(',').map((part) => {
      const [key, ...value] = part.trim().split('=')
      return [key, value.join('=')]
    })
  )
  const ts = parts.ts ?? ''
  const v1 = parts.v1 ?? ''
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac('sha256', MP_WEBHOOK_SECRET).update(manifest).digest('hex')

  try {
    const expectedBuffer = Buffer.from(expected, 'hex')
    const receivedBuffer = Buffer.from(v1, 'hex')
    return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    let body: Record<string, unknown>
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (body.type !== 'payment' || !(body.data as Record<string, unknown>)?.id) {
      return NextResponse.json({ ok: true })
    }

    if (body.live_mode === false) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String((body.data as Record<string, unknown>).id)

    if (!verifyMercadoPagoSignature(req, paymentId)) {
      console.error('[webhook] Firma invalida; request no autorizado')
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
      const { data: order } = await db
        .from('orders')
        .select('customer_email, order_number, shipping_address, subtotal, payment_status')
        .eq('id', orderId)
        .single()

      if (!order) return NextResponse.json({ ok: true })

      // MercadoPago may retry webhooks. Do not decrement stock or resend emails twice.
      if (order.payment_status === 'paid') {
        return NextResponse.json({ ok: true })
      }

      const { data: orderItems } = await db
        .from('order_items')
        .select('product_id, product_name, quantity, price')
        .eq('order_id', orderId)

      if (!orderItems || orderItems.length === 0) {
        await db
          .from('orders')
          .update({
            payment_status: 'paid',
            order_status: 'cancelled',
            notes: 'STOCK_ERROR:no_items:mp_payment:' + paymentId,
          })
          .eq('id', orderId)
        return NextResponse.json({ ok: true })
      }

      const { error: stockError } = await db.rpc('decrement_order_stock', { p_order_id: orderId })
      if (stockError) {
        console.error('[webhook] Stock insuficiente o RPC faltante:', stockError)
        await db
          .from('orders')
          .update({
            payment_status: 'paid',
            order_status: 'cancelled',
            notes: 'STOCK_ERROR:mp_payment:' + paymentId,
          })
          .eq('id', orderId)
        return NextResponse.json({ ok: true })
      }

      await db
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'processing',
          notes: 'mp_payment:' + paymentId,
        })
        .eq('id', orderId)

      const addr = order.shipping_address as Record<string, string> | null
      const addressStr = addr
        ? addr.nombre_completo + ' - ' + addr.direccion + ', ' + addr.ciudad
        : ''
      const customerName = addr?.nombre_completo?.split(' ')[0] ?? 'Cliente'
      const items = orderItems.map((item) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { data: existingAccess } = await db
        .from('wellness_access')
        .select('id')
        .eq('user_email', order.customer_email)
        .limit(1)
        .maybeSingle()

      if (!existingAccess) {
        const code = generateCode()

        const { error: accessError } = await db.from('wellness_access').insert({
          order_id: orderId,
          code,
          user_email: order.customer_email,
          source: 'purchase',
          status: 'active',
        })

        if (!accessError) {
          await db.from('orders').update({ early_access_sent: true }).eq('id', orderId)
        }

        await Promise.allSettled([
          sendOrderConfirmation({
            to: order.customer_email,
            orderNumber: order.order_number,
            customerName,
            items,
            total: order.subtotal,
            address: addressStr,
          }),
          accessError
            ? Promise.resolve()
            : sendWellnessCode({
                to: order.customer_email,
                customerName,
                code,
              }),
        ])
      } else {
        await sendOrderConfirmation({
          to: order.customer_email,
          orderNumber: order.order_number,
          customerName,
          items,
          total: order.subtotal,
          address: addressStr,
        })
      }
    } else if (status === 'rejected') {
      await db
        .from('orders')
        .update({ payment_status: 'failed', order_status: 'cancelled' })
        .eq('id', orderId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] Error inesperado:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
