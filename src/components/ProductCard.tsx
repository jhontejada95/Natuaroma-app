'use client'

import { useCartStore } from '@/lib/store/cartStore'

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    categories: { name: string } | null
    images: string[] | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="bg-surface-dim rounded-lg p-6 group cursor-pointer transition-all hover:shadow-md flex flex-col">
      <div className="aspect-square bg-surface rounded mb-6 flex items-center justify-center text-primary/20 overflow-hidden relative">
        {/* En un entorno real aquí iría next/image */}
        {product.images && product.images.length > 0 ? (
          <span className="text-sm">Imagen: {product.images[0]}</span>
        ) : (
          <span>[ Imagen Producto ]</span>
        )}
      </div>
      <div className="space-y-2 text-center flex-1 flex flex-col">
        {/* @ts-ignore */}
        <span className="text-xs tracking-widest uppercase text-foreground/50 font-semibold">{product.categories?.name}</span>
        <h3 className="font-display text-xl font-medium text-primary">{product.name}</h3>
        <p className="text-foreground/80 font-medium">${product.price.toLocaleString('es-CO')}</p>
        <div className="mt-auto pt-4">
          <button 
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.images?.[0]
            })}
            className="w-full bg-primary text-surface py-3 rounded hover:bg-primary-container transition-colors font-medium"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}
