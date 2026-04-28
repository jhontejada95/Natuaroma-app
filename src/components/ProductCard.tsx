'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { ShoppingBag, Leaf } from 'lucide-react'
import { useState } from 'react'

const FALLBACK_IMAGES: Record<string, string> = {
  aceites: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
  aromas: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80',
  velas: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80',
}

function getImageUrl(images: string[] | null, categoryName?: string | null): string {
  if (images && images.length > 0 && images[0].startsWith('http')) return images[0]
  const key = categoryName?.toLowerCase() ?? 'default'
  return FALLBACK_IMAGES[key] ?? FALLBACK_IMAGES.default
}

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    slug: string
    short_description?: string | null
    categories: { name: string } | null
    images: string[] | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const imageUrl = getImageUrl(product.images, (product.categories as any)?.name)

  function handleAddToCart() {
    addItem({ id: product.id, name: product.name, price: product.price, image_url: imageUrl })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const btnClass = added
    ? 'bg-primary-fixed text-primary-fixed-variant'
    : 'bg-primary text-surface hover:bg-primary-container hover:shadow-md'

  return (
    <article className="group bg-surface rounded-2xl overflow-hidden border border-outline-variant hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col">
      <a href={'/productos/' + product.slug} className="block relative aspect-[4/3] overflow-hidden bg-surface-dim">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {(product.categories as any)?.name && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-surface/90 backdrop-blur-sm text-primary text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
              <Leaf size={10} />
              {(product.categories as any).name}
            </span>
          </div>
        )}
      </a>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <a href={'/productos/' + product.slug}>
            <h3 className="font-display text-lg font-semibold text-primary leading-tight hover:text-primary-container transition-colors">
              {product.name}
            </h3>
          </a>
          {product.short_description && (
            <p className="text-sm text-foreground/60 mt-1 line-clamp-2 leading-relaxed">{product.short_description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant">
          <div>
            <p className="font-display text-xl font-bold text-primary">${product.price.toLocaleString('es-CO')}</p>
            <p className="text-[10px] text-foreground/50 uppercase tracking-wide">COP</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={'flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ' + btnClass}
          >
            <ShoppingBag size={15} />
            {added ? 'Listo!' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
