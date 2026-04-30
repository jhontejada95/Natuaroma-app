import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, MapPin, Mail, Phone, CreditCard } from 'lucide-react'
import { updateOrderStatus } from '../actions'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', processing: 'Procesando', shipped: 'Enviado',
  delivered: 'Entregado', cancelled: 'Cancelado',
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()
  const db = supabase as any

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from('orders').select('*').eq('id', id).single(),
    supabase.from('order_items').select('*').eq('order_id', id),
  ])

  if (!order) notFound()

  const addr = order.shipping_address as any
  const orderNotes = (order as any).notes as string | null

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <a
          href="/admin/orders"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-foreground/50 hover:text-primary hover:border-primary transition-colors"
        >
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-2xl font-display font-bold text-primary font-mono">{order.order_number}</h1>
          <p className="text-foreground/50 text-sm">
            {new Date(order.created_at ?? '').toLocaleString('es-CO', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="ml-auto">
          <span className={'px-3 py-1.5 rounded-full text-sm font-semibold ' +
            (order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
            {order.payment_status === 'paid' ? 'Pagado' : 'Pago pendiente'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <Package size={18} className="text-primary" />
              <h2 className="font-semibold text-primary">Productos</h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {items?.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.product_name}</p>
                    <p className="text-sm text-foreground/50">x{item.quantity} &times; ${(item.price ?? 0).toLocaleString('es-CO')}</p>
                  </div>
                  <p className="font-semibold text-primary">${((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString('es-CO')}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-surface-dim border-t border-outline-variant space-y-1.5">
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Subtotal</span><span>${(order.subtotal ?? 0).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Envio</span><span>{(order.shipping_cost ?? 0) === 0 ? 'Gratis' : '$' + order.shipping_cost?.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-bold text-primary pt-2 border-t border-outline-variant">
                <span>Total</span><span>${(order.total ?? 0).toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-semibold text-primary">Estado del Pedido</h2>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map((s) => {
                const updateAction = updateOrderStatus.bind(null, id, s)
                return (
                  <form key={s} action={updateAction}>
                    <button
                      type="submit"
                      className={'px-4 py-2 rounded-full text-sm font-medium border transition-colors ' +
                        (order.order_status === s
                          ? 'bg-primary text-surface border-primary'
                          : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary')}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  </form>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-semibold text-primary flex items-center gap-2"><Mail size={16} /> Cliente</h2>
            <div className="space-y-2 text-sm">
              <p className="text-foreground">{addr?.nombre_completo ?? 'N/D'}</p>
              <p className="text-foreground/60">{order.customer_email}</p>
              {addr?.telefono && (
                <p className="flex items-center gap-1.5 text-foreground/60"><Phone size={12} /> {addr.telefono}</p>
              )}
              {addr?.cedula && (
                <p className="text-foreground/50 text-xs">C.C. {addr.cedula}</p>
              )}
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-semibold text-primary flex items-center gap-2"><MapPin size={16} /> Envio</h2>
            <div className="text-sm space-y-1">
              <p className="text-foreground">{addr?.direccion}</p>
              <p className="text-foreground/60">{addr?.ciudad}, Colombia</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-semibold text-primary flex items-center gap-2"><CreditCard size={16} /> Pago</h2>
            <div className="text-sm space-y-1">
              <p className="text-foreground/60">Estado: <span className="font-medium text-foreground">{order.payment_status}</span></p>
              {orderNotes && orderNotes.startsWith('mp_payment:') && (
                <p className="text-xs text-foreground/40 font-mono">ID MP: {orderNotes.replace('mp_payment:', '')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
