'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

type Props = {
  product: {
    id: string
    name: string
    price: number
    image_url?: string
  }
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: Props) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    if (disabled) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold text-lg transition-all duration-200 shadow-md ${
        disabled
          ? 'bg-surface-container text-foreground/40 cursor-not-allowed shadow-none'
          : added
          ? 'bg-primary-fixed text-primary-fixed-variant shadow-none'
          : 'bg-primary text-surface hover:bg-primary-container hover:shadow-xl hover:-translate-y-0.5'
      }`}
    >
      {added ? (
        <>
          <Check size={20} />
          ¡Agregado al carrito!
        </>
      ) : (
        <>
          <ShoppingBag size={20} />
          {disabled ? 'Agotado' : 'Agregar al Carrito'}
        </>
      )}
    </button>
  )
}
