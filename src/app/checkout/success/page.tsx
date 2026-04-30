import { CheckCircle, ArrowRight, Gift } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string; payment_id?: string }>
}) {
  const params = await searchParams
  const orderNumber = params?.order ?? ''
  const status = params?.status ?? 'pending'
  const isApproved = status === 'approved'

  let wellnessCode: string | null = null
  if (isApproved && orderNumber) {
    const db = createAdminClient()
    const { data: order } = await db
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single()

    if (order) {
      const { data: access } = await db
        .from('wellness_access')
        .select('code')
        .eq('order_id', order.id)
        .single()
      wellnessCode = access?.code ?? null
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">
            {isApproved ? 'Pago Exitoso' : 'Orden Recibida'}
          </h1>
          <p className="text-foreground/60 text-lg">
            {isApproved
              ? 'Tu compra ha sido confirmada. Pronto recibiras un correo con los detalles.'
              : 'Tu orden esta siendo procesada. Te notificaremos cuando se confirme el pago.'}
          </p>
        </div>

        <div className="bg-surface-dim rounded-xl p-6 border border-outline-variant text-center">
          <p className="text-sm text-foreground/50 uppercase tracking-widest font-medium mb-1">Numero de Orden</p>
          <p className="text-2xl font-display font-bold text-primary font-mono">{orderNumber}</p>
        </div>

        {wellnessCode && (
          <div className="bg-primary-fixed rounded-xl p-6 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Gift size={20} />
              <span>Regalo Exclusivo: Acceso Wellness</span>
            </div>
            <p className="text-sm text-foreground/70">
              Como cliente Natuaroma, tienes acceso anticipado a nuestra app de bienestar.
              Usa este codigo para activar tu cuenta:
            </p>
            <div className="bg-white/60 rounded-lg px-4 py-3 font-mono text-xl font-bold text-primary text-center tracking-widest border border-primary/20">
              {wellnessCode}
            </div>
            <a
              href={'/wellness/activar?code=' + wellnessCode}
              className="block text-center text-sm text-primary font-semibold hover:underline"
            >
              Activar acceso ahora &rarr;
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/tienda"
            className="flex-1 text-center py-3 px-6 border border-outline-variant rounded-xl text-foreground/70 hover:text-primary hover:border-primary transition-colors font-medium"
          >
            Seguir Comprando
          </a>
          <a
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary text-surface rounded-xl font-semibold hover:bg-primary-container transition-colors"
          >
            Volver al Inicio <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
