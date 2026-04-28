import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { Leaf, SlidersHorizontal } from 'lucide-react'

export const metadata = {
  title: 'Tienda | Natuaroma',
  description: 'Explora nuestro catálogo completo de productos naturales para tu bienestar.',
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const supabase = await createClient()

  // Traer categorías para filtros
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  // Construir query de productos
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (categoria) {
    query = query.eq('categories.slug', categoria)
  }

  const { data: products } = await query

  // Filtrar en memoria si hay categoria activa (join filter workaround)
  const filtered = categoria
    ? products?.filter((p) => (p.categories as any)?.slug === categoria)
    : products

  return (
    <div className="min-h-screen bg-background">
      {/* Header de sección */}
      <div className="bg-primary text-surface py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-surface/60 text-sm font-medium">
            <a href="/" className="hover:text-surface transition-colors">Inicio</a>
            <span>/</span>
            <span>Tienda</span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Catálogo Natuaroma
          </h1>
          <p className="text-surface/70 text-lg max-w-lg leading-relaxed">
            Productos elaborados con ingredientes 100% naturales para tu bienestar físico y emocional.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filtros por categoría */}
        {categories && categories.length > 0 && (
          <div className="flex items-center gap-3 mb-10 flex-wrap">
            <div className="flex items-center gap-1.5 text-foreground/50 text-sm mr-2">
              <SlidersHorizontal size={14} />
              Filtrar:
            </div>
            <a
              href="/tienda"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                !categoria
                  ? 'bg-primary text-surface border-primary shadow-sm'
                  : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary'
              }`}
            >
              <Leaf size={12} />
              Todos
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/tienda?categoria=${cat.slug || cat.name.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  categoria === (cat.slug || cat.name.toLowerCase())
                    ? 'bg-primary text-surface border-primary shadow-sm'
                    : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Contador de resultados */}
        <p className="text-sm text-foreground/50 mb-8">
          {filtered?.length ?? 0} producto{(filtered?.length ?? 0) !== 1 ? 's' : ''} encontrado{(filtered?.length ?? 0) !== 1 ? 's' : ''}
          {categoria && <span> en <strong className="text-primary capitalize">{categoria}</strong></span>}
        </p>

        {/* Grid de productos */}
        {filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="w-20 h-20 bg-surface-dim rounded-full flex items-center justify-center">
              <Leaf size={32} className="text-foreground/20" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground/50">
              No hay productos aquí aún
            </h3>
            <p className="text-sm text-foreground/40 max-w-xs">
              {categoria
                ? 'Prueba con otra categoría o ve al catálogo completo.'
                : 'El catálogo está en preparación. Vuelve pronto.'}
            </p>
            {categoria && (
              <a href="/tienda" className="text-primary font-medium hover:underline text-sm">
                Ver todo el catálogo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
