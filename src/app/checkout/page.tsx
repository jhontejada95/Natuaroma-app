'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { createOrder } from './actions'
import { ArrowLeft, ShieldCheck, Leaf, Package, MapPin, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DEPARTMENTS, SHIPPING_COSTS, getShippingCost, type ShippingZone } from '@/lib/shipping'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&q=80'

const inputClass = "w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface placeholder:text-outline transition-colors duration-300"
const labelClass = "block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2"

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [departamento, setDepartamento] = useState('')
  const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null)
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!departamento) { setShippingZone(null); setShippingCost(0); return }
    const { zone, cost } = getShippingCost(departamento)
    setShippingZone(zone)
    setShippingCost(cost)
  }, [departamento])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="w-24 h-24 organic-blob bg-surface-container flex items-center justify-center">
          <Package size={36} className="text-outline" />
        </div>
        <div>
          <h1 className="font-display text-3xl italic text-primary mb-2">Tu ritual está vacío</h1>
          <p className="font-body text-on-surface-variant">Agrega productos para continuar con el pago.</p>
        </div>
        <a href="/tienda" className="inline-block bg-secondary-fixed text-on-secondary-fixed rounded-full px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all duration-300 ambient-shadow">
          Explorar botánicos
        </a>
      </div>
    )
  }

  const subtotal = cartTotal()
  const total = subtotal + shippingCost
  const noCoverage = shippingZone === 'no_coverage'

  const handleSubmit = async (formData: FormData) => {
    formData.append('cartItems', JSON.stringify(items))
    formData.append('shipping_cost', shippingCost.toString())
    await createOrder(formData)
    clearCart()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 right-0 w-[35vw] h-[35vw] bg-primary-fixed-dim/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-secondary-fixed/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <a href="/tienda" className="inline-flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors mb-10">
          <ArrowLeft size={16} /> Seguir explorando
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Formulario */}
          <div className="space-y-8">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-outline mb-2">Paso final</p>
              <h1 className="font-display text-4xl md:text-5xl italic text-primary leading-tight">
                Finalizar<br />tu Ritual
              </h1>
            </div>

            <form action={handleSubmit} className="space-y-8">
              {/* Datos de contacto */}
              <div className="space-y-4">
                <h2 className="font-display text-xl text-primary border-b border-outline-variant pb-3">Datos de Contacto</h2>
                <div>
                  <label htmlFor="email" className={labelClass}>Correo Electrónico</label>
                  <input type="email" id="email" name="email" required placeholder="tu@correo.com" className={inputClass} />
                </div>
              </div>

              {/* Información de envío */}
              <div className="space-y-5">
                <h2 className="font-display text-xl text-primary border-b border-outline-variant pb-3">Información de Envío</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre_completo" className={labelClass}>Nombre Completo</label>
                    <input type="text" id="nombre_completo" name="nombre_completo" required className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="cedula" className={labelClass}>Cédula</label>
                    <input type="text" id="cedula" name="cedula" required className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="telefono" className={labelClass}>Teléfono Móvil</label>
                    <input type="tel" id="telefono" name="telefono" required placeholder="+57 300 000 0000" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="departamento" className={labelClass}>Departamento</label>
                    <select
                      id="departamento"
                      name="departamento"
                      required
                      value={departamento}
                      onChange={e => setDepartamento(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface transition-colors duration-300"
                    >
                      <option value="">Selecciona tu departamento</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ciudad" className={labelClass}>Ciudad / Municipio</label>
                  <input type="text" id="ciudad" name="ciudad" required placeholder="Tu ciudad de entrega" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="direccion" className={labelClass}>Dirección Completa</label>
                  <input type="text" id="direccion" name="direccion" required placeholder="Calle, número, barrio, referencias..." className={inputClass} />
                </div>

                {/* Aviso sin cobertura */}
                {noCoverage && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed/40">
                    <AlertTriangle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body text-sm font-semibold text-primary">Próximamente en tu región</p>
                      <p className="font-body text-xs text-on-surface-variant mt-1">
                        Estamos trabajando para llevar Natuaroma a cada rincón de Colombia. Por ahora no tenemos cobertura en este departamento — escríbenos por WhatsApp y buscamos una solución juntos.
                      </p>
                    </div>
                  </div>
                )}

                {/* Info zona */}
                {shippingZone && !noCoverage && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-fixed/20">
                    <MapPin size={14} className="text-primary" />
                    <p className="font-body text-xs text-primary">
                      Envío estimado: <strong>${shippingCost.toLocaleString('es-CO')} COP</strong>
                      {shippingZone === 3 ? ' · 4-8 días hábiles' : shippingZone === 2 ? ' · 2-3 días hábiles' : ' · 1-2 días hábiles'}
                    </p>
                  </div>
                )}
              </div>

              {/* Botón */}
              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={noCoverage || !departamento}
                  className="w-full bg-secondary-fixed text-on-secondary-fixed rounded-full py-4 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim hover:scale-[1.01] transition-all duration-300 ambient-shadow flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Leaf size={16} />
                  Proceder al Pago — ${total.toLocaleString('es-CO')} COP
                </button>
                <p className="flex items-center justify-center gap-2 font-body text-xs text-on-surface-variant/50">
                  <ShieldCheck size={14} />
                  Serás redirigido a Mercado Pago de forma segura
                </p>
              </div>
            </form>
          </div>

          {/* Resumen */}
          <div className="space-y-6">
            <div className="organic-card-2 bg-surface-container-low p-8 ambient-shadow">
              <h2 className="font-display text-2xl italic text-primary mb-6">Tu Pedido</h2>
              <div className="space-y-5 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-dim">
                      <Image
                        src={item.image_url && item.image_url.startsWith('http') ? item.image_url : FALLBACK_IMG}
                        alt={item.name} fill className="object-cover" unoptimized
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-surface text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-on-surface truncate">{item.name}</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">${item.price.toLocaleString('es-CO')} c/u</p>
                    </div>
                    <p className="font-display font-semibold text-sm text-primary flex-shrink-0">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant pt-5 space-y-3">
                <div className="flex justify-between font-body text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between font-body text-sm text-on-surface-variant">
                  <span>Envío</span>
                  {!departamento ? (
                    <span className="text-outline italic text-xs">Selecciona tu departamento</span>
                  ) : noCoverage ? (
                    <span className="text-outline italic text-xs">Sin cobertura</span>
                  ) : (
                    <span className="text-primary font-medium">${shippingCost.toLocaleString('es-CO')} COP</span>
                  )}
                </div>
                <div className="flex justify-between font-display text-xl text-primary border-t border-outline-variant pt-4">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
            </div>

            <div className="organic-card-3 bg-primary-fixed/30 p-6 space-y-3">
              {[
                { icon: '🌿', text: 'Productos 100% naturales y artesanales' },
                { icon: '📦', text: 'Empaque ecológico y biodegradable' },
                { icon: '🇨🇴', text: 'Hecho en Colombia con amor' },
                { icon: '🔐', text: 'Pago seguro via Mercado Pago' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-base">{icon}</span>
                  <p className="font-body text-xs text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
