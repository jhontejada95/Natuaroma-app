import { Leaf } from 'lucide-react'
import { sendWellnessPasswordReset } from './actions'

export default async function WellnessForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Natuaroma Wellness</h1>
          <p className="text-surface/60">Recuperar contraseña</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-5">
          {params?.sent ? (
            <div className="space-y-5">
              <div className="bg-accent/15 border border-accent/30 rounded-xl p-5 text-center space-y-2">
                <p className="text-accent font-semibold text-sm">📧 Revisa tu correo</p>
                <p className="text-surface/60 text-sm">
                  Si el correo tiene una cuenta Wellness activa, recibirás un enlace
                  para restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
              <a
                href="/wellness/login"
                className="block text-center text-accent text-sm hover:underline"
              >
                ← Volver al login
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="text-surface font-semibold text-base">Olvidé mi contraseña</h2>
                <p className="text-surface/50 text-sm">
                  Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
                </p>
              </div>

              {params?.error && (
                <div className="bg-error/20 border border-error/30 text-surface rounded-xl p-3 text-sm text-center">
                  {params.error}
                </div>
              )}

              <form action={sendWellnessPasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface/70 mb-2">
                    Correo electrónico
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
                  Enviar enlace de recuperación
                </button>
              </form>

              <div className="text-center">
                <a href="/wellness/login" className="text-surface/40 text-sm hover:text-surface/60 transition-colors">
                  ← Volver al login
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
