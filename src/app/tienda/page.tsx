import type { Metadata } from 'next'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Tienda — Natuaroma',
  description: 'Explora nuestra cosecha de aceites esenciales, velas aromaticas y rituales naturales artesanales hechos en Colombia.',
  openGraph: { title: 'Tienda Natuaroma — Botanicos artesanales de Colombia', description: 'Aceites esenciales, velas aromaticas y rituales naturales 100% artesanales.' },
}

import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name, slug'),
  ])

  const filtered = params?.categoria
    ? products?.filter((p) => (p.categories as any)?.name?.toLowerCase() === params.categoria?.toLowerCase())
    : products

  return (
    <div className="relative overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-primary-fixed-dim/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[40%] left-[-5%] w-[35vw] h-[35vw] bg-secondary-fixed/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        {/* Header */}
        <header className="max-w-3xl mx-auto text-center mb-20 mt-8">
          <h1 className="font-display text-5xl md:text-6xl text-primary italic mb-6">
            Nuestra Cosecha
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Recolectado con intencion, curado con reverencia. Cada elemento proviene de la tierra colombiana,
            preservando las imperfecciones poeticas de la naturaleza.
          </p>
        </header>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <a
            href="/tienda"
            className={'px-6 py-2 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 ' +
              (!params?.categoria
                ? 'bg-primary-container text-on-primary-container shadow-[0_4px_14px_rgba(56,75,59,0.15)]'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed')}
          >
            Todo
          </a>
          {categories?.map((cat) => (
            <a
              key={cat.id}
              href={'/tienda?categoria=' + cat.name}
              className={'px-6 py-2 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 ' +
                (params?.categoria?.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-primary-container text-on-primary-container shadow-[0_4px_14px_rgba(56,75,59,0.15)]'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed')}
            >
              {cat.name}
            </a>
          ))}
        </div>

        {/* Masonry product grid */}
        {!filtered || filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-3xl italic text-on-surface-variant">
              Proximos botanicos llegando...
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((product, i) => (
              <div key={product.id} className={'masonry-item' + (i % 3 === 1 ? ' md:mt-12' : '') + (i % 3 === 2 ? ' lg:mt-6' : '')}>
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
