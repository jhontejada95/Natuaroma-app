import { sendAdminPasswordReset } from './actions'

export default async function AdminForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface-dim">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-primary">Natuaroma Admin</h1>
          <p className="text-foreground/60 text-sm mt-2">Recuperar contraseña</p>
        </div>

        {params?.sent ? (
          <div className="space-y-6">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center space-y-2">
              <p className="text-primary font-semibold text-sm">📧 Correo enviado</p>
              <p className="text-foreground/70 text-sm">
                Si el correo está registrado como administrador, recibirás un enlace para
                restablecer tu contraseña en los próximos minutos.
              </p>
            </div>
            <a
              href="/admin/login"
              className="block text-center text-primary text-sm hover:underline"
            >
              ← Volver al login
            </a>
          </div>
        ) : (
          <form action={sendAdminPasswordReset} className="space-y-4">
            <p className="text-foreground/70 text-sm mb-4">
              Ingresa tu correo de administrador y te enviaremos un enlace para restablecer
              tu contraseña.
            </p>

            {params?.error && (
              <p className="p-3 bg-error-container text-on-error-container text-sm rounded">
                {params.error}
              </p>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@natuaroma.com"
                className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-surface py-2 rounded hover:bg-primary-container transition-colors font-medium"
            >
              Enviar enlace de recuperación
            </button>

            <a
              href="/admin/login"
              className="block text-center text-foreground/50 text-sm hover:text-foreground/70 transition-colors"
            >
              ← Volver al login
            </a>
          </form>
        )}
      </div>
    </div>
  )
}
