import { createAdminClient } from "@/lib/supabase/admin"
import { ShoppingCart, Package, Leaf, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createAdminClient()
  const db = supabase as any

  // Datos en paralelo
  const [
    { data: allOrders },
    { data: products },
    { data: wellnessAccess },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('id, total, payment_status, order_status, created_at'),
    supabase.from('products').select('id, status'),
    db.from('wellness_access').select('id, activated_at'),
    supabase.from('orders').select('id, order_number, customer_email, total, payment_status, order_status, created_at').order('created_at', { ascending: false }).limit(8),
  ])

  const paid = (allOrders ?? []).filter((o: any) => o.payment_status === 'paid')
  const pending = (allOrders ?? []).filter((o: any) => o.payment_status === 'pending')
  const totalRevenue = paid.reduce((s: number, o: any) => s + (o.total ?? 0), 0)
  const activeProducts = (products ?? []).filter((p: any) => p.status === 'active').length
  const wellnessActivated = (wellnessAccess ?? []).filter((w: any) => w.activated_at).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const ordersToday = (allOrders ?? []).filter((o: any) => new Date(o.created_at) >= today).length

  const STATS = [
    {
      label: 'Ingresos Confirmados',
      value: '$' + totalRevenue.toLocaleString('es-CO'),
      sub: 'COP',
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary-fixed',
    },
    {
      label: 'Pedidos Totales',
      value: allOrders?.length ?? 0,
      sub: `${ordersToday} hoy`,
      icon: ShoppingCart,
      color: 'text-secondary',
      bg: 'bg-secondary-fixed',
    },
    {
      label: 'Pendientes de Pago',
      value: pending.length,
      sub: 'por confirmar',
      icon: Clock,
      color: 'text-error',
      bg: 'bg-error-container',
    },
    {
      label: 'Productos Activos',
      value: activeProducts,
      sub: `de ${products?.length ?? 0} totales`,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-tertiary-fixed',
    },
    {
      label: 'Wellness Activados',
      value: wellnessActivated,
      sub: `de ${wellnessAccess?.length ?? 0} codigos`,
      icon: Leaf,
      color: 'text-primary',
      bg: 'bg-primary-fixed-dim/40',
    },
  ]

  const STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-secondary-fixed text-on-secondary-fixed' },
    processing: { label: 'En proceso', color: 'bg-primary-fixed text-primary' },
    shipped: { label: 'Enviado', color: 'bg-tertiary-fixed text-tertiary' },
    delivered: { label: 'Entregado', color: 'bg-primary-fixed text-primary' },
    cancelled: { label: 'Cancelado', color: 'bg-error-container text-on-error-container' },
  }

  const PAY_MAP: Record<string, { label: string; icon: any }> = {
    paid: { label: 'Pagado', icon: CheckCircle },
    pending: { label: 'Pendiente', icon: Clock },
    failed: { label: 'Fallido', icon: AlertCircle },
  }

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Dashboard</h1>
        <p className="text-on-surface-variant mt-1 text-sm">Resumen de Natuaroma</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-surface rounded-2xl border border-outline-variant p-5 space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">{value}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">{label}</p>
              <p className="text-xs text-outline mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ultimas ordenes */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-display font-semibold text-primary text-lg">Ultimas Ordenes</h2>
          <a href="/admin/orders" className="text-sm text-primary hover:underline font-medium">
            Ver todas
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                {['Orden', 'Cliente', 'Total', 'Pago', 'Estado', 'Fecha', ''].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders ?? []).map((order: any) => {
                const pay = PAY_MAP[order.payment_status] ?? { label: order.payment_status, icon: Clock }
                const PayIcon = pay.icon
                const status = STATUS_MAP[order.order_status] ?? { label: order.order_status, color: 'bg-surface-dim text-outline' }
                return (
                  <tr key={order.id} className="border-b border-outline-variant/50 hover:bg-surface-dim/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-primary">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface truncate max-w-[160px] block">{order.customer_email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-sm text-primary">${(order.total ?? 0).toLocaleString('es-CO')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        <PayIcon size={13} className={order.payment_status === 'paid' ? 'text-green-600' : order.payment_status === 'failed' ? 'text-error' : 'text-secondary'} />
                        {pay.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/admin/orders/${order.id}`} className="text-xs text-primary hover:underline font-medium">
                        Ver
                      </a>
                    </td>
                  </tr>
                )
              })}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    No hay ordenes aun
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/products/new" className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-outline-variant hover:border-primary/30 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center">
            <Package size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-primary group-hover:underline">Nuevo producto</p>
            <p className="text-xs text-on-surface-variant">Agregar al catalogo</p>
          </div>
        </a>
        <a href="/admin/wellness" className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-outline-variant hover:border-primary/30 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-tertiary-fixed rounded-xl flex items-center justify-center">
            <Leaf size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-primary group-hover:underline">Usuarios Wellness</p>
            <p className="text-xs text-on-surface-variant">Ver codigos y accesos</p>
          </div>
        </a>
        <a href="/admin/orders?status=pending" className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-outline-variant hover:border-primary/30 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-error-container rounded-xl flex items-center justify-center">
            <Clock size={18} className="text-error" />
          </div>
          <div>
            <p className="font-semibold text-sm text-primary group-hover:underline">Pedidos Pendientes</p>
            <p className="text-xs text-on-surface-variant">{pending.length} por confirmar</p>
          </div>
        </a>
      </div>
    </div>
  )
}
