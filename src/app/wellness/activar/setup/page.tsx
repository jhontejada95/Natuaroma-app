import { Leaf } from 'lucide-react'
import { setupWellnessAccount } from './actions'
import { PasswordSetupForm } from '@/components/wellness/PasswordSetupForm'

export default async function WellnessSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; code?: string; email?: string }>
}) {
  const params = await searchParams
  const code = params?.code ?? ''
  const email = params?.email ?? ''

  if (!code || !email) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-surface/70">Enlace invalido. Por favor vuelve a activar tu codigo.</p>
          <a href="/wellness/activar" className="text-accent underline text-sm">Volver</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={32} className="text-accent" />
          </div>
          <div className="inline-flex items-center gap-2 text-surface/40 text-xs uppercase tracking-widest">
            <span className="w-4 h-px bg-surface/20" />
            Paso 2 de 2
            <span className="w-4 h-px bg-surface/20" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Crea tu contrasena</h1>
          <p className="text-surface/60 text-sm">
            Con esto podras ingresar en cualquier momento.
          </p>
          <p className="text-accent/80 text-xs font-mono">{email}</p>
        </div>

        {params?.error && (
          <div className="bg-error/20 border border-error/30 text-surface rounded-xl p-4 text-sm text-center">
            {params.error}
          </div>
        )}

        <PasswordSetupForm code={code} email={email} action={setupWellnessAccount} />

      </div>
    </div>
  )
}
