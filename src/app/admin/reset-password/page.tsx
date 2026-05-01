import { updateAdminPassword } from './actions'

export default async function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface-dim">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-primary">Natuaroma Admin</h1>
          <p className="text-foreground/60 text-sm mt-2">Crear nueva contraseña</p>
        </div>

        <form action={updateAdminPassword} className="space-y-4">
          {params?.error && (
            <p className="p-3 bg-error-container text-on-error-container text-sm rounded">
              {params.error}
            </p>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-foreground mb-1">
              Confirmar contraseña
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              required
              minLength={8}
              placeholder="Repite la contraseña"
              className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-surface py-2 rounded hover:bg-primary-container transition-colors font-medium"
          >
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </div>
  )
}
