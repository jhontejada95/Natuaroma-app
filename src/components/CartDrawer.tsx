'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, cartTotal } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-surface shadow-2xl z-50 flex flex-col border-l border-outline-variant animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="font-display font-medium text-xl flex items-center gap-2 text-primary">
            <ShoppingBag size={20} />
            Tu Ritual
          </h2>
          <button onClick={toggleCart} className="text-foreground/50 hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-foreground/50">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Tu bolsa está vacía.</p>
              <button 
                onClick={toggleCart}
                className="text-primary hover:underline font-medium"
              >
                Continuar explorando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-surface-dim p-4 rounded-lg">
                <div className="w-20 h-20 bg-surface rounded flex items-center justify-center flex-shrink-0">
                  {/* Image placeholder */}
                  <span className="text-[10px] text-primary/30">IMG</span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-primary text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-foreground/70 font-medium text-sm mt-1">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-surface rounded border border-outline-variant">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-surface-container-low text-foreground/70 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-primary">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-surface-container-low text-foreground/70 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-error/70 hover:text-error text-xs font-medium"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant bg-surface-dim space-y-4">
            <div className="flex items-center justify-between text-primary">
              <span className="font-medium">Subtotal</span>
              <span className="font-display font-medium text-xl">
                ${cartTotal().toLocaleString('es-CO')}
              </span>
            </div>
            <p className="text-xs text-foreground/50">
              Impuestos y costos de envío calculados en el checkout.
            </p>
            <a 
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-primary text-surface py-4 rounded hover:bg-primary-container transition-colors font-medium flex items-center justify-center gap-2"
            >
              Ir a Pagar
            </a>
          </div>
        )}
      </div>
    </>
  )
}
