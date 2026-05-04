import { createClient } from '@/lib/supabase/server'
import { submitPhysicalRegistration } from './actions'
import { Leaf, CheckCircle } from 'lucide-react'

const LOCATION_LABELS: Record<string, string> = {
  salento:    'Tienda Salento',
  armenia_cc: 'Armenia (Centro Comercial)',
  equipo:     'Invitación del equipo',
}

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; source?: string }>
}) {
  const params = await searchParams
  const source = params.source ?? ''
  const locationLabel = LOCATION_LABELS[source] ?? null
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .eq('status', 'active')
    .order('name')

  if (params.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={36} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl italic text-primary mb-3">¡Solicitud enviada!</h1>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Recibimos tu registro. En breve nuestro equipo lo revisará y recibirás un correo con tu acceso al portal Natuaroma Wellness.
            </p>
          </div>
          <div className="bg-primary-fixed/30 rounded-2xl p-5">
            <p className="font-body text-sm text-on-surface-variant">
              🌿 Mientras tanto, explora nuestros productos en <a href="/tienda" className="text-primary font-semibold underline-offset-2 hover:underline">la tienda</a>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-primary-fixed-dim/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-lg mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf size={20} className="text-primary" />
            <span className="font-display font-bold text-xl italic text-primary">Natuaroma</span>
          </div>
          <h1 className="font-display text-4xl italic text-primary leading-tight mb-3">
            Activa tu acceso<br />Wellness
          </h1>
          <p className="font-body text-on-surface-variant text-sm leading-relaxed">
            Compraste en una de nuestras tiendas físicas. Regístrate para recibir tu acceso exclusivo al portal de bienestar.
          </p>
        </div>

        {params.error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm">
            {params.error}
          </div>
        )}

        <form action={submitPhysicalRegistration} className="space-y-6">
          {/* Campo oculto con el punto de origen del QR */}
          <input type="hidden" name="location" value={source} />

          {/* Mostrar ubicación si viene de un QR conocido */}
          {locationLabel && (
            <div className="flex items-center gap-2 bg-primary-fixed/20 border border-primary/20 rounded-xl px-4 py-3">
              <span className="text-primary text-sm">📍</span>
              <p className="text-sm text-on-surface-variant">
                Registrándote desde: <span className="font-semibold text-primary">{locationLabel}</span>
              </p>
            </div>
          )}
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Nombre completo
            </label>
            <input
              type="text" id="name" name="name" required
              placeholder="Tu nombre"
              className="w-full bg-surface-dim border border-outline-variant rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Correo electrónico
            </label>
            <input
              type="email" id="email" name="email" required
              placeholder="tu@correo.com"
              className="w-full bg-surface-dim border border-outline-variant rounded-xl px-4 py-3 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Productos */}
          <div>
            <label className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-3">
              Productos adquiridos
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(products ?? []).map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-fixed/10 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    name="products"
                    value={p.name}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">
                    {p.name}
                  </span>
                </label>
              ))}
            </div>
            <p className="font-body text-xs text-outline mt-2">Selecciona todos los productos que compraste.</p>
          </div>

          {/* Consentimiento de datos — Ley 1581 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="consent"
              required
              className="w-4 h-4 accent-primary mt-0.5 flex-shrink-0"
            />
            <span className="font-body text-xs text-on-surface-variant leading-relaxed">
              Acepto el{' '}
              <a
                href="/politica-de-datos"
                target="_blank"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                tratamiento de mis datos personales
              </a>{' '}
              conforme a la Ley 1581 de 2012.
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-primary text-surface rounded-full py-4 font-body text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Leaf size={15} />
            Enviar solicitud
          </button>

          <p className="text-center font-body text-xs text-outline">
            Recibirás un correo de confirmación una vez que aprobemos tu registro.
          </p>
        </form>
      </div>
    </div>
  )
}
