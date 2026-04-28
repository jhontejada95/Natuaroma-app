'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
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

const CARD_SHAPES = ['organic-pebble', 'organic-pebble-alt', 'organic-card-1']
const CARD_BG = [
  'bg-surface-container-low',
  'bg-surface-variant',
  'bg-primary-fixed-dim/30',
  'bg-surface-container-highest',
]

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
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const imageUrl = getImageUrl(product.images, (product.categories as any)?.name)
  const shape = CARD_SHAPES[index % CARD_SHAPES.length]
  const bg = CARD_BG[index % CARD_BG.length]

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem({ id: product.id, name: product.name, price: product.price, image_url: imageUrl })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <a
      href={'/productos/' + product.slug}
      className={'group block ' + bg + ' ' + shape + ' p-6 transition-all duration-500 hover:product-shadow hover:-translate-y-2 relative overflow-hidden'}
    >
      {/* Product image with organic mask */}
      <div className="organic-pebble-img overflow-hidden mb-6 bg-surface-dim aspect-[4/5] relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-display text-xl text-primary leading-tight">{product.name}</h3>
        <span className="font-body text-sm text-on-surface-variant mt-1 ml-2 flex-shrink-0">
          ${product.price.toLocaleString('es-CO')}
        </span>
      </div>

      {product.short_description && (
        <p className="font-body text-sm text-on-surface-variant mb-5 line-clamp-2 leading-relaxed">
          {product.short_description}
        </p>
      )}

      {(product.categories as any)?.name && (
        <p className="font-body text-[10px] uppercase tracking-widest text-outline mb-4">
          {(product.categories as any).name}
        </p>
      )}

      <button
        onClick={handleAddToCart}
        className={'w-full py-3 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ' +
          (added
            ? 'bg-primary-fixed text-primary'
            : 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary hover:text-on-secondary')}
      >
        {added ? 'Agregado!' : 'Agregar al ritual'}
      </button>
    </a>
  )
}
