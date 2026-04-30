import { createClient } from '@/lib/supabase/server'
import { Leaf, CheckCircle, Clock, XCircle, Users, Key, BookOpen, UserPlus, Store, Send } from 'lucide-react'
import { generateWellnessCode, approvePhysicalRequest, createInvitation } from './actions'

export default async function AdminWellnessPage() {
  const supabase = await createClient()
  const db = supabase as any

  const { data: codes } = await db
    .from('wellness_access')
    .select('id, code, user_email, requester_name, activated_at, expires_at, created_at, order_id, source, status, products_claimed, notes')
    .order('created_at', { ascending: false })

  const all = codes ?? []
  const activated = all.filter((c: any) => c.activated_at).length
  const pendingPhysical = all.filter((c: any) => c.source === 'physical' && c.status === 'pending')
  const pendingCount = pendingPhysical.length
  const total = all.length

  const sourceLabel: Record<string, string> = {
    purchase: '🛒 Compra',
    physical: '🏪 Tienda',
    invitation: '🎁 Invitación',
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Wellness</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Accesos, solicitudes e invitaciones</p>
        </div>
        <a href="/admin/wellness/contenido" className="flex items-center gap-2 bg-primary-fixed text-primary rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-primary-fixed-dim transition-colors">
          <BookOpen size={15} /> Gestionar Contenido
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total accesos', value: total, icon: Key, bg: 'bg-surface-container', color: 'text-primary' },
          { label: 'Activados', value: activated, icon: CheckCircle, bg: 'bg-primary-fixed', color: 'text-primary' },
          { label: 'Pendientes físicos', value: pendingCount, icon: Store, bg: pendingCount > 0 ? 'bg-secondary-fixed' : 'bg-surface-container', color: pendingCount > 0 ? 'text-secondary' : 'text-outline' },
          { label: 'Invitaciones', value: all.filter((c: any) => c.source === 'invitation').length, icon: UserPlus, bg: 'bg-surface-container', color: 'text-primary' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-surface rounded-2xl border border-outline-variant p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-2xl font-display font-bold text-primary">{value}</p>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Solicitudes físicas pendientes */}
      {pendingPhysical.length > 0 && (
        <div className="bg-surface rounded-2xl border-2 border-secondary-fixed overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2 bg-secondary-fixed/20">
            <Store size={16} className="text-primary" />
            <h2 className="font-semibold text-primary">Solicitudes físicas pendientes</h2>
            <span className="ml-auto bg-primary text-surface text-xs font-bold px-2.5 py-1 rounded-full">{pendingPhysical.length}</span>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {pendingPhysical.map((c: any) => (
              <div key={c.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm text-on-surface">{c.requester_name ?? '—'}</p>
                  <p className="text-xs text-on-surface-variant">{c.user_email}</p>
                  {c.products_claimed?.length > 0 && (
                    <p className="text-xs text-outline">Productos: {c.products_claimed.join(', ')}</p>
                  )}
                  <p className="text-xs text-outline">{new Date(c.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <form action={approvePhysicalRequest.bind(null, c.id)}>
                  <button type="submit" className="flex items-center gap-2 bg-primary text-surface px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors">
                    <CheckCircle size={14} /> Aprobar y enviar acceso
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crear invitación */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
          <UserPlus size={16} className="text-primary" />
          <h2 className="font-semibold text-primary">Crear invitación</h2>
          <span className="text-xs text-outline ml-2">Para pruebas, beta testers o invitados especiales</span>
        </div>
        <form action={createInvitation} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Nombre</label>
              <input
                type="text" name="inv_name" required placeholder="Nombre del invitado"
                className="w-full px-3 py-2.5 bg-surface-dim border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Correo</label>
              <input
                type="email" name="inv_email" required placeholder="correo@ejemplo.com"
                className="w-full px-3 py-2.5 bg-surface-dim border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Nota interna (opcional)</label>
              <input
                type="text" name="inv_notes" placeholder="Ej: beta tester, prensa..."
                className="w-full px-3 py-2.5 bg-surface-dim border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary-fixed-dim transition-colors">
            <Send size={14} /> Enviar invitación
          </button>
        </form>
      </div>

      {/* Tabla de todos los accesos */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <h2 className="font-semibold text-primary">Todos los accesos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                {['Código', 'Nombre / Email', 'Origen', 'Estado', 'Activado', 'Creado'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map((c: any) => {
                const isActivated = !!c.activated_at
                const isExpired = c.expires_at && new Date(c.expires_at) < new Date()
                const isPending = c.status === 'pending'
                return (
                  <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-surface-dim/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-primary tracking-widest">{c.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface">{c.requester_name ?? '—'}</p>
                      <p className="text-xs text-on-surface-variant">{c.user_email ?? '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant">{sourceLabel[c.source] ?? c.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full">
                          <Clock size={11} /> Por aprobar
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-error-container text-on-error-container px-2.5 py-1 rounded-full">
                          <XCircle size={11} /> Expirado
                        </span>
                      ) : isActivated ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-fixed text-primary px-2.5 py-1 rounded-full">
                          <CheckCircle size={11} /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-surface-container text-outline px-2.5 py-1 rounded-full">
                          <Clock size={11} /> Sin activar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant">
                        {c.activated_at ? new Date(c.activated_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant">
                        {new Date(c.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {all.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">No hay accesos registrados aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
