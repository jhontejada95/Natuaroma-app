import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { setupWellnessAccount } from './actions'

export default async function WellnessSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; code?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/wellness/login')

  const db = supabase as any
  const { data: access } = await db
    .from('wellness_access')
    .select('password_set')
    .eq('user_id', user.id)
    .not('activated_at', 'is', null)
    .maybeSingle()

  if (access?.password_set) redirect('/wellness')

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Configura tu cuenta</h1>
          <p className="text-surface/60 text-sm">
            Crea una contrasena para ingresar facilmente en el futuro.
          </p>
        </div>

        {params?.error && (
          <div className="bg-error/20 border border-error/30 text-surface rounded-xl p-4 text-sm text-center">
            {params.error}
          </div>
        )}

        <form
          action={setupWellnessAccount}
          className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6"
        >
          <input type="hidden" name="code" value={params?.code ?? ''} />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface/70 mb-2">
                Nueva contrasena
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                placeholder="Minimo 8 caracteres"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface/70 mb-2">
                Confirmar contrasena
              </label>
              <input
                type="password"
                name="password_confirm"
                required
                minLength={8}
                placeholder="Repite tu contrasena"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <p className="text-surface/80 text-sm font-medium">Comunicaciones</p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="marketing_consent"
                value="true"
                className="mt-1 w-4 h-4 rounded accent-[#e1c385] cursor-pointer"
              />
              <span className="text-surface/60 text-sm leading-relaxed">
                Acepto recibir contenido de bienestar, promociones y novedades de Natuaroma.
                Puedes cancelar en cualquier momento.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Guardar y entrar al portal
          </button>
        </form>

        <div className="text-center">
          <a
            href="/wellness"
            className="text-surface/40 text-sm hover:text-surface/60 transition-colors"
          >
            Omitir por ahora &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}
