'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CartButton() {
  const toggleCart = useCartStore((state) => state.toggleCart)
  const cartCount = useCartStore((state) => state.cartCount())
  
  // Para evitar hydration mismatch en Next.js con Zustand persist
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button 
      onClick={toggleCart}
      className="relative text-foreground hover:text-primary transition-colors p-2"
    >
      <ShoppingBag size={24} />
      {mounted && cartCount > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-surface text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  )
}
