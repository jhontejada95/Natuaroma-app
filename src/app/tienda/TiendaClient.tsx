'use client'

import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  images: string[] | null
  short_description: string | null
  categories: { name: string } | null
  [key: string]: any
}

type Category = { id: string; name: string; slug: string }

export function TiendaClient({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const searchParams = useSearchParams()
  const categoria = searchParams.get('categoria')

  const filtered = categoria
    ? products.filter((p) => (p.categories as any)?.name?.toLowerCase() === categoria.toLowerCase())
    : products

  return (
    <>
      {/* Category filter pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        <a
          href="/tienda"
          className={
            'px-6 py-2 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 ' +
            (!categoria
              ? 'bg-primary-container text-on-primary-container shadow-[0_4px_14px_rgba(56,75,59,0.15)]'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed')
          }
        >
          Todo
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={'/tienda?categoria=' + cat.name}
            className={
              'px-6 py-2 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 ' +
              (categoria?.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-primary-container text-on-primary-container shadow-[0_4px_14px_rgba(56,75,59,0.15)]'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed')
            }
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Masonry product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-32">
          <p className="font-display text-3xl italic text-on-surface-variant">
            Proximos botanicos llegando...
          </p>
        </div>
      ) : (
        <div className="masonry-grid">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className={
                'masonry-item' +
                (i % 3 === 1 ? ' md:mt-12' : '') +
                (i % 3 === 2 ? ' lg:mt-6' : '')
              }
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
