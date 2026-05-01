import { signInWithPassword } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface-dim">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-primary">Natuaroma Admin</h1>
          <p className="text-foreground/60 text-sm mt-2">Acceso exclusivo para el equipo</p>
        </div>

        <form action={signInWithPassword} className="space-y-4">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-surface py-2 rounded hover:bg-primary-container transition-colors font-medium"
          >
            Entrar al panel
          </button>

          {params?.error && (
            <p className="mt-4 p-4 bg-error-container text-on-error-container text-sm rounded">
              {params.error}
            </p>
          )}

          {params?.message && (
            <p className="mt-4 p-4 bg-primary/10 text-primary text-sm rounded text-center">
              {params.message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <a href="/admin/forgot-password" className="text-foreground/40 text-sm hover:text-foreground/60 transition-colors">
            Olvidé mi contraseña
          </a>
        </div>
      </div>
    </div>
  )
}
