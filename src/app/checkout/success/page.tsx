import { ShieldCheck, ArrowRight } from 'lucide-react'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6 bg-surface-dim p-10 rounded-lg border border-outline-variant">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-display font-medium text-primary tracking-tight">Orden Creada</h1>
        
        <p className="text-foreground/70">
          Tu orden <strong className="text-foreground">{params?.order}</strong> ha sido generada con éxito y está pendiente de pago.
        </p>

        <div className="bg-primary-fixed/20 text-primary-fixed-variant p-4 rounded text-sm">
          <strong>Próximo Paso:</strong> Aquí se integrará Mercado Pago para procesar el cobro.
        </div>

        <div className="pt-4">
          <a href="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Volver a la Tienda <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
