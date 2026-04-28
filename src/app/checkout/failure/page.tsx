import { XCircle, RefreshCw } from 'lucide-react'

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mx-auto">
          <XCircle size={40} className="text-error" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-display font-bold text-primary">Pago no procesado</h1>
        <p className="text-foreground/60 text-lg">
          El pago no pudo completarse. No te preocupes, no se hizo ningun cobro.
          Puedes intentarlo de nuevo o elegir otro metodo de pago.
        </p>

        {params?.order && (
          <div className="bg-surface-dim rounded-xl p-4 border border-outline-variant">
            <p className="text-sm text-foreground/50">Orden: <span className="font-mono font-semibold text-foreground">{params.order}</span></p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-primary text-surface rounded-xl font-semibold hover:bg-primary-container transition-colors"
          >
            <RefreshCw size={16} />
            Intentar de nuevo
          </a>
          <a
            href="/tienda"
            className="py-3 px-8 border border-outline-variant rounded-xl text-foreground/70 hover:text-primary hover:border-primary transition-colors font-medium"
          >
            Ver productos
          </a>
        </div>
      </div>
    </div>
  )
}
