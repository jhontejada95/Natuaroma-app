'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { X, Plus, Minus, ShoppingBag, Leaf, ArrowRight } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&q=80'

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, cartTotal } = useCartStore()

  return (
    <>
      <div
        className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-surface shadow-2xl z-50 flex flex-col border-l border-outline-variant transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf size={15} className="text-surface" />
            </div>
            <h2 className="font-display font-semibold text-xl text-primary">
              Tu Ritual
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-foreground/50">
                  ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={toggleCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-dim text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16 space-y-5">
              <div className="w-20 h-20 rounded-full bg-surface-dim flex items-center justify-center">
                <ShoppingBag size={32} className="text-foreground/20" />
              </div>
              <div className="space-y-2">
                <p className="font-display font-semibold text-foreground/60 text-lg">Tu bolsa esta vacia</p>
                <p className="text-sm text-foreground/40">Agrega productos para comenzar tu ritual</p>
              </div>
              <button
                onClick={toggleCart}
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline mt-2"
              >
                Explorar catalogo <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-5 hover:bg-surface-dim/50 transition-colors">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-dim flex-shrink-0 border border-outline-variant">
                    <Image
                      src={item.image_url && item.image_url.startsWith('http') ? item.image_url : FALLBACK_IMG}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-semibold text-primary text-sm leading-tight line-clamp-2">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/30 hover:text-error transition-colors flex-shrink-0 mt-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-surface-dim rounded-full border border-outline-variant overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-surface-container text-foreground/60 hover:text-foreground transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-primary">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-surface-container text-foreground/60 hover:text-foreground transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-display font-bold text-primary text-base">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant bg-surface-dim p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Subtotal</span>
                <span>${cartTotal().toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Envio</span>
                <span className="text-primary font-medium">Calculado en checkout</span>
              </div>
              <div className="flex justify-between font-display font-bold text-xl text-primary border-t border-outline-variant pt-3 mt-1">
                <span>Total</span>
                <span>${cartTotal().toLocaleString('es-CO')}</span>
              </div>
            </div>

            <a
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-primary text-surface py-4 rounded-full hover:bg-primary-container transition-all font-semibold flex items-center justify-center gap-2 text-base shadow-md hover:shadow-lg"
            >
              Finalizar compra
              <ArrowRight size={18} />
            </a>

            <button
              onClick={toggleCart}
              className="w-full text-center text-sm text-foreground/50 hover:text-primary transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
