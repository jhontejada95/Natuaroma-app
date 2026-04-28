'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { createOrder } from './actions'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore()
  
  // Evitar hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-screen flex items-center justify-center">Cargando...</div>

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center space-y-6">
        <h1 className="text-3xl font-display text-primary">Tu carrito está vacío</h1>
        <p className="text-foreground/60">Agrega productos para continuar con el pago.</p>
        <a href="/" className="inline-block bg-primary text-surface px-6 py-3 rounded font-medium">Volver a la Tienda</a>
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    // Adjuntamos el carrito serializado al FormData
    formData.append('cartItems', JSON.stringify(items))
    await createOrder(formData)
    // Limpiamos el carrito (esto podría hacerse después de confirmar el pago también)
    clearCart()
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <a href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={20} /> Volver a la Tienda
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Formulario de Envío */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-display font-medium text-primary">Finalizar Compra</h1>
            <p className="text-foreground/60 mt-2">Completa tus datos para el envío. Todos los campos son obligatorios para la transportadora.</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium border-b border-outline-variant pb-2">Datos de Contacto</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Correo Electrónico</label>
                <input type="email" id="email" name="email" required className="w-full p-3 bg-surface-dim border border-outline-variant rounded focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium border-b border-outline-variant pb-2">Información de Envío</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre_completo" className="block text-sm font-medium mb-1">Nombre Completo</label>
                  <input type="text" id="nombre_completo" name="nombre_completo" required className="w-full p-3 bg-surface-dim border border-outline-variant rounded focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="cedula" className="block text-sm font-medium mb-1">Cédula de Ciudadanía</label>
                  <input type="text" id="cedula" name="cedula" required className="w-full p-3 bg-surface-dim border border-outline-variant rounded focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium mb-1">Teléfono Móvil</label>
                  <input type="tel" id="telefono" name="telefono" required className="w-full p-3 bg-surface-dim border border-outline-variant rounded focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium mb-1">Ciudad / Municipio</label>
                  <input type="text" id="ciudad" name="ciudad" required className="w-full p-3 bg-surface-dim border border-outline-variant rounded focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium mb-1">Dirección Completa (con referencias)</label>
                <input type="text" id="direccion" name="direccion" required className="w-full p-3 bg-surface-dim border border-outline-variant rounded focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full bg-primary text-surface py-4 rounded hover:bg-primary-container transition-colors font-medium flex items-center justify-center gap-2 text-lg">
                Proceder al Pago
              </button>
              <p className="flex items-center justify-center gap-2 text-xs text-foreground/50 mt-4">
                <ShieldCheck size={14} /> Tu información está protegida. Serás redirigido a Mercado Pago de forma segura.
              </p>
            </div>
          </form>
        </div>

        {/* Resumen del Carrito */}
        <div className="bg-surface-dim p-8 rounded-lg h-fit border border-outline-variant">
          <h2 className="text-xl font-display font-medium text-primary mb-6">Resumen del Pedido</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-surface rounded flex items-center justify-center text-[10px] text-primary/30 border border-outline-variant">
                      IMG
                    </div>
                    <span className="absolute -top-2 -right-2 bg-primary text-surface text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-sm max-w-[150px] truncate">{item.name}</span>
                </div>
                <span className="font-medium text-sm">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-foreground/70">
              <span>Subtotal</span>
              <span>${cartTotal().toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>Envío</span>
              <span>Calculado en el siguiente paso</span>
            </div>
            <div className="flex justify-between font-display font-medium text-xl text-primary pt-3 border-t border-outline-variant">
              <span>Total a pagar</span>
              <span>${cartTotal().toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
