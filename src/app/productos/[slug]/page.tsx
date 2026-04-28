import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ArrowLeft } from 'lucide-react'

const FALLBACK_IMAGES: Record<string, string> = {
  aceites: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80',
  aromas: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=900&q=80',
  velas: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=900&q=80',
  default: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=900&q=80',
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!product) notFound()

  const categoryName = (product.categories as any)?.name?.toLowerCase() ?? 'default'
  const imageUrl =
    product.images && product.images.length > 0 && product.images[0].startsWith('http')
      ? product.images[0]
      : FALLBACK_IMAGES[categoryName] ?? FALLBACK_IMAGES.default

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-10 right-0 w-[35vw] h-[35vw] bg-primary-fixed-dim/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-10 pb-2">
        <a
          href="/tienda"
          className="inline-flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al catalogo
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left: image */}
          <div className="relative">
            <div className="organic-card-1 overflow-hidden ambient-shadow-lg aspect-square relative">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {(product.categories as any)?.name && (
                <div className="absolute top-5 left-5">
                  <span className="font-body text-[10px] uppercase tracking-widest bg-surface/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full">
                    {(product.categories as any).name}
                  </span>
                </div>
              )}
            </div>

            {/* Floating organic accent */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-fixed/30 organic-blob blur-2xl pointer-events-none" />
          </div>

          {/* Right: info */}
          <div className="space-y-8 lg:pt-6">
            {/* Category label */}
            {(product.categories as any)?.name && (
              <p className="font-body text-xs uppercase tracking-[0.2em] text-outline">
                {(product.categories as any).name}
              </p>
            )}

            <h1 className="font-display text-5xl md:text-6xl text-primary leading-[1.1] italic">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="font-body text-lg text-on-surface-variant leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 py-6 border-y border-outline-variant">
              <span className="font-display text-4xl text-primary">
                ${product.price.toLocaleString('es-CO')}
              </span>
              <span className="font-body text-sm text-outline">COP</span>
            </div>

            {/* Stock */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 font-body text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-on-surface-variant">
                  {product.stock <= 5
                    ? 'Solo quedan ' + product.stock + ' unidades'
                    : 'En stock — listo para enviar'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-body text-sm text-error">
                <div className="w-2 h-2 bg-error rounded-full" />
                Agotado temporalmente
              </div>
            )}

            {/* CTA */}
            <AddToCartButton
              product={{ id: product.id, name: product.name, price: product.price, image_url: imageUrl }}
              disabled={product.stock === 0}
            />

            {/* Alma Botanica section */}
            <div className="bg-surface-container-low organic-card-2 p-6 space-y-2">
              <p className="font-display text-sm italic text-primary">Alma Botanica</p>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Proveniente de las montanas colombianas, trabajado artesanalmente para preservar
                la integridad de cada planta. Sin quimicos, sin atajos — solo naturaleza pura.
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-outline-variant">
              {[
                ['100% Natural', 'Sin quimicos'],
                ['Envio nacional', 'Todo Colombia'],
                ['Compra segura', 'Mercado Pago'],
              ].map(([title, desc]) => (
                <div key={title} className="text-center">
                  <p className="font-body text-xs font-semibold text-primary">{title}</p>
                  <p className="font-body text-[10px] text-on-surface-variant mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
