'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { createOrder } from './actions'
import { ArrowLeft, ShieldCheck, Leaf, Package } from 'lucide-react'
import { useEffect, useState } from 'react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&q=80'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

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
          <h1 className="font-display text-3xl italic text-primary mb-2">Tu ritual esta vacio</h1>
          <p className="font-body text-on-surface-variant">Agrega productos para continuar con el pago.</p>
        </div>
        <a
          href="/tienda"
          className="inline-block bg-secondary-fixed text-on-secondary-fixed rounded-full px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all duration-300 ambient-shadow"
        >
          Explorar botanicos
        </a>
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    formData.append('cartItems', JSON.stringify(items))
    await createOrder(formData)
    clearCart()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 right-0 w-[35vw] h-[35vw] bg-primary-fixed-dim/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-secondary-fixed/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <a
          href="/tienda"
          className="inline-flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Seguir explorando
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-outline mb-2">Paso final</p>
              <h1 className="font-display text-4xl md:text-5xl italic text-primary leading-tight">
                Finalizar<br />tu Ritual
              </h1>
            </div>

            <form action={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-display text-xl text-primary border-b border-outline-variant pb-3">
                  Datos de Contacto
                </h2>
                <div>
                  <label htmlFor="email" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                    Correo Electronico
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    placeholder="tu@correo.com"
                    className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface placeholder:text-outline transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="font-display text-xl text-primary border-b border-outline-variant pb-3">
                  Informacion de Envio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre_completo" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text" id="nombre_completo" name="nombre_completo" required
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="cedula" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                      Cedula
                    </label>
                    <input
                      type="text" id="cedula" name="cedula" required
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="telefono" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                      Telefono Movil
                    </label>
                    <input
                      type="tel" id="telefono" name="telefono" required
                      placeholder="+57 300 000 0000"
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface placeholder:text-outline transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="ciudad" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text" id="ciudad" name="ciudad" required
                      placeholder="Bogota, Medellin..."
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface placeholder:text-outline transition-colors duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="direccion" className="block font-body text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                    Direccion Completa
                  </label>
                  <input
                    type="text" id="direccion" name="direccion" required
                    placeholder="Calle, numero, barrio, referencias..."
                    className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-3 font-body text-on-surface placeholder:text-outline transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  className="w-full bg-secondary-fixed text-on-secondary-fixed rounded-full py-4 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim hover:scale-[1.01] transition-all duration-300 ambient-shadow flex items-center justify-center gap-3"
                >
                  <Leaf size={16} />
                  Proceder al Pago
                </button>
                <p className="flex items-center justify-center gap-2 font-body text-xs text-on-surface-variant/50">
                  <ShieldCheck size={14} />
                  Seras redirigido a Mercado Pago de forma segura
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="organic-card-2 bg-surface-container-low p-8 ambient-shadow">
              <h2 className="font-display text-2xl italic text-primary mb-6">Tu Pedido</h2>
              <div className="space-y-5 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-dim">
                      <Image
                        src={item.image_url && item.image_url.startsWith('http') ? item.image_url : FALLBACK_IMG}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-surface text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-on-surface truncate">{item.name}</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">
                        ${item.price.toLocaleString('es-CO')} c/u
                      </p>
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
                  <span>${cartTotal().toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between font-body text-sm text-on-surface-variant">
                  <span>Envio</span>
                  <span className="text-primary font-medium">A coordinar</span>
                </div>
                <div className="flex justify-between font-display text-xl text-primary border-t border-outline-variant pt-4">
                  <span>Total</span>
                  <span>${cartTotal().toLocaleString('es-CO')} COP</span>
                </div>
              </div>
            </div>
            <div className="organic-card-3 bg-primary-fixed/30 p-6 space-y-3">
              {[
                { icon: '🌿', text: 'Productos 100% naturales y artesanales' },
                { icon: '📦', text: 'Empaque ecologico y biodegradable' },
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
