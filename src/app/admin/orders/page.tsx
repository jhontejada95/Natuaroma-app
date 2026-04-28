import { createClient } from '@/lib/supabase/server'
import { Package, Clock, CheckCircle, XCircle, TruckIcon } from 'lucide-react'
import { updateOrderStatus } from './actions'

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
}

const PAYMENT_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-700' },
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; payment?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('id, order_number, customer_email, total, order_status, payment_status, created_at, shipping_address')
    .order('created_at', { ascending: false })

  if (params?.status) query = query.eq('order_status', params.status)
  if (params?.payment) query = query.eq('payment_status', params.payment)

  const { data: orders } = await query

  const total_revenue = orders
    ?.filter((o) => o.payment_status === 'paid')
    .reduce((acc, o) => acc + (o.total ?? 0), 0) ?? 0

  const filterLink = (key: string, val: string) => {
    const current = key === 'status' ? params?.status : params?.payment
    const other = key === 'status'
      ? (params?.payment ? '&payment=' + params.payment : '')
      : (params?.status ? '&status=' + params.status : '')
    if (current === val) return '/admin/orders' + (other ? '?' + other.slice(1) : '')
    return '/admin/orders?' + key + '=' + val + other
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Ordenes</h1>
          <p className="text-foreground/60 mt-1">{orders?.length ?? 0} ordenes en total</p>
        </div>
        <div className="bg-primary-fixed rounded-xl px-6 py-3 text-center">
          <p className="text-xs text-foreground/50 uppercase tracking-widest">Ingresos Confirmados</p>
          <p className="text-2xl font-display font-bold text-primary">${total_revenue.toLocaleString('es-CO')}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-medium text-foreground/50 self-center">Estado:</span>
        {Object.entries(STATUS_MAP).map(([val, { label }]) => (
          <a
            key={val}
            href={filterLink('status', val)}
            className={'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
              (params?.status === val
                ? 'bg-primary text-surface border-primary'
                : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary')}
          >
            {label}
          </a>
        ))}
        <span className="text-sm font-medium text-foreground/50 self-center ml-4">Pago:</span>
        {Object.entries(PAYMENT_MAP).map(([val, { label }]) => (
          <a
            key={val}
            href={filterLink('payment', val)}
            className={'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
              (params?.payment === val
                ? 'bg-primary text-surface border-primary'
                : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary')}
          >
            {label}
          </a>
        ))}
        {(params?.status || params?.payment) && (
          <a href="/admin/orders" className="px-3 py-1.5 rounded-full text-sm text-error border border-error/30 hover:bg-error-container transition-colors">
            Limpiar filtros
          </a>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        {!orders || orders.length === 0 ? (
          <div className="p-16 text-center text-foreground/40">
            <Package size={40} className="mx-auto mb-4 opacity-30" />
            <p>No hay ordenes con estos filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-dim border-b border-outline-variant">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-xs">Orden</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-xs">Cliente</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-xs">Total</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-xs">Pago</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-xs">Estado</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-xs">Fecha</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {orders.map((order) => {
                  const orderStatus = STATUS_MAP[order.order_status ?? 'pending']
                  const paymentStatus = PAYMENT_MAP[order.payment_status ?? 'pending']
                  const addr = order.shipping_address as any
                  const StatusIcon = orderStatus?.icon ?? Clock

                  return (
                    <tr key={order.id} className="hover:bg-surface-dim transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-primary">{order.order_number}</td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">{order.customer_email}</p>
                        {addr?.ciudad && <p className="text-foreground/40 text-xs">{addr.ciudad}</p>}
                      </td>
                      <td className="px-6 py-4 font-semibold">${(order.total ?? 0).toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4">
                        <span className={'inline-block px-2.5 py-1 rounded-full text-xs font-semibold ' + (paymentStatus?.color ?? '')}>
                          {paymentStatus?.label ?? order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ' + (orderStatus?.color ?? '')}>
                          <StatusIcon size={11} />
                          {orderStatus?.label ?? order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/50">
                        {new Date(order.created_at ?? '').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={'/admin/orders/' + order.id}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Ver detalle
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
