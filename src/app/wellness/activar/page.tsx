import { Leaf, Gift, ArrowRight } from 'lucide-react'
import { activateWellnessCode } from './actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WellnessActivarPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; success?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si ya tiene acceso activo, redirigir al portal
  if (user) {
    const db = supabase as any
    const { data: existing } = await db
      .from('wellness_access')
      .select('id')
      .eq('user_id', user.id)
      .not('activated_at', 'is', null)
      .maybeSingle()
    if (existing) redirect('/wellness')
  }

  if (params?.success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={40} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Acceso Activado</h1>
          <p className="text-surface/60">Tu cuenta Wellness esta lista. Revisa tu correo para entrar.</p>
          <a
            href="/wellness/login"
            className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Ir al portal <ArrowRight size={16} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <Gift size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Activa tu Acceso</h1>
          <p className="text-surface/60 text-sm">
            Ingresa el codigo Early Access que recibiste en tu correo despues de comprar
          </p>
        </div>

        {params?.error && (
          <div className="bg-error/20 border border-error/30 text-surface rounded-xl p-4 text-sm text-center">
            {params.error}
          </div>
        )}

        <form action={activateWellnessCode} className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-surface/70 mb-2">
              Codigo Early Access
            </label>
            <input
              type="text"
              id="code"
              name="code"
              required
              defaultValue={params?.code ?? ''}
              placeholder="WELLNESS-XXXXXX"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors font-mono text-lg text-center uppercase tracking-widest"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface/70 mb-2">
              Tu correo electronico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Activar Acceso Wellness
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-surface/40 text-sm">Ya tienes cuenta?</p>
          <a href="/wellness/login" className="text-accent text-sm font-medium hover:underline">
            Ingresar aqui &rarr;
          </a>
          <br />
          <a href="/tienda" className="text-surface/40 text-xs hover:text-surface/60">
            Comprar para obtener acceso
          </a>
        </div>
      </div>
    </div>
  )
}
