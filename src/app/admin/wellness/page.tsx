import { createClient } from '@/lib/supabase/server'
import { Leaf, CheckCircle, Clock, XCircle, Users, Key, BookOpen } from 'lucide-react'
import { generateWellnessCode } from './actions'

export default async function AdminWellnessPage() {
  const supabase = await createClient()
  const db = supabase as any

  const { data: codes } = await db
    .from('wellness_access')
    .select('id, code, user_email, activated_at, expires_at, created_at, order_id')
    .order('created_at', { ascending: false })

  const total = codes?.length ?? 0
  const activated = (codes ?? []).filter((c: any) => c.activated_at).length
  const pending = (codes ?? []).filter((c: any) => !c.activated_at).length
  const expired = (codes ?? []).filter((c: any) => c.expires_at && new Date(c.expires_at) < new Date()).length

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Wellness</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Codigos de acceso y usuarios</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/admin/wellness/contenido"
            className="flex items-center gap-2 bg-primary-fixed text-primary rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-primary-fixed-dim transition-colors"
          >
            <BookOpen size={15} />
            Gestionar Contenido
          </a>
          <form action={generateWellnessCode}>
            <button
              type="submit"
              className="flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-secondary-fixed-dim transition-colors"
            >
              <Key size={15} />
              Generar codigo
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total codigos', value: total, icon: Key, bg: 'bg-surface-container', color: 'text-primary' },
          { label: 'Activados', value: activated, icon: CheckCircle, bg: 'bg-primary-fixed', color: 'text-primary' },
          { label: 'Pendientes', value: pending, icon: Clock, bg: 'bg-secondary-fixed', color: 'text-secondary' },
          { label: 'Expirados', value: expired, icon: XCircle, bg: 'bg-error-container', color: 'text-error' },
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

      {/* Tabla de codigos */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <h2 className="font-semibold text-primary">Todos los codigos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                {['Codigo', 'Email', 'Estado', 'Activado', 'Expira', 'Creado'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(codes ?? []).map((c: any) => {
                const isActivated = !!c.activated_at
                const isExpired = c.expires_at && new Date(c.expires_at) < new Date()
                return (
                  <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-surface-dim/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-primary tracking-widest">{c.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface">{c.user_email ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {isExpired ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-error-container text-on-error-container px-2.5 py-1 rounded-full">
                          <XCircle size={11} /> Expirado
                        </span>
                      ) : isActivated ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-fixed text-primary px-2.5 py-1 rounded-full">
                          <CheckCircle size={11} /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full">
                          <Clock size={11} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant">
                        {c.activated_at
                          ? new Date(c.activated_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: '2-digit' })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant">
                        {c.expires_at
                          ? new Date(c.expires_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: '2-digit' })
                          : 'Sin límite'}
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
              {(!codes || codes.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    No hay codigos generados aun
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
