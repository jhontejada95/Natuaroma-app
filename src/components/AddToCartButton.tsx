'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { useState } from 'react'
import { Check } from 'lucide-react'

type Props = {
  product: { id: string; name: string; price: number; image_url: string }
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: Props) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (disabled) {
    return (
      <button
        disabled
        className="w-full py-4 rounded-full font-body text-xs uppercase tracking-widest bg-surface-dim text-outline cursor-not-allowed"
      >
        Agotado
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={'w-full py-4 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ambient-shadow ' +
        (added
          ? 'bg-primary-fixed text-primary'
          : 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary hover:text-on-secondary hover:scale-[1.01]')}
    >
      {added ? (
        <>
          <Check size={14} />
          Agregado al ritual
        </>
      ) : (
        'Agregar al ritual'
      )}
    </button>
  )
}
