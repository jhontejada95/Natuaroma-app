import { Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WellnessLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; tab?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect(params?.next ?? '/wellness')

  const activeTab = params?.tab === 'password' ? 'password' : 'magic'

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Natuaroma Wellness</h1>
          <p className="text-surface/60">Tu espacio de bienestar natural</p>
        </div>

        {params?.error && (
          <div className="bg-error/20 text-surface border border-error/30 rounded-xl p-4 text-sm text-center">
            {params.error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex border-b border-white/10">
            <a
              href={'/wellness/login' + (params?.next ? '?next=' + encodeURIComponent(params.next) : '')}
              className={'flex-1 py-3 text-center text-sm font-medium transition-colors ' +
                (activeTab === 'magic'
                  ? 'bg-accent/15 text-accent border-b-2 border-accent'
                  : 'text-surface/50 hover:text-surface/70')}
            >
              Link magico
            </a>
            <a
              href={'/wellness/login?tab=password' + (params?.next ? '&next=' + encodeURIComponent(params.next) : '')}
              className={'flex-1 py-3 text-center text-sm font-medium transition-colors ' +
                (activeTab === 'password'
                  ? 'bg-accent/15 text-accent border-b-2 border-accent'
                  : 'text-surface/50 hover:text-surface/70')}
            >
              Contrasena
            </a>
          </div>

          <div className="p-8">
            {activeTab === 'magic' ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-surface font-semibold text-base">Ingresa sin contrasena</h2>
                  <p className="text-surface/50 text-sm">
                    Te enviamos un link magico por correo.
                    Usa el mismo correo con el que compraste.
                  </p>
                </div>
                <form action="/auth/wellness-magic-link" method="POST" className="space-y-4">
                  <input type="hidden" name="next" value={params?.next ?? '/wellness'} />
                  <div>
                    <label className="block text-sm font-medium text-surface/70 mb-2">
                      Correo electronico
                    </label>
                    <input
                      type="email"
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
                    Enviar link de acceso
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-surface font-semibold text-base">Ingresa con contrasena</h2>
                  <p className="text-surface/50 text-sm">
                    Usa el correo y la contrasena que configuraste.
                  </p>
                </div>
                <form action="/auth/wellness-password-login" method="POST" className="space-y-4">
                  <input type="hidden" name="next" value={params?.next ?? '/wellness'} />
                  <div>
                    <label className="block text-sm font-medium text-surface/70 mb-2">
                      Correo electronico
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface/70 mb-2">
                      Contrasena
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Tu contrasena"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    Ingresar
                  </button>
                </form>
                <div className="text-center pt-1">
                  <p className="text-surface/40 text-xs">
                    Olvidaste tu contrasena?{' '}
                    <a
                      href={'/wellness/login' + (params?.next ? '?next=' + encodeURIComponent(params.next) : '')}
                      className="text-accent hover:underline"
                    >
                      Usa link magico
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-surface/40 text-sm">No tienes acceso aun?</p>
          <a
            href="/wellness/activar"
            className="text-accent text-sm font-medium hover:underline"
          >
            Activar con codigo Early Access &rarr;
          </a>
          <br />
          <a href="/tienda" className="text-surface/40 text-xs hover:text-surface/60 transition-colors">
            Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  )
}
