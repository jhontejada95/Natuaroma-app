import { Mail } from 'lucide-react'

export default async function WellnessLoginEnviadoPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const params = await searchParams
  const email = params?.email ?? 'tu correo'

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Mail size={40} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">
            Revisa tu correo
          </h1>
          <p className="text-surface/60 leading-relaxed">
            Enviamos un link magico a{' '}
            <span className="text-accent font-medium">{email}</span>.
            <br />
            Haz clic en el enlace para entrar a tu portal Wellness.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3 text-sm text-surface/50">
          <p>El link expira en 1 hora.</p>
          <p>Si no lo ves, revisa tu carpeta de spam.</p>
        </div>

        <a
          href="/wellness/login"
          className="inline-block text-accent text-sm font-medium hover:underline"
        >
          &larr; Volver al inicio de sesion
        </a>
      </div>
    </div>
  )
}
