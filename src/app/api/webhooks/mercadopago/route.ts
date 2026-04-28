import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data.id)
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })
    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: paymentId })

    const orderId = payment.external_reference
    const status = payment.status

    if (!orderId) return NextResponse.json({ ok: true })

    const supabase = await createClient()
    const db = supabase as any

    if (status === 'approved') {
      await db
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'processing',
          notes: 'mp_payment:' + paymentId,
        })
        .eq('id', orderId)

      const code = 'WELLNESS-' + Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data: order } = await supabase
        .from('orders')
        .select('customer_email, order_number')
        .eq('id', orderId)
        .single()

      if (order) {
        await db.from('wellness_access').insert({
          order_id: orderId,
          code,
          user_email: order.customer_email,
        })

        await db
          .from('orders')
          .update({ early_access_sent: false })
          .eq('id', orderId)
      }
    } else if (status === 'rejected') {
      await supabase
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
