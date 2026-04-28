import { Clock, Mail } from 'lucide-react'

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto">
          <Clock size={40} className="text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-display font-bold text-primary">Pago en proceso</h1>
        <p className="text-foreground/60 text-lg">
          Tu pago esta siendo verificado. Esto puede tomar algunos minutos.
          Te enviaremos un correo cuando se confirme.
        </p>

        {params?.order && (
          <div className="bg-surface-dim rounded-xl p-6 border border-outline-variant">
            <p className="text-sm text-foreground/50 uppercase tracking-widest mb-1">Numero de Orden</p>
            <p className="text-xl font-mono font-bold text-primary">{params.order}</p>
          </div>
        )}

        <div className="flex items-start gap-3 bg-primary-fixed/30 rounded-xl p-4 text-left">
          <Mail size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/70">
            Guarda tu numero de orden. Cuando el pago sea confirmado recibiras un email
            con los detalles del envio y tu codigo de acceso Wellness.
          </p>
        </div>

        <a
          href="/"
          className="inline-block py-3 px-8 bg-primary text-surface rounded-xl font-semibold hover:bg-primary-container transition-colors"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  )
}
